
function toggleMenu(){const m=document.getElementById('menu');if(m)m.classList.toggle('active')}
document.addEventListener('DOMContentLoaded',()=>{const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();document.querySelectorAll('.menu a').forEach(a=>a.addEventListener('click',()=>document.getElementById('menu')?.classList.remove('active')));cargarPropiedades();})
function buscarPropiedad(){const o=document.getElementById('operacion')?.value;if(!o){alert('Selecciona primero si buscas Alquiler, Venta o Proyectos.');return}window.location.href={alquiler:'alquiler.html',venta:'venta.html',proyectos:'proyectos.html'}[o]}
async function cargarPropiedades(){const c=document.getElementById('propiedadesDinamicas');if(!c)return;try{const r=await fetch('data/propiedades.json');const d=await r.json();c.innerHTML=d.map(p=>`<div class="property-card"><div class="property-img">${p.tipo}</div><div class="property-body"><span class="badge">${p.operacion}</span><h3>${p.titulo}</h3><p class="price">${p.precio}</p><p>${p.descripcion}</p><div class="amenities"><span>${p.ubicacion}</span><span>${p.recamaras||'Consultar'} rec.</span><span>${p.banos||'Consultar'} baños</span></div><a class="mini-link" href="propiedades/${p.slug}.html">Ver propiedad</a></div></div>`).join('')}catch(e){c.innerHTML='<p>Propiedades pendientes de conexión.</p>'}}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.language-flags').forEach(wrapper => {
    const select = wrapper.querySelector('.language-select');
    const flag = wrapper.querySelector('.current-flag');
    if (!select || !flag) return;

    select.addEventListener('change', () => {
      const base = flag.getAttribute('src').replace(/[^/]+\.svg$/, '');
      flag.src = base + select.value + '.svg';
      flag.alt = 'Bandera del idioma seleccionado';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const loginSection = document.getElementById('portalLogin');
  const dashboard = document.getElementById('portalDashboard');
  const accessForm = document.getElementById('portalAccessForm');
  const demoButton = document.getElementById('portalDemoButton');
  const logoutButton = document.getElementById('portalLogout');

  if (!loginSection || !dashboard) return;

  const showDashboard = () => {
    loginSection.hidden = true;
    dashboard.hidden = false;
    dashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showLogin = () => {
    dashboard.hidden = true;
    loginSection.hidden = false;
    loginSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  accessForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    showDashboard();
  });

  demoButton?.addEventListener('click', showDashboard);
  logoutButton?.addEventListener('click', showLogin);
});
