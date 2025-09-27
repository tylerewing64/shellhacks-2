const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/user/profile
router.get('/profile', authenticateToken, UserController.getProfile);

module.exports = router;
