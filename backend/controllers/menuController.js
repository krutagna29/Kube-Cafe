const menuModel = require('../models/menuItemModel');
const { success, error, serverError } = require('../utils/response');

exports.getAllMenuItems = async (req, res) => {
  try {
    // For admin, support pagination; for public, return all
    const page = req.query.page ? parseInt(req.query.page) : null;
    const limit = req.query.limit ? parseInt(req.query.limit) : null;
    const items = await menuModel.getAllMenuItems(page, limit);
    return success(res, 'Menu items retrieved successfully', items);
  } catch (err) {
    return serverError(res, 'Failed to fetch menu items', err);
  }
};

exports.createMenuItem = async (req, res) => {
  const { name, category_id, description, price } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    const id = await menuModel.createMenuItem(name, category_id, description, price, image);
    return success(res, 'Menu item created successfully', { id }, 201);
  } catch (err) {
    return serverError(res, 'Failed to create menu item', err);
  }
};

exports.updateMenuItem = async (req, res) => {
  const { name, category_id, description, price } = req.body;
  const image = req.file ? req.file.filename : req.body.image;
  try {
    await menuModel.updateMenuItem(req.params.id, name, category_id, description, price, image);
    return success(res, 'Menu item updated successfully');
  } catch (err) {
    return serverError(res, 'Failed to update menu item', err);
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    await menuModel.deleteMenuItem(req.params.id);
    return success(res, 'Menu item deleted successfully');
  } catch (err) {
    return serverError(res, 'Failed to delete menu item', err);
  }
};

exports.getCategories = async (req, res) => {
  const pool = require('../config/database');
  try {
    const [rows] = await pool.query('SELECT id, name FROM menu_categories');
    return success(res, 'Categories retrieved successfully', rows);
  } catch (err) {
    return serverError(res, 'Failed to fetch categories', err);
  }
}; 