
document.addEventListener('DOMContentLoaded',()=>{
  const grid=document.getElementById('contactDateGrid');
  const selected=document.getElementById('contactSelectedDate');
  const form=document.getElementById('contactAgendaForm');
  const confirm=document.getElementById('contactAgendaConfirm');
  if(!grid||!selected||!form)return;
  const days=['dom','lun','mar','mié','jue','vie','sáb'];
  const months=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
  let added=0, cursor=new Date(); cursor.setHours(12,0,0,0);
  while(added<14){
    cursor.setDate(cursor.getDate()+1);
    if(cursor.getDay()===0) continue;
    const d=new Date(cursor);
    const b=document.createElement('button'); b.type='button'; b.className='contact-date-button';
    b.innerHTML=`<small>${days[d.getDay()]}</small><strong>${d.getDate()}</strong><small>${months[d.getMonth()]}</small>`;
    b.addEventListener('click',()=>{
      grid.querySelectorAll('.contact-date-button').forEach(x=>x.classList.remove('active'));
      b.classList.add('active');
      selected.value=[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
    });
    grid.appendChild(b); added++;
  }
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!selected.value){ alert('Seleccione una fecha.'); return; }
    const fd=new FormData(form);
    const subject=encodeURIComponent('Solicitud de cita - Cigsa');
    const body=encodeURIComponent(`Nombre: ${fd.get('nombre')}\nCorreo: ${fd.get('email')}\nTeléfono: ${fd.get('telefono')}\nTipo de cita: ${fd.get('tipo')}\nFecha: ${fd.get('fecha')}\nHora: ${fd.get('hora')}\nMensaje: ${fd.get('mensaje')||''}`);
    confirm.hidden=false;
    window.location.href=`mailto:info@cig-sa.org?subject=${subject}&body=${body}`;
  });
});
