require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bookingsRouter = require('./routes/bookings');
const contactRouter  = require('./routes/contact');

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'ELAYAT API' }));

app.use('/api/bookings', bookingsRouter);
app.use('/api/contact',  contactRouter);

// Erreurs
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
});

app.listen(PORT, () => console.log(`ELAYAT API démarrée sur http://localhost:${PORT}`));
