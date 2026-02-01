const pool = require('../config/database');

exports.createOrder = async (userId, items, total_amount) => {
  // Simple order creation (legacy)
  const [orderResult] = await pool.query(
    'INSERT INTO orders (user_id, total_amount) VALUES (?, ?)',
    [userId, total_amount]
  );
  const orderId = orderResult.insertId;

  // Insert order items
  for (const item of items) {
    await pool.query(
      'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
      [orderId, item.menu_item_id, item.quantity, item.price]
    );
  }

  return orderId;
};

// New helper for full checkout flow.
// NOTE: To avoid schema migrations, we store rich metadata in the `notes` column as JSON.
exports.createOrderWithCheckout = async (payload) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const {
      userId,
      customer_name,
      email,
      phone,
      order_type,
      delivery_address,
      pickup_time,
      items,
      subtotal,
      tax_amount,
      delivery_fee,
      coupon_code,
      discount_amount,
      final_amount,
      payment_method,
      payment_status,
      display_order_id
    } = payload;

    const notesPayload = {
      order_type,
      pickup_time,
      tax_amount,
      delivery_fee,
      coupon_code,
      discount_amount,
      final_amount,
      payment_method,
      payment_status,
      display_order_id,
      items
    };

    const [orderResult] = await conn.query(
      `INSERT INTO orders (
        user_id,
        total_amount,
        status,
        delivery_address,
        phone,
        notes
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userId,
        final_amount || subtotal,
        'preparing',
        delivery_address || null,
        phone || null,
        JSON.stringify(notesPayload)
      ]
    );

    const orderId = orderResult.insertId;

    // Insert line items
    for (const item of items) {
      await conn.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.menu_item_id, item.quantity, item.price]
      );
    }

    await conn.commit();
    return orderId;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.getOrdersByUser = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
  return rows;
};

exports.getAllOrders = async (page = 1, limit = 10) => {
  const offset = (page - 1) * limit;
  
  // Get total count
  const [[{ total }]] = await pool.query('SELECT COUNT(*) as total FROM orders');
  
  // Get paginated orders with user info
  const [orders] = await pool.query(`
    SELECT o.*, u.name as user_name, u.email as user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.order_date DESC
    LIMIT ? OFFSET ?
  `, [limit, offset]);

  // For each order, get its items (with menu item names)
  for (const order of orders) {
    const [items] = await pool.query(`
      SELECT oi.*, mi.name as menu_item_name
      FROM order_items oi
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `, [order.id]);
    order.items = items;
  }
  
  return {
    orders,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

exports.updateOrderStatus = async (orderId, status) => {
  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
}; 