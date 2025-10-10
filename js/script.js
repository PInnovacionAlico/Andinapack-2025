// Pequeños manejadores para los botones principales
document.addEventListener('DOMContentLoaded',function(){
  const phone = '+573003003030';
  const email = 'correo@alico-sa.com';
  const website = 'https://alicoempaques.com';

  const callBtn = document.getElementById('callBtn');
  const emailBtn = document.getElementById('emailBtn');
  const siteBtn = document.getElementById('siteBtn');

  callBtn.addEventListener('click',()=>{
    // en móvil esto abrirá la app de llamada
    window.location.href = `tel:${phone}`;
  });

  emailBtn.addEventListener('click',()=>{
    window.location.href = `mailto:${email}`;
  });

  siteBtn.addEventListener('click',()=>{
    window.open(website,'_blank');
  });
});
