require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bookingsRouter = require('./routes/bookings');
const contactRouter  = require('./routes/contact');
const menuRouter     = require('./routes/menu');
const path           = require('path');

const app  = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_, res) => res.json({ status: 'ok', app: 'ELAYAT API' }));

app.use('/api/bookings', bookingsRouter);
app.use('/api/contact',  contactRouter);
app.use('/api',          menuRouter);

// Front statique (liste blanche : jamais backend/.env)
const ROOT = path.join(__dirname, '../..');
app.use('/css', express.static(path.join(ROOT, 'css')));
app.use('/js',  express.static(path.join(ROOT, 'js')));
for (const f of ['index.html', 'menu.html', 'admin.html']) {
  app.get(`/${f}`, (_, res) => res.sendFile(path.join(ROOT, f)));
}
app.get('/', (_, res) => res.sendFile(path.join(ROOT, 'index.html')));
app.get('/menu',  (_, res) => res.redirect('/menu.html'));
app.get('/admin', (_, res) => res.redirect('/admin.html'));

// Erreurs
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Erreur serveur' });
});

app.listen(PORT, () => console.log(`ELAYAT API démarrée sur http://localhost:${PORT}`));
