const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

// POST /api/auth/register
router.post('/register', AuthController.register);

// POST /api/auth/login
router.post('/login', AuthController.login);

// GET /api/auth/verify
router.get('/verify', AuthController.verifyToken);

module.exports = router;
