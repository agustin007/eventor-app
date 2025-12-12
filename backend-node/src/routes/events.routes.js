const express = require('express');
const router = express.Router();
const { getEvents, getEventById } = require('../controllers/eventsController');

/**
 * @route   GET /api/events
 * @desc    Get all events (with optional category filter)
 * @access  Public
 */
router.get('/', getEvents);

/**
 * @route   GET /api/events/:id
 * @desc    Get event by ID
 * @access  Public
 */
router.get('/:id', getEventById);

module.exports = router;
