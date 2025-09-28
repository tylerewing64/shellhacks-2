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

// Every.org API integration routes
// GET /api/organizations/every-org/search?q=pets&limit=10&causes=animals
router.get('/every-org/search', OrganizationController.searchEveryOrg);

// GET /api/organizations/every-org/browse?cause=animals&limit=10&page=1
router.get('/every-org/browse', OrganizationController.browseEveryOrg);

// GET /api/organizations/every-org/causes
router.get('/every-org/causes', OrganizationController.getEveryOrgCauses);

// GET /api/organizations/every-org/:identifier (slug, EIN, or ID)
router.get('/every-org/:identifier', OrganizationController.getEveryOrgNonprofit);

// POST /api/organizations/every-org/:identifier/sync
router.post('/every-org/:identifier/sync', authenticateToken, OrganizationController.syncNonprofit);

module.exports = router;
