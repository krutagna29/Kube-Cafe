const pool = require('../config/database');

exports.createUser = async (name, email, hashedPassword, role = 'user') => {
  try {
    // Check if role column exists
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'role'
    `);
    
    const hasRoleColumn = columns.length > 0;
    
    if (hasRoleColumn) {
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      return result.insertId;
    } else {
      // Fallback: insert without role column
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );
      return result.insertId;
    }
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

exports.findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

exports.getAllUsers = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  try {
    // Get total count
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM users');
    
    // Check if role column exists
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'users' 
      AND COLUMN_NAME = 'role'
    `);
    
    const hasRoleColumn = columns.length > 0;
    
    // Get paginated users - include role if column exists
    const selectFields = hasRoleColumn 
      ? 'id, name, email, role, created_at'
      : 'id, name, email, created_at';
    
    const [rows] = await pool.query(
      `SELECT ${selectFields} FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    // Add default role if column doesn't exist
    const users = rows.map(user => ({
      ...user,
      role: user.role || 'user'
    }));
    
    return {
      users: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    throw error;
  }
}; 