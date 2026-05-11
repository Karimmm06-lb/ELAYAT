// Nav
window.addEventListener('scroll', () => document.getElementById('nav').classList.toggle('scrolled', scrollY > 50));
document.getElementById('hamburger').onclick = () => document.getElementById('mobile-nav').classList.add('open');
document.getElementById('mobile-close').onclick = () => document.getElementById('mobile-nav').classList.remove('open');
function closeMob() { document.getElementById('mobile-nav').classList.remove('open'); }

// Reveal
const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);} }), {threshold:0.1});
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Tabs
function switchTab(id, btn) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('panel-' + id).classList.add('active');
}

// Toast
function toast(title, body, ms=4000) {
  document.getElementById('t-title').textContent = title;
  document.getElementById('t-body').textContent = body;
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms);
}

// Booking
const SVCS = {
  headspa:[
    {id:'mey',name:'Mey Experience',price:'6 500 DA',dur:'45 min'},
    {id:'evasion',name:'Évasion',price:'7 500 DA',dur:'60 min'},
    {id:'skin',name:'Skin & Care',price:'9 500 DA',dur:'80 min'},
    {id:'reve',name:'Rêve Ultime',price:'11 000 DA',dur:'80 min'},
  ],
  massages:[
    {id:'visage',name:'Visage & Décolleté',price:'5 000 DA',dur:'45 min'},
    {id:'hair',name:'Hair Meditation',price:'5 000 DA',dur:'45 min'},
    {id:'pieds',name:'Pieds & Mains',price:'3 500 DA',dur:'30 min'},
  ],
  brow:[
    {id:'brow-restruct',name:'Restructuration des sourcils',price:'2 500 DA',dur:'Sans épilation'},
    {id:'brow-henna',name:'Henna Tattoo',price:'2 500 DA',dur:'Henna Brow'},
    {id:'brow-lift',name:'Brow Lift',price:'3 000 DA',dur:'Lamination'},
    {id:'brow-lift-henna',name:'Brow Lift + Henna Brow',price:'5 000 DA',dur:'Lift + Couleur'},
    {id:'brow-lift-restruct',name:'Brow Lift + Restructuration',price:'5 000 DA',dur:'Lift + Forme'},
    {id:'brow-complet',name:'Brow Lift + Henna + Restructuration',price:'6 000 DA',dur:'Formule Complète'},
  ],
  cours:[
    {id:'cours-essentiel',name:'Formule Essentielle',price:'7 000 DA',dur:'2h'},
    {id:'cours-excellence',name:'Formule Excellence',price:'10 000 DA',dur:'3h'},
  ]
};
const CAT_NAMES = {headspa:'HeadSpa',massages:'Massages',brow:'Brow Lift',cours:'Cours Maquillage'};
const API = 'http://localhost:4000/api';
const ALL_SLOTS = ['09:00','10:00','11:00','12:00','14:00','15:00','16:00','17:00','18:00'];
const S = {cat:null,svc:null,svcName:'',price:'',dur:'',date:null,time:null};

function selCat(cat, el) {
  S.cat = cat; S.svc = null;
  document.querySelectorAll('.opt').forEach(o => o.classList.remove('sel'));
  el.classList.add('sel');
  const b = document.getElementById('btn1'); b.disabled=false; b.style.opacity='1';
}
function renderSvcGrid() {
  const g = document.getElementById('svc-grid'); g.innerHTML='';
  (SVCS[S.cat]||[]).forEach(s => {
    const el = document.createElement('div'); el.className='svc-opt'+(S.svc===s.id?' sel':'');
    el.innerHTML=`<span class="svc-opt-name">${s.name}</span><div class="svc-opt-r"><div class="svc-opt-price">${s.price}</div><div class="svc-opt-dur">${s.dur}</div></div>`;
    el.onclick=()=>{
      S.svc=s.id;S.svcName=s.name;S.price=s.price;S.dur=s.dur;
      document.querySelectorAll('.svc-opt').forEach(o=>o.classList.remove('sel'));
      el.classList.add('sel');
      const b=document.getElementById('btn2');b.disabled=false;b.style.opacity='1';
    };
    g.appendChild(el);
  });
  const b=document.getElementById('btn2'); const ok=SVCS[S.cat]?.some(s=>s.id===S.svc);
  b.disabled=!ok; b.style.opacity=ok?'1':'0.4';
}

let cY, cM;
function initCal(){ const n=new Date(); cY=n.getFullYear(); cM=n.getMonth(); renderCal(); }
function renderCal(){
  const mn=['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
  document.getElementById('cal-month-lbl').textContent=mn[cM]+' '+cY;
  const g=document.getElementById('cal-grid'); g.innerHTML='';
  ['L','M','M','J','V','S','D'].forEach(d=>{const h=document.createElement('div');h.className='cdh';h.textContent=d;g.appendChild(h);});
  const fd=new Date(cY,cM,1).getDay(), off=fd===0?6:fd-1;
  const dim=new Date(cY,cM+1,0).getDate();
  const tod=new Date();
  for(let i=0;i<off;i++){const e=document.createElement('div');e.className='cd';g.appendChild(e);}
  for(let d=1;d<=dim;d++){
    const el=document.createElement('div');
    const dt=new Date(cY,cM,d);
    const past=dt<new Date(tod.getFullYear(),tod.getMonth(),tod.getDate());
    const sun=dt.getDay()===0;
    el.textContent=d;
    if(past||sun){el.className='cd';}
    else{
      el.className='cd avail';
      if(dt.toDateString()===tod.toDateString())el.classList.add('today');
      if(S.date&&dt.toDateString()===S.date.toDateString())el.classList.add('sel');
      el.onclick=()=>{
        document.querySelectorAll('.cd.sel').forEach(x=>x.classList.remove('sel'));
        el.classList.add('sel'); S.date=dt; S.time=null; renderSlots(); chk3();
      };
    }
    g.appendChild(el);
  }
}
function prevM(){cM--;if(cM<0){cM=11;cY--;}renderCal();}
function nextM(){cM++;if(cM>11){cM=0;cY++;}renderCal();}
async function renderSlots(){
  const g=document.getElementById('slots-grid');
  const t=document.getElementById('slots-title');
  if(!S.date)return;
  const ds=S.date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long'});
  t.textContent=ds.charAt(0).toUpperCase()+ds.slice(1); t.style.color='var(--ink)';
  g.innerHTML='<div style="font-size:0.7rem;color:var(--ink3);padding:12px">Chargement...</div>';

  let slots = ALL_SLOTS.map(s => ({ time: s, available: true }));
  try {
    const dateStr = S.date.toISOString().split('T')[0];
    const res = await fetch(`${API}/bookings/slots/${dateStr}`);
    if(res.ok) slots = await res.json();
  } catch(e) { /* serveur off — on affiche tous les créneaux */ }

  g.innerHTML='';
  slots.forEach(({time:sl, available})=>{
    const el=document.createElement('div');el.textContent=sl;
    if(!available){el.className='slot taken';}
    else{
      el.className='slot avail';
      if(S.time===sl)el.classList.add('sel');
      el.onclick=()=>{document.querySelectorAll('.slot.sel').forEach(x=>x.classList.remove('sel'));el.classList.add('sel');S.time=sl;chk3();};
    }
    g.appendChild(el);
  });
}
function chk3(){const b=document.getElementById('btn3');const ok=S.date&&S.time;b.disabled=!ok;b.style.opacity=ok?'1':'0.4';}
function previewPhoto(input) {
  const preview = document.getElementById('photo-preview');
  preview.innerHTML = '';
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      preview.style.display = 'flex';
      preview.appendChild(img);
      document.getElementById('upload-area').style.borderColor = 'var(--gold)';
      document.getElementById('upload-area').querySelector('.photo-upload-text').textContent = '✓ Photo ajoutée';
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function buildSummary(){
  const ds=S.date?S.date.toLocaleDateString('fr-FR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}):'-';
  document.getElementById('summary').innerHTML=`<strong>Récapitulatif</strong><br/>Catégorie : <strong>${CAT_NAMES[S.cat]}</strong><br/>Service : <strong>${S.svcName}</strong> — ${S.price} · ${S.dur}<br/>Date : <strong>${ds.charAt(0).toUpperCase()+ds.slice(1)}</strong><br/>Heure : <strong>${S.time}</strong>`;
}

function goStep(n){
  if(n===2)renderSvcGrid();
  if(n===3){initCal();renderSlots();}
  if(n===4){ buildSummary(); document.getElementById('photo-wrap').classList.toggle('visible', S.cat==='brow'); }
  document.querySelectorAll('.bp').forEach(p=>p.classList.remove('active'));
  document.getElementById('bp'+n).classList.add('active');
  document.querySelectorAll('.step').forEach((s,i)=>{
    s.classList.remove('active','done');
    if(i+1<n)s.classList.add('done');
    else if(i+1===n)s.classList.add('active');
  });
  document.getElementById('booking').scrollIntoView({behavior:'smooth',block:'start'});
}
async function submitForm(){
  const name  = document.getElementById('f-name').value.trim();
  const phone = document.getElementById('f-phone').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const note  = document.getElementById('f-note').value.trim();

  if(!name||!phone){ toast('Champs requis','Veuillez renseigner votre nom et téléphone.'); return; }

  // Photo en base64 si Brow Lift
  let photoUrl = null;
  const photoInput = document.getElementById('f-photo');
  if(S.cat==='brow' && photoInput?.files[0]) {
    photoUrl = await new Promise(resolve => {
      const r = new FileReader();
      r.onload = e => resolve(e.target.result);
      r.readAsDataURL(photoInput.files[0]);
    });
  }

  const submitBtn = document.querySelector('#bp4 .btn-dark:last-child');
  submitBtn.textContent = 'Envoi en cours...';
  submitBtn.disabled = true;

  try {
    const res = await fetch(`${API}/bookings`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name, phone,
        email:    email    || null,
        note:     note     || null,
        category: S.cat,
        service:  S.svcName,
        price:    S.price,
        duration: S.dur,
        date:     S.date.toISOString(),
        time:     S.time,
        photoUrl,
      }),
    });

    if(!res.ok) throw new Error('Erreur serveur');

    document.querySelectorAll('.bp').forEach(p=>p.classList.remove('active'));
    document.getElementById('bp-ok').classList.add('active');
    document.querySelectorAll('.step').forEach(s=>s.classList.add('done'));
    toast('Réservation envoyée ✦','Vous serez contactée dans les 24h.',6000);

  } catch(err) {
    toast('Erreur','Problème de connexion. Réessayez ou contactez-nous sur Instagram.');
    submitBtn.textContent = 'Confirmer la réservation';
    submitBtn.disabled = false;
  }
}
function resetBook(){
  Object.assign(S,{cat:null,svc:null,svcName:'',price:'',dur:'',date:null,time:null});
  document.querySelectorAll('.opt').forEach(o=>o.classList.remove('sel'));
  ['f-name','f-phone','f-email','f-note'].forEach(id=>document.getElementById(id).value='');
  goStep(1);
}

// Palette switcher
const PALS = {
  ivoire: { bg:'#F5F0E8', bg2:'#EDE6DB', bg3:'#E4D9CB', name:'Ivoire' },
  nude:   { bg:'#EAD9C8', bg2:'#E0CCBA', bg3:'#D4BCAA', name:'Nude' },
  sable:  { bg:'#E2D5C3', bg2:'#D5C5AF', bg3:'#C8B49A', name:'Sable' },
  rose:   { bg:'#EDE0D8', bg2:'#E2D0C6', bg3:'#D5BEB3', name:'Rosé' },
  lin:    { bg:'#E0DCD4', bg2:'#D4CFC5', bg3:'#C8C2B5', name:'Lin' },
};
function setPal(id, el) {
  const p = PALS[id];
  document.documentElement.style.setProperty('--bg', p.bg);
  document.documentElement.style.setProperty('--bg2', p.bg2);
  document.documentElement.style.setProperty('--bg3', p.bg3);
  document.querySelectorAll('.pal-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('pal-name').textContent = p.name;
}

function openBookFor(id){
  const cat=id.startsWith('cours')?'cours':'headspa';
  S.cat=cat; S.svc=id;
  document.getElementById('booking').scrollIntoView({behavior:'smooth'});
  setTimeout(()=>goStep(2),600);
}
