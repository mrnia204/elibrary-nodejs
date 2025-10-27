import { pool } from '../db/pool.js';

export const authenticate = async  (req, res) => {
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
};
