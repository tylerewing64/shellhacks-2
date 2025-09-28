const express = require('express');
const router = express.Router();
const OrganizationController = require('../controllers/OrganizationController');
const { authenticateToken } = require('../middleware/auth');

// GET /api/organizations
router.get('/', OrganizationController.getAllOrganizations);

// GET /api/organizations/categories
router.get('/categories', OrganizationController.getCategories);

// GET /api/organizations/stats
router.get('/stats', OrganizationController.getStats);

// GET /api/organizations/:id
router.get('/:id', OrganizationController.getOrganizationById);

// POST /api/organizations (Admin only - would need additional middleware)
router.post('/', authenticateToken, OrganizationController.createOrganization);

module.exports = router;
