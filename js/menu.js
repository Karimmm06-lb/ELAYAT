const API_BASE = location.protocol === 'file:' ? 'http://localhost:4000/api' : '/api';

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};
const fmt = n => Number(n).toLocaleString('fr-FR').replace(/ /g, ' ');

function render(menu) {
  document.getElementById('title').textContent = menu.title;
  document.getElementById('subtitle').textContent = menu.subtitle;
  document.title = `${menu.title} — Menu`;

  const main = document.getElementById('menu');
  const cats = document.getElementById('cats');
  main.replaceChildren();
  cats.replaceChildren();

  menu.categories.filter(c => c.items.length).forEach((cat, i) => {
    const id = `cat-${i}`;
    const a = el('a', '', cat.name);
    a.href = `#${id}`;
    cats.append(a);

    const sec = el('section');
    sec.id = id;
    sec.append(el('h2', '', cat.name));
    cat.items.forEach(it => {
      const item = el('div', 'item' + (it.available ? '' : ' off'));
      const row = el('div', 'row');
      const price = el('span', 'price', fmt(it.price) + ' ');
      price.append(el('small', '', menu.currency));
      row.append(el('span', 'name', it.name), el('span', 'dots'), price);
      item.append(row);
      if (it.description) item.append(el('p', 'desc', it.description));
      if (it.duration || !it.available) item.append(el('span', 'dur', it.duration));
      sec.append(item);
    });
    main.append(sec);
  });

  const links = [...cats.children];
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) links.forEach(l => l.classList.toggle('on', l.hash === `#${e.target.id}`));
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  main.querySelectorAll('section').forEach(s => obs.observe(s));
}

fetch(`${API_BASE}/menu`)
  .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
  .then(render)
  .catch(() => {
    document.getElementById('menu').replaceChildren(el('p', 'msg', 'Menu momentanément indisponible. Merci de réessayer.'));
  });
