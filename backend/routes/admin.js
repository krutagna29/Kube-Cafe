const express = require('express');
const router = express.Router();
const { adminLogin, getAdminDashboard } = require('../controllers/adminController');
const userController = require('../controllers/userController');
const orderController = require('../controllers/orderController');
const { adminProtect } = require('../middleware/auth');
const { validateAdminLogin } = require('../middleware/validation');

// Admin login
router.post('/login', validateAdminLogin, adminLogin);

// Admin dashboard (protected, placeholder)
router.get('/dashboard', adminProtect, getAdminDashboard);

// Admin: get all users
router.get('/users', adminProtect, userController.getAllUsers);

// Admin: get all orders
router.get('/orders', adminProtect, orderController.getAllOrders);

module.exports = router; 