const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, adminProtect } = require('../middleware/auth');
const { validateCreateOrder, validateUpdateOrderStatus } = require('../middleware/validation');

router.post('/', protect, validateCreateOrder, orderController.createOrder);
router.get('/my', protect, orderController.getMyOrders);
router.get('/', adminProtect, orderController.getAllOrders);
router.put('/:id', adminProtect, validateUpdateOrderStatus, orderController.updateOrderStatus);

module.exports = router; 