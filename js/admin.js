const API_BASE = location.protocol === 'file:' ? 'http://localhost:4000/api' : '/api';
const $ = id => document.getElementById(id);
let menu = null;
let token = sessionStorage.getItem('elayat_admin') || '';

const el = (tag, attrs = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (k === 'checked' || k === 'value') n[k] = v;
    else n.setAttribute(k, v);
  }
  n.append(...kids);
  return n;
};

async function api(path, opts = {}) {
  const res = await fetch(API_BASE + path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401 && path !== '/admin/login') { logout(); throw new Error('Session expirée'); }
  if (!res.ok) throw new Error(data.error || `Erreur ${res.status}`);
  return data;
}

function setStatus(msg, err) {
  const s = $('status');
  s.textContent = msg;
  s.classList.toggle('err', !!err);
}

function field(label, value, onInput, tag = 'input', type = 'text') {
  const input = el(tag, { value, ...(tag === 'input' && { type }) });
  if (type === 'number') input.setAttribute('min', '0');
  input.addEventListener('input', () => onInput(input.value));
  return el('div', {}, el('label', {}, label), input);
}

function render() {
  $('m-title').value = menu.title;
  $('m-sub').value = menu.subtitle;
  $('m-cur').value = menu.currency;

  const root = $('cats');
  root.replaceChildren();
  menu.categories.forEach((cat, ci) => {
    const card = el('div', { class: 'card' });
    card.append(el('div', { class: 'cat-head' },
      field('Catégorie', cat.name, v => cat.name = v),
      el('button', { class: 'ghost sm', title: 'Monter', onclick: () => move(menu.categories, ci, -1) }, '↑'),
      el('button', { class: 'ghost sm', title: 'Descendre', onclick: () => move(menu.categories, ci, 1) }, '↓'),
      el('button', { class: 'danger sm', onclick: () => {
        if (confirm(`Supprimer la catégorie « ${cat.name} » et ses ${cat.items.length} article(s) ?`)) {
          menu.categories.splice(ci, 1); render();
        } } }, 'Supprimer')));

    cat.items.forEach((it, ii) => {
      const row = el('div', { class: 'item' },
        field('Nom', it.name, v => it.name = v),
        field('Prix', it.price, v => it.price = v, 'input', 'number'),
        field('Durée', it.duration, v => it.duration = v),
        (() => { const f = field('Description', it.description, v => it.description = v, 'textarea'); f.classList.add('full'); return f; })(),
        el('div', { class: 'acts full' },
          el('label', { class: 'chk' },
            el('input', { type: 'checkbox', checked: it.available, onchange: e => it.available = e.target.checked }),
            'Disponible'),
          el('div', { style: 'display:flex;gap:6px' },
            el('button', { class: 'ghost sm', onclick: () => move(cat.items, ii, -1) }, '↑'),
            el('button', { class: 'ghost sm', onclick: () => move(cat.items, ii, 1) }, '↓'),
            el('button', { class: 'danger sm', onclick: () => { cat.items.splice(ii, 1); render(); } }, 'Supprimer'))));
      card.append(row);
    });
    card.append(el('button', { class: 'ghost sm', onclick: () => {
      cat.items.push({ name: 'Nouvel article', description: '', duration: '', price: 0, available: true });
      render();
    } }, '+ Ajouter un article'));
    root.append(card);
  });
}

function move(arr, i, d) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return;
  [arr[i], arr[j]] = [arr[j], arr[i]];
  render();
}

function updateQR() {
  const url = $('qr-url').value.trim();
  if (!/^https?:\/\//i.test(url)) return;
  const src = `${API_BASE}/qr?url=${encodeURIComponent(url)}`;
  $('qr-img').src = src;
  $('qr-dl').href = src;
}

async function load() {
  menu = await api('/menu');
  $('login').classList.add('hidden');
  $('app').classList.remove('hidden');
  $('savebar').classList.remove('hidden');
  $('qr-url').value = new URL('menu.html', location.href).href;
  updateQR();
  render();
}

function logout() {
  token = '';
  sessionStorage.removeItem('elayat_admin');
  $('app').classList.add('hidden');
  $('savebar').classList.add('hidden');
  $('login').classList.remove('hidden');
}

$('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  $('login-err').textContent = '';
  try {
    const { token: t } = await api('/admin/login', { method: 'POST', body: JSON.stringify({ password: $('pwd').value }) });
    token = t;
    sessionStorage.setItem('elayat_admin', t);
    $('pwd').value = '';
    await load();
  } catch (err) { $('login-err').textContent = err.message; }
});

$('logout').onclick = logout;
$('m-title').oninput = e => menu.title = e.target.value;
$('m-sub').oninput = e => menu.subtitle = e.target.value;
$('m-cur').oninput = e => menu.currency = e.target.value;
$('qr-url').oninput = updateQR;
$('qr-print').onclick = () => {
  const w = window.open('', '_blank');
  w.document.write(`<title>QR</title><body style="text-align:center;font-family:Georgia,serif;padding:40px"><h1 style="letter-spacing:.3em">ELAYAT</h1><p>Scannez pour découvrir notre carte</p><img src="${$('qr-img').src}" width="360">`);
  w.document.close();
  w.onload = () => w.print();
};
$('add-cat').onclick = () => { menu.categories.push({ name: 'Nouvelle catégorie', items: [] }); render(); };

$('save').onclick = async () => {
  setStatus('Enregistrement…');
  try {
    menu = await api('/menu', { method: 'PUT', body: JSON.stringify(menu) });
    render();
    setStatus('✓ Enregistré — le menu public est à jour');
  } catch (err) { setStatus(err.message, true); }
};

$('reset').onclick = async () => {
  if (!confirm('Remplacer tout le menu par la version d\'origine ? Vos modifications seront perdues.')) return;
  try { menu = await api('/menu/reset', { method: 'POST' }); render(); setStatus('Menu d\'origine restauré'); }
  catch (err) { setStatus(err.message, true); }
};

if (token) load().catch(logout);
