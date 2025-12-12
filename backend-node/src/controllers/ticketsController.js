const prisma = require('../config/database');
const crypto = require('crypto');

/**
 * @route   POST /api/tickets/purchase
 * @desc    Purchase a ticket for an event
 * @access  Private
 */
const purchaseTicket = async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.userId;

        // Verify event exists
        const event = await prisma.event.findUnique({
            where: { id: parseInt(eventId) }
        });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Generate QR code (simple hash for now)
        const qrCode = crypto.randomBytes(16).toString('hex');

        // Create ticket
        const ticket = await prisma.ticket.create({
            data: {
                userId,
                eventId: parseInt(eventId),
                qrCode
            },
            include: {
                event: true
            }
        });

        res.status(201).json({
            message: 'Ticket purchased successfully!',
            ticket
        });
    } catch (error) {
        console.error('[Tickets] Purchase error:', error);
        res.status(500).json({ message: 'Error purchasing ticket' });
    }
};

/**
 * @route   GET /api/tickets/my-tickets
 * @desc    Get all tickets for authenticated user
 * @access  Private
 */
const getMyTickets = async (req, res) => {
    try {
        const userId = req.user.userId;

        const tickets = await prisma.ticket.findMany({
            where: { userId },
            include: {
                event: true
            },
            orderBy: { purchaseDate: 'desc' }
        });

        res.status(200).json(tickets);
    } catch (error) {
        console.error('[Tickets] Get my tickets error:', error);
        res.status(500).json({ message: 'Error fetching tickets' });
    }
};

module.exports = {
    purchaseTicket,
    getMyTickets
};
