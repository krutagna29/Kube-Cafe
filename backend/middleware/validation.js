const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

// User login validation
exports.validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Admin login validation
exports.validateAdminLogin = [
  body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
  body('password')
    .notEmpty().withMessage('Password is required'),
  handleValidationErrors
];

// Create order validation
exports.validateCreateOrder = [
  body('items')
    .isArray({ min: 1 }).withMessage('Items array is required and must contain at least one item'),
  body('items.*.menu_item_id')
    .isInt({ min: 1 }).withMessage('Invalid menu item ID'),
  body('items.*.quantity')
    .isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('total_amount')
    .isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('delivery_address')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Delivery address must be less than 500 characters'),
  body('phone')
    .optional()
    .trim()
    .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/).withMessage('Invalid phone number format'),
  handleValidationErrors
];

// Create menu item validation
exports.validateCreateMenuItem = [
  body('name')
    .trim()
    .notEmpty().withMessage('Menu item name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('category_id')
    .isInt({ min: 1 }).withMessage('Valid category ID is required'),
  body('price')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  handleValidationErrors
];

// Update menu item validation
exports.validateUpdateMenuItem = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('category_id')
    .optional()
    .isInt({ min: 1 }).withMessage('Valid category ID is required'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Description must be less than 500 characters'),
  handleValidationErrors
];

// Update order status validation
exports.validateUpdateOrderStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid order status'),
  handleValidationErrors
];

