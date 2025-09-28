const express = require('express');
const router = express.Router();
const UserOrganizationController = require('../controllers/UserOrganizationController');
const { authenticateToken } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// Like an organization
router.post('/like', UserOrganizationController.likeOrganization);

// Unlike an organization
router.delete('/unlike/:ein', UserOrganizationController.unlikeOrganization);

// Get user's liked organizations
router.get('/', UserOrganizationController.getLikedOrganizations);

// Check if organization is liked
router.get('/check/:ein', UserOrganizationController.isOrganizationLiked);

module.exports = router;
