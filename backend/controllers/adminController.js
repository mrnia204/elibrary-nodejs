import { pool } from '../db/pool.js';

export const adminDashboard = async (req, res) => {
   try {
    // -- 1. Total students --
    const [studentsResult] = await pool.query("SELECT COUNT(*) as total_students FROM students");
    const totalStudents = studentsResult[0].total_students || 0;

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
          const totalMinutes = timeResult[0].total_minutes || 0;
          totalHours = totalMinutes / 60;
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
    const studentsPerGrade = studentsPerGradeResult;

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


    // -- 7. Student Management -- 
    const [studentManagementResult] = await pool.query(`
      SELECT student_id, full_name, email, phone, grade, class, address
      FROM students
      WHERE student_id IS NOT NULL AND student_id != ''
      ORDER BY grade ASC
    `);
    const studentData = studentManagementResult;

    // -- 8. grades and class time spent 7 days  --
    const [timeSpentInWeek] = await pool.query(`
      SELECT s.grade, s.class, sum(a.time_spent) AS total_time_spent
      FROM students s JOIN activity_logs a ON s.user_id = a.user_id
      WHERE a.login_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY s.grade, s.class
      ORDER BY s.grade, s.class;
    `);
    const timeSpentinaWeek = timeSpentInWeek;
    // Return all dashboard data
    return res.json({
      success: true,
      data: {
        total_students: totalStudents,
        total_grades: totalGrades,
        total_classes: totalClasses,
        total_hours: Math.round(totalHours * 100) / 100,
        recent_activity: recentActivity,
        studentsPerGrade: studentsPerGrade,
        student_data: studentData,
        timeSpentInWeek: timeSpentinaWeek,

      }
    });

  } catch (error) {
    console.error("Dashboard error", error);
    return res.status(500).json({ success: false, message: "Database error" + error.message});
  }
};
