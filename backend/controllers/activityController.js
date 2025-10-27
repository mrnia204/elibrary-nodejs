import { pool } from '../db/pool.js';

export const logActivity = async (req, res) => {
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
};