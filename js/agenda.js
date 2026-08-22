document.addEventListener('DOMContentLoaded',()=>{
  const form=document.getElementById('agendaCigsaForm');
  const date=document.getElementById('agendaFecha');
  const hour=document.getElementById('agendaHora');
  const box=document.getElementById('agendaConfirmation');
  if(date){
    const today=new Date();
    const iso=new Date(today.getTime()-today.getTimezoneOffset()*60000).toISOString().split('T')[0];
    date.min=iso;
    date.addEventListener('change',()=>{
      const selected=new Date(date.value+'T12:00:00');
      if(selected.getDay()===0){
        date.setCustomValidity('Domingo no disponible. Seleccione otra fecha.');
      }else{
        date.setCustomValidity('');
      }
    });
  }
  if(form&&box){
    form.addEventListener('submit',(e)=>{
      e.preventDefault();
      if(!form.checkValidity()){form.reportValidity();return;}
      box.hidden=false;
      box.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  }
});