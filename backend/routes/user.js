const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { adminProtect } = require('../middleware/auth');

router.get('/', adminProtect, userController.getAllUsers);

module.exports = router; 