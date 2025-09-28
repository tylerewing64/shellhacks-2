const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { authenticateToken } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(authenticateToken);

// Get all dashboard data
router.get('/', DashboardController.getAllDashboardData);

// Individual dashboard endpoints
router.get('/impact-overview', DashboardController.getImpactOverview);
router.get('/recent-activity', DashboardController.getRecentActivity);
router.get('/charity-suggestions', DashboardController.getCharitySuggestions);
router.get('/goals-progress', DashboardController.getGoalsProgress);
router.get('/charity-updates', DashboardController.getCharityUpdates);

module.exports = router;
