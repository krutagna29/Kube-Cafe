const orderModel = require('../models/orderModel');
const { success, error, serverError } = require('../utils/response');

exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  const { items, total_amount } = req.body;
  try {
    const id = await orderModel.createOrder(userId, items, total_amount);
    return success(res, 'Order created successfully', { id }, 201);
  } catch (err) {
    return serverError(res, 'Failed to create order', err);
  }
};

exports.getMyOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await orderModel.getOrdersByUser(userId);
    return success(res, 'Orders retrieved successfully', orders);
  } catch (err) {
    return serverError(res, 'Failed to fetch orders', err);
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = await orderModel.getAllOrders(page, limit);
    return success(res, 'All orders retrieved successfully', result);
  } catch (err) {
    return serverError(res, 'Failed to fetch orders', err);
  }
};

exports.updateOrderStatus = async (req, res) => {
  const orderId = req.params.id;
  const { status } = req.body;
  try {
    await orderModel.updateOrderStatus(orderId, status);
    return success(res, 'Order status updated successfully');
  } catch (err) {
    return serverError(res, 'Failed to update order status', err);
  }
}; 