const express = require('express');
const router = express.Router();
const { getStats, getUserEvents } = require('../controllers/dashboardController');
const { authenticateToken } = require('../middlewares/authMiddleware');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Private
 */
router.get('/stats', authenticateToken, getStats);

/**
 * @route   GET /api/dashboard/events
 * @desc    Get user's event history
 * @access  Private
 */
router.get('/events', authenticateToken, getUserEvents);

module.exports = router;
