const prisma = require('../config/database');

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics for authenticated user
 * @access  Private
 */
const getStats = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Count total tickets purchased by user
        const totalTickets = await prisma.ticket.count({
            where: { userId }
        });

        // Calculate total spent (sum of ticket prices)
        const tickets = await prisma.ticket.findMany({
            where: { userId },
            include: { event: true }
        });

        const totalSpent = tickets.reduce((sum, ticket) => {
            return sum + parseFloat(ticket.event.price);
        }, 0);

        // Count events user has attended
        const eventsAttended = new Set(tickets.map(t => t.eventId)).size;

        res.status(200).json({
            totalTickets,
            totalSpent,
            eventsAttended
        });
    } catch (error) {
        console.error('[Dashboard] Get stats error:', error);
        res.status(500).json({ message: 'Error fetching dashboard stats' });
    }
};

/**
 * @route   GET /api/dashboard/events
 * @desc    Get user's event history
 * @access  Private
 */
const getUserEvents = async (req, res) => {
    try {
        const userId = req.user.userId;

        const tickets = await prisma.ticket.findMany({
            where: { userId },
            include: {
                event: true
            },
            orderBy: { purchaseDate: 'desc' }
        });

        // Group tickets by event
        const eventsMap = new Map();
        tickets.forEach(ticket => {
            const eventId = ticket.event.id;
            if (!eventsMap.has(eventId)) {
                eventsMap.set(eventId, {
                    ...ticket.event,
                    ticketCount: 0,
                    totalSpent: 0
                });
            }
            const eventData = eventsMap.get(eventId);
            eventData.ticketCount += 1;
            eventData.totalSpent += parseFloat(ticket.event.price);
        });

        const events = Array.from(eventsMap.values());

        res.status(200).json(events);
    } catch (error) {
        console.error('[Dashboard] Get events error:', error);
        res.status(500).json({ message: 'Error fetching user events' });
    }
};

module.exports = {
    getStats,
    getUserEvents
};
