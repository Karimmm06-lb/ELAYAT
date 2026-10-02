const express = require('express');
const crypto  = require('crypto');
const fs      = require('fs');
const path    = require('path');
const QRCode  = require('qrcode');

const router = express.Router();

const DATA_DIR     = path.join(__dirname, '../../data');
const MENU_FILE    = path.join(DATA_DIR, 'menu.json');
const DEFAULT_FILE = path.join(DATA_DIR, 'menu.default.json');

const PASSWORD = process.env.ADMIN_PASSWORD || '';
const SECRET   = process.env.ADMIN_SECRET || PASSWORD;
const TOKEN_TTL = 12 * 3600 * 1000;

const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};
const sign = (payload) => crypto.createHmac('sha256', SECRET).update(payload).digest('hex');

function makeToken() {
  const exp = String(Date.now() + TOKEN_TTL);
  return `${exp}.${sign(exp)}`;
}
function requireAdmin(req, res, next) {
  if (!PASSWORD) return res.status(503).json({ error: 'ADMIN_PASSWORD non configuré sur le serveur' });
  const token = (req.headers.authorization || '').replace(/^Bearer /, '');
  const [exp, sig] = token.split('.');
  if (!exp || !sig || Number(exp) < Date.now() || !safeEqual(sig, sign(exp))) {
    return res.status(401).json({ error: 'Non autorisé' });
  }
  next();
}

const readMenu = () =>
  JSON.parse(fs.readFileSync(fs.existsSync(MENU_FILE) ? MENU_FILE : DEFAULT_FILE, 'utf8'));

const str = (v, max) => String(v ?? '').trim().slice(0, max);

function sanitize(body) {
  if (!body || !Array.isArray(body.categories)) {
    const e = new Error('Menu invalide'); e.status = 400; throw e;
  }
  return {
    title: str(body.title, 80) || 'ELAYAT',
    subtitle: str(body.subtitle, 120),
    currency: str(body.currency, 10) || 'DA',
    categories: body.categories.slice(0, 30).map(c => ({
      name: str(c.name, 80) || 'Catégorie',
      items: (Array.isArray(c.items) ? c.items : []).slice(0, 100).map(i => ({
        name: str(i.name, 120) || 'Sans nom',
        description: str(i.description, 500),
        duration: str(i.duration, 60),
        price: Math.max(0, Number(i.price) || 0),
        available: i.available !== false,
      })),
    })),
  };
}

// Public
router.get('/menu', (_req, res) => res.json(readMenu()));

router.get('/qr', async (req, res, next) => {
  try {
    const url = str(req.query.url, 500) ||
      `${req.protocol}://${req.get('host')}/menu.html`;
    if (!/^https?:\/\//i.test(url)) return res.status(400).json({ error: 'URL invalide' });
    const svg = await QRCode.toString(url, { type: 'svg', margin: 2, errorCorrectionLevel: 'M' });
    res.type('image/svg+xml').send(svg);
  } catch (e) { next(e); }
});

// Admin
router.post('/admin/login', (req, res) => {
  if (!PASSWORD) return res.status(503).json({ error: 'ADMIN_PASSWORD non configuré sur le serveur' });
  if (!safeEqual(req.body?.password ?? '', PASSWORD)) {
    return res.status(401).json({ error: 'Mot de passe incorrect' });
  }
  res.json({ token: makeToken() });
});

router.put('/menu', requireAdmin, (req, res, next) => {
  try {
    const menu = sanitize(req.body);
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(MENU_FILE, JSON.stringify(menu, null, 2));
    res.json(menu);
  } catch (e) { next(e); }
});

router.post('/menu/reset', requireAdmin, (_req, res) => {
  if (fs.existsSync(MENU_FILE)) fs.unlinkSync(MENU_FILE);
  res.json(readMenu());
});

module.exports = router;
