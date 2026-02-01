const orderModel = require('../models/orderModel');
const { success, serverError } = require('../utils/response');
const crypto = require('crypto');

// Handles full checkout: delivery/pickup, payment mock, creates order + items
exports.createCheckoutOrder = async (req, res) => {
  const userId = req.user.id;
  const {
    customer_name,
    email,
    phone,
    order_type,        // 'delivery' | 'pickup'
    delivery_address,  // for delivery
    pickup_slot,       // e.g. 'in_20_min', 'in_40_min'
    items,             // [{menu_item_id, name, quantity, price}]
    subtotal,
    tax_amount,
    delivery_fee,
    coupon_code,
    discount_amount,
    final_amount,
    payment_method     // 'upi' | 'card' | 'cod'
  } = req.body;

  try {
    // 1) Mock payment status
    const payment_status = payment_method === 'cod' ? 'pending' : 'paid';

    // 2) Generate friendly order ID (display only)
    const display_order_id = 'KK-' + crypto.randomBytes(3).toString('hex').toUpperCase();

    // 3) Compute pickup_time hint string if pickup
    let pickup_time = null;
    if (order_type === 'pickup') {
      const now = new Date();
      const minutesToAdd = pickup_slot === 'in_40_min' ? 40 : 20;
      pickup_time = new Date(now.getTime() + minutesToAdd * 60000).toISOString();
    }

    // 4) Create order using a helper that stores rich data in notes JSON
    const orderId = await orderModel.createOrderWithCheckout({
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
    });

    return success(res, 'Order placed successfully', {
      orderId,
      displayOrderId: display_order_id,
      paymentStatus: payment_status,
      status: 'preparing'
    }, 201);
  } catch (err) {
    console.error('Checkout error:', err);
    return serverError(res, 'Failed to place order', err);
  }
};

