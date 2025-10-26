import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import multer from 'multer';
import { parse } from 'csv-parse';
import bcrypt from 'bcrypt';


const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true}));

// Parse JSON and form Submissions
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle formdata using multir (without saving files)
const upload = multer();

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password:'',
  database:  'elibrary_user_db',
  waitForConnections: true,
  connectionLimit:10,
});


// 1 POST /authenticate endpoint
app.post('/authenticate', upload.none(), async  (req, res) => {
  console.log("Incoming FormData:", req.body); // should show username, password, role.

  const {username, password, role} = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: "Username, password, and role are required."});
  }

  try {
    const sql = 'SELECT id, username, password, role FROM users WHERE username = ? AND password = ? AND role = ?';
    
    const [rows] = await pool.query(sql, [username, password, role]);

    if (rows.length > 0) {
      const user = rows[0];
      return res.json({
        success: true,
        user_id: user.id,
        username: user.username,
        role: user.role,
        message: "Login successful"
      });
    } else {
      return res.json({ success: false, message: "Invalid username, password, or role"});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Database error"});
  }
})


// 2 POST /log-activity
app.post('/log-activity', upload.none(), async (req, res) => {
  const {user_id, action , activity_id} = req.body;

  if (!user_id || !action) {
    return res.status(400).json({ status: "error", message: "User ID and action are required"});
  }

  try {
    if (action === 'login') {
      const sql = 'INSERT INTO activity_logs (user_id, login_time, time_spent) VALUES (?, NOW(), 0)';
      const [result] = await pool.query(sql, [user_id]);
      return res.json({
        status: "success",
        message: "login recorded",
        activity_id: result.insertId
      });

    } else if ( action === 'logout') {
      if (!activity_id) {
        return res.status(400).json({ status: 'error', message: "Activity ID is required for logout"});
      }

      const sql = `
        UPDATE activity_logs 
        SET logout_time = NOW(), 
          time_spent = TIMESTAMPDIFF(SECOND, login_time, NOW()) 
        WHERE id = ? AND user_id = ?
      `;

      await pool.query(sql, [activity_id, user_id]);
      return res.json({ status: 'success', message: "logout recorded"});

    }  else if (action === 'update') {
      if (!activity_id) {
        return res.status(400).json({ status: "error", message: "Activity id is required for update"});
      } 

      const sql = `
        UPDATE activity_logs 
        SET time_spent = TIMESTAMPDIFF(SECOND, login_time, NOW()) 
        WHERE id = ? AND user_id = ? AND logout_time IS NULL
      `;

      await pool.query(sql, [activity_id, user_id]);
      return res.json({ status: "success", message: 'Activity updated'});

    } else {
      return res.status(400).json({ status: "error", message: "Invalid action"});
    }
  } catch (error) {
    console.error('Database error', error);
    return res.status(500).json({ status: 'error', message: "Database error"});
  }
});


// 3 GET / Get total over in admin dashboard
app.get("/getDashboard", async (req, res) => {
  try {
    // -- 1. Total students --
    const [sutdentsResult] = await pool.query("SELECT COUNT(*) as total_students FROM students");
    const totalStudents = sutdentsResult[0].total_students || 0;

    // -- 2. Total Distinct Grades --
    const [gradesResult] = await pool.query("SELECT COUNT(DISTINCT grade) as total_grades FROM students WHERE grade IS NOT NULL AND grade != '' ");
    const totalGrades = gradesResult[0].total_grades || 0;

    // -- 3. Total Distinct Classes --
    const [classResult] = await pool.query("SELECT COUNT(DISTINCT class) as total_classes FROM students WHERE class IS NOT NULL AND class != '' ");
    const totalClasses = classResult[0].total_classes || 0;

    // -- 4. Total Hours spent by  Students --
    let totalHours = 0;
    try {
      const [tableCheck] = await pool.query("SHOW TABLES LIKE 'activity_logs'");
      if (tableCheck.length > 0) {
        const [columnCheck] = await pool.query("SHOW COLUMNS FROM activity_logs LIKE 'time_spent'");
        if (columnCheck.length > 0) {
          const [timeResult] = await pool.query("SELECT SUM(time_spent) as total_minutes FROM activity_logs WHERE time_spent IS NOT NULL AND time_spent > 0")
          const totlMinutes = timeResult[0].total_minutes || 0;
          totalHours = totlMinutes / 60;
        }
      }
    } catch (error) {
      console.error("Activity logs check failed:", error.message);
    }

    // -- 5. Students per Grade --
    const [studentsPerGradeResult] = await pool.query(`
      SELECT grade, COUNT(*) as student_count
      FROM students
      WHERE grade IS NOT NULL AND grade != ''
      GROUP BY grade
      ORDER BY grade
    `);
    const students_Per_Grade = studentsPerGradeResult;

    // -- 6. Recent Activity (Last 7 days) --
    let recentActivity = 0;
    try {
      const [tableCheck] = await pool.query("SHOW TABLES LIKE 'activity_logs'");
      if (tableCheck.length > 0) {
        const [columnCheck] = await pool.query("SHOW COLUMNS FROM activity_logs LIKE 'created_at'");
        if (columnCheck.length > 0) {
          const [recentResult] = await pool.query(`
            SELECT COUNT(*) as recent_count
            FROM activity_logs
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
          `);
          recentActivity = recentResult[0].recent_count || 0;
        }
      }
    } catch (error) {
      console.error("Recent activity check failed", error.message);
    }


    // -- 7. Student Management
    const [studentManagementResult] = await pool.query(`
      SELECT student_id, full_name, email, phone, grade, class, address
      FROM students
      WHERE student_id IS NOT NULL AND student_id != ''
      ORDER BY grade ASC
    `);
    const studentData = studentManagementResult;

    // 


    // Return all dashboard data
    return res.json({
      success: true,
      data: {
        total_students: totalStudents,
        total_grades: totalGrades,
        total_classes: totalClasses,
        total_hours: Math.round(totalHours * 100) / 100,
        recent_activity: recentActivity,
        student_per_grade: students_Per_Grade,
        student_data: studentData,

      }
    });

  } catch (error) {
    console.error("Dashboard error", error);
    return res.status(500).json({ success: false, message: "Database error" + error.message});
  }
  
});


// 4. POST / register student
app.post("/register-student", async (req, res) => {
  const {student_id, full_name, email, phone, grade, class: studentClass, address, username, password} = req.body;

  // Basic validation
  if (!student_id || !full_name || !email || !phone || !grade || !studentClass || !address || !username || !password) {
    return res.status(400).json({ success: false, message: "All fields are required."});
  }

  // validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Invalid email format"});
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // check if username exists
    const [userRows] = await connection.execute("SELECT id FROM users WHERE username = ?", [username]);
    if (userRows.length > 0) throw new Error("Username already exists");

    // Check if student_id exists
    const [studentIdRows] = await connection.execute("SELECT student_id FROM students WHERE student_id = ?", [student_id]);
    if (studentIdRows.length > 0) throw new Error("Student ID already exists");

    // INSERT into users table
    const hashedPassword = await bcrypt.hash(password, 10);
    const [userResult] = await connection.execute(
      "INSERT INTO users (username, password, role) VALUES(?, ?, 'student')",
      [username, hashedPassword]
    );

    const user_id = userResult.insertId;

    // INSERT into student table
    await connection.execute(
      "INSERT INTO students (user_id, student_id, full_name, email, phone, grade, class, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [user_id, student_id, full_name, email, phone, grade, studentClass, address]
    );

    await connection.commit();

    return res.json({ success: true, message:  "Student added successfully", user_id});

  } catch (error) {
    await connection.rollback();
    return res.status(500).json({ success: false, message: "Datebase error" + error.message });
  } finally {
    connection.release()
  }
});




// 5. POST / Bulk student data upload
app.post('/students/bulk', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({error: "CSV file is required"});

  const rows = [];

  parse(req.file.buffer.toString(), {columns: true, trim: true}, (err, data) => {
    if (err) return res.status(400).json({ error: "Invalid CSV format "});

    data.forEach(row => {
      rows.push([
        row.student_id,
        row.full_name,
        row.email || null,
        row.phone || null,
        row.grade,
        row.class,
        row.address || null,
        row.username,
        row.password,
      ]);
    });
  });
  try {
    if (rows.length === 0) return res.status(400).json({ error: "No data found in csv"});

    const sql = `INSERT INTO users (username, password, role) VALUES(?, ?, 'student')`;
    await pool.query(sql, [rows]);

    return res.json({ success: true, inserted: rows.length });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Database error"});
  }
});


// 6. POST student data to student dashboard. 
app.get('/getStudent', async (req, res) => {
  const { username} = req.body;
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required'});
  }

  try {
    const [rows] = await pool.query('SELECT * FROM students WHERE username = ?', [username]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Student not found"});
    }

    return res.json({ success: true, data: rows[0]});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Database error"});
  }
})

app.listen(3001, () => console.log("Node.js backend running on http://localhost:3001"));