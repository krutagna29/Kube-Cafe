const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { adminProtect } = require('../middleware/auth');
const { validateCreateMenuItem, validateUpdateMenuItem } = require('../middleware/validation');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', menuController.getAllMenuItems);
// For file uploads, multer must parse first, then validate the parsed body
router.post('/', adminProtect, upload.single('image'), validateCreateMenuItem, menuController.createMenuItem);
router.put('/:id', adminProtect, upload.single('image'), validateUpdateMenuItem, menuController.updateMenuItem);
router.delete('/:id', adminProtect, menuController.deleteMenuItem);
router.get('/categories', menuController.getCategories);

module.exports = router; 