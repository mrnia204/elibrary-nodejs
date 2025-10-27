import { pool } from '../db/pool.js';
import bcrypt from 'bcrypt';

// GET /getStudent
export const getStudent = async (req, res) => {
  console.log("req.query", req.query);
   const { user_id} = req.query;

  if (!user_id) {
    return res.status(400).json({ success: false, message: 'Username is required'});
  }

    // convert string to number
  const userIdNum = Number(user_id);
  if (isNaN(userIdNum)) {
    return res.status(400).json({success: false, message: "Invalid user id"})
  }

  try {
   
    const [rows] = await pool.query('SELECT * FROM students WHERE user_id = ?', [userIdNum]);

    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: "Student not found"});
    }

    return res.json({ success: true, data: rows[0]});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Database error"});
  }
};


// POST /register-student
export const registerStudent = async(req, res) => {
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
};

