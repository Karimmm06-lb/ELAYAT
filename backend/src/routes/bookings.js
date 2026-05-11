const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { sendBookingConfirmation } = require('../lib/mailer');

const router  = express.Router();
const prisma  = new PrismaClient();

// POST /api/bookings — créer une réservation
router.post('/', async (req, res, next) => {
  try {
    const { name, phone, email, note, category, service, price, duration, date, time, photoUrl } = req.body;

    if (!name || !phone || !category || !service || !date || !time) {
      return res.status(400).json({ error: 'Champs obligatoires manquants.' });
    }

    const booking = await prisma.booking.create({
      data: {
        name,
        phone,
        email:    email    || null,
        note:     note     || null,
        category,
        service,
        price:    price    || '',
        duration: duration || '',
        date:     new Date(date),
        time,
        photoUrl: photoUrl || null,
        status:   'pending',
      },
    });

    // Email de confirmation à la propriétaire
    await sendBookingConfirmation(booking).catch(console.error);

    res.status(201).json({ success: true, booking });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings — liste toutes les réservations (admin)
router.get('/', async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const where = {};

    if (status) where.status = status;
    if (date) {
      const d = new Date(date);
      where.date = {
        gte: new Date(d.setHours(0, 0, 0, 0)),
        lte: new Date(d.setHours(23, 59, 59, 999)),
      };
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/:id — détail d'une réservation
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ error: 'Réservation introuvable.' });
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/bookings/:id — confirmer ou annuler
router.patch('/:id', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'cancelled', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Statut invalide.' });
    }

    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data:  { status },
    });

    res.json({ success: true, booking });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/bookings/:id — supprimer
router.delete('/:id', async (req, res, next) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// GET /api/bookings/slots/:date — créneaux disponibles pour une date
router.get('/slots/:date', async (req, res, next) => {
  try {
    const ALL_SLOTS = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'];

    const d = new Date(req.params.date);
    const booked = await prisma.booking.findMany({
      where: {
        date:   { gte: new Date(d.setHours(0,0,0,0)), lte: new Date(d.setHours(23,59,59,999)) },
        status: { not: 'cancelled' },
      },
      select: { time: true },
    });

    const takenSlots = booked.map(b => b.time);
    const slots = ALL_SLOTS.map(slot => ({
      time:      slot,
      available: !takenSlots.includes(slot),
    }));

    res.json(slots);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
