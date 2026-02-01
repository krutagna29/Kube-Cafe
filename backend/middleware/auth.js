const jwt = require('jsonwebtoken');
const { error } = require('../utils/response');
// dotenv is loaded in server.js

exports.protect = (req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return error(res, 'Not authorized, no token', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return error(res, 'Not authorized, token failed', 401);
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') next();
  else return error(res, 'Admin access only', 403);
};

// Admin JWT middleware for /api/admin/* endpoints
exports.adminProtect = (req, res, next) => {
  let token = req.headers.authorization && req.headers.authorization.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) return error(res, 'Not authorized, no token', 401);

  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return error(res, 'Not authorized, admin token failed', 401);
  }
}; 