const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const checkoutController = require('../controllers/checkoutController');
const { validateCreateOrder } = require('../middleware/validation');

// Create order via full checkout flow
router.post('/', protect, validateCreateOrder, checkoutController.createCheckoutOrder);

module.exports = router;

