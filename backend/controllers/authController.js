const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { success, error, serverError } = require('../utils/response');
require('dotenv').config({ path: './config.env' });

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser) return error(res, 'User already exists', 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser(name, email, hashedPassword);

    const token = jwt.sign({ id: userId, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return success(res, 'User registered successfully', { token }, 201);
  } catch (err) {
    return serverError(res, 'Failed to register user', err);
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findUserByEmail(email);
    if (!user) return error(res, 'Invalid credentials', 401);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return error(res, 'Invalid credentials', 401);

    // Default role to 'user' if role column doesn't exist
    const userRole = user.role || 'user';

    const token = jwt.sign({ id: user.id, role: userRole }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return success(res, 'Login successful', {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: userRole }
    });
  } catch (err) {
    return serverError(res, 'Failed to login', err);
  }
}; 