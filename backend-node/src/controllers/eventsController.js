const prisma = require('../config/database');

/**
 * @route   GET /api/events
 * @desc    Get all events with optional filters
 * @access  Public
 */
const getEvents = async (req, res) => {
    try {
        const { category } = req.query;

        const where = category ? { category } : {};

        const events = await prisma.event.findMany({
            where,
            orderBy: { date: 'asc' }
        });

        res.status(200).json(events);
    } catch (error) {
        console.error('[Events] Get events error:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
};

/**
 * @route   GET /api/events/:id
 * @desc    Get single event by ID
 * @access  Public
 */
const getEventById = async (req, res) => {
    try {
        const { id } = req.params;

        const event = await prisma.event.findUnique({
            where: { id: parseInt(id) }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json(event);
    } catch (error) {
        console.error('[Events] Get event error:', error);
        res.status(500).json({ message: 'Error fetching event' });
    }
};

module.exports = {
    getEvents,
    getEventById
};
