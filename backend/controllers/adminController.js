const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { success, error, serverError } = require('../utils/response');
// dotenv is loaded in server.js

// POST /api/admin/login
const adminLogin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [admins] = await pool.execute('SELECT * FROM admins WHERE username = ?', [username]);
    if (admins.length === 0) {
      return error(res, 'Invalid credentials', 401);
    }
    const admin = admins[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return error(res, 'Invalid credentials', 401);
    }
    const token = jwt.sign(
      { adminId: admin.id, username: admin.username },
      process.env.JWT_ADMIN_SECRET,
      { expiresIn: '24h' }
    );
    return success(res, 'Admin login successful', {
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (err) {
    console.error('Admin login error:', err);
    return serverError(res, 'Failed to login', err);
  }
};

// GET /api/admin/dashboard
const getAdminDashboard = async (req, res) => {
  try {
    const [[{ count: totalUsers }]] = await pool.execute('SELECT COUNT(*) as count FROM users');
    const [[{ count: totalMenuItems }]] = await pool.execute('SELECT COUNT(*) as count FROM menu_items');
    const [[{ count: totalOrders }]] = await pool.execute('SELECT COUNT(*) as count FROM orders');
    const [recentOrders] = await pool.execute(`
      SELECT o.*, u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.order_date DESC
      LIMIT 5
    `);
    return success(res, 'Dashboard data retrieved successfully', {
      stats: {
        totalUsers,
        totalMenuItems,
        totalOrders
      },
      recentOrders
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    return serverError(res, 'Failed to fetch dashboard data', err);
  }
};

module.exports = { adminLogin, getAdminDashboard }; 