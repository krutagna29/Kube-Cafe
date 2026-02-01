const pool = require('../config/database');

exports.createMenuItem = async (name, category_id, description, price, image) => {
  const [result] = await pool.query(
    'INSERT INTO menu_items (name, category_id, description, price, image_url) VALUES (?, ?, ?, ?, ?)',
    [name, category_id, description, price, image]
  );
  return result.insertId;
};

exports.getAllMenuItems = async (page = null, limit = null) => {
  let query = `SELECT mi.*, mc.name as category
     FROM menu_items mi
     LEFT JOIN menu_categories mc ON mi.category_id = mc.id`;
  
  // If pagination is requested
  if (page && limit) {
    const offset = (page - 1) * limit;
    const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM menu_items');
    
    query += ` ORDER BY mi.created_at DESC LIMIT ? OFFSET ?`;
    const [rows] = await pool.query(query, [limit, offset]);
    
    return {
      items: rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }
  
  // No pagination - return all items (for public menu)
  const [rows] = await pool.query(query);
  return rows;
};

exports.getMenuItemById = async (id) => {
  const [rows] = await pool.query(
    `SELECT mi.*, mc.name as category
     FROM menu_items mi
     LEFT JOIN menu_categories mc ON mi.category_id = mc.id
     WHERE mi.id = ?`, [id]
  );
  return rows[0];
};

exports.updateMenuItem = async (id, name, category_id, description, price, image) => {
  await pool.query(
    'UPDATE menu_items SET name=?, category_id=?, description=?, price=?, image_url=? WHERE id=?',
    [name, category_id, description, price, image, id]
  );
};

exports.deleteMenuItem = async (id) => {
  await pool.query('DELETE FROM menu_items WHERE id=?', [id]);
}; 