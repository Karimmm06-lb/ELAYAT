const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { sendContactNotification } = require('../lib/mailer');

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/contact
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: 'Nom et message obligatoires.' });
    }

    const contact = await prisma.contact.create({
      data: { name, email: email || null, phone: phone || null, message },
    });

    await sendContactNotification(contact).catch(console.error);

    res.status(201).json({ success: true, contact });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
