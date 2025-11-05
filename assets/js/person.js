// JS para páginas individuales de personas (idéntico a la plantilla original, modularizado)
document.addEventListener('DOMContentLoaded', function(){
  let PERSON = {};
  try{
    const el = document.getElementById('person-data');
    if(el && el.textContent) PERSON = JSON.parse(el.textContent);
  }catch(e){
    console.warn('No se pudo parsear person-data JSON', e);
    PERSON = {};
  }
  const phone = PERSON.phone || '';
  const email = PERSON.email || '';
  const website = PERSON.website || 'https://alicoempaques.com';
  const callBtn = document.getElementById('callBtn');
  const emailBtn = document.getElementById('emailBtn');
  const siteBtn = document.getElementById('siteBtn');
  if(callBtn){
    callBtn.addEventListener('click', ()=>{ if(phone) window.location.href = `tel:${phone}`; });
  }
  if(emailBtn){
    emailBtn.addEventListener('click', ()=>{ if(email) window.location.href = `mailto:${email}`; });
  }
  if(siteBtn){
    siteBtn.addEventListener('click', ()=>{ if(website) window.open(website,'_blank'); });
  }
  // vCard download con avatar en base64
  const downloadLink = document.getElementById('downloadVcard');
  if(downloadLink){
    downloadLink.addEventListener('click', async function(e){
      e.preventDefault();
      const fullName = PERSON.name || 'Sin nombre';
      const title = PERSON.role || '';
      const phoneVal = PERSON.phone || '';
      const emailVal = PERSON.email || '';
      const websiteVal = PERSON.website || 'https://alicoempaques.com';
      const cityVal = PERSON.city || '';
      const companyVal = PERSON.company || '';
      let photoLine = '';
      // Convertir avatar a base64
      const avatarImg = document.querySelector('.avatar');
      if (avatarImg && avatarImg.src && !avatarImg.src.startsWith('data:')) {
        try {
          const resp = await fetch(avatarImg.src);
          const blob = await resp.blob();
          const reader = new FileReader();
          photoLine = await new Promise((resolve, reject) => {
            reader.onloadend = function() {
              const base64 = reader.result.split(',')[1];
              const mime = blob.type || 'image/jpeg';
              resolve(`PHOTO;ENCODING=b;TYPE=${mime.toUpperCase().replace('IMAGE/','')}:${base64}`);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (err) { photoLine = ''; }
      }
      const lines = [];
      lines.push('BEGIN:VCARD');
      lines.push('VERSION:3.0');
      const names = (fullName || '').split(' ');
      const first = names.shift() || '';
      const last = names.join(' ') || '';
      lines.push(`N:${last};${first};;;`);
      lines.push(`FN:${fullName}`);
      if(title) lines.push(`TITLE:${title}`);
      if(companyVal) lines.push(`ORG:${companyVal}`);
      if(phoneVal) lines.push(`TEL;TYPE=CELL:${phoneVal}`);
      if(emailVal) lines.push(`EMAIL;TYPE=INTERNET:${emailVal}`);
      if(cityVal) lines.push(`ADR;TYPE=WORK:;;;${cityVal};;;;`);
      if(websiteVal) lines.push(`URL:${websiteVal}`);
      if(photoLine) lines.push(photoLine);
      lines.push('END:VCARD');
      const vcardString = lines.join('\r\n');
      const blob = new Blob([vcardString], {type: 'text/vcard;charset=utf-8'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = (fullName || 'contact').replace(/[^a-z0-9\-_\. ]/ig,'_');
      a.download = `${safeName}.vcf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=> URL.revokeObjectURL(url), 1500);
    });
  }
  // Avatar fallback (SVG con iniciales)
  function initialsSvgDataUrl(name, size){
    size = size || 300;
    var initials = '';
    if(name){
      var parts = name.trim().split(/\s+/);
      initials = (parts[0] || '').charAt(0) + (parts.length>1? (parts[parts.length-1]||'').charAt(0) : '');
      initials = initials.toUpperCase();
    }
    var bg = window.CUSTOM_AVATAR_COLOR || '#0628b5';
    var fg = '#fff';
    var fontSize = Math.round(size/5);
    var svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><rect width='100%' height='100%' fill='${bg}' /><text x='50%' y='50%' font-family='Montserrat,Arial,sans-serif' font-size='${fontSize}' fill='${fg}' dominant-baseline='middle' text-anchor='middle'>${initials}</text></svg>`;
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  }
  function loadImage(url, timeoutMs){
    timeoutMs = timeoutMs || 5000;
    return new Promise(function(resolve,reject){
      if(!url) return reject(new Error('empty url'));
      var img = new Image();
      var timer = setTimeout(function(){ reject(new Error('timeout loading ' + url)); }, timeoutMs);
      img.onload = function(){ clearTimeout(timer); resolve(url); };
      img.onerror = function(){ clearTimeout(timer); reject(new Error('failed to load ' + url)); };
      img.src = url;
    });
  }
  function resolveAvatar(imgEl){
    if(!imgEl) return Promise.resolve(null);
    var src = imgEl.getAttribute('src') || imgEl.src || '';
    var name = imgEl.getAttribute('data-name') || '';
    return loadImage(src, 2000)
      .then(function(finalUrl){
        imgEl.src = finalUrl;
        return finalUrl;
      })
      .catch(function(){
        var svg = initialsSvgDataUrl(name, 300);
        imgEl.src = svg;
        return svg;
      });
  }
  document.querySelectorAll('img.avatar').forEach(function(img){
    try{ resolveAvatar(img); }catch(e){}
  });
  // Fallback para íconos
  function fixSrc(img){
    if(!img) return;
    var raw = img.getAttribute('src') || img.src || '';
    if(!raw) return;
    if(raw.indexOf('{') !== -1 || raw.indexOf('%7B') !== -1){
      var alt = (img.getAttribute('alt')||'').toLowerCase();
      if(alt.indexOf('tel') !== -1 || alt.indexOf('teléfono') !== -1 || alt.indexOf('phone') !== -1){
        img.src = '/assets/icons/phone.svg';
      }else if(alt.indexOf('email') !== -1){
        img.src = '/assets/icons/email.svg';
      }else if(alt.indexOf('cargo') !== -1 || alt.indexOf('briefcase') !== -1){
        img.src = '/assets/icons/briefcase.svg';
      }else if(alt.indexOf('sitio') !== -1 || alt.indexOf('web') !== -1 || alt.indexOf('globe') !== -1){
        img.src = '/assets/icons/globe.svg';
      }else if(alt.indexOf('linkedin') !== -1){
        img.src = '/assets/icons/linkedin.svg';
      }else if(alt.indexOf('whatsapp') !== -1){
        img.src = '/assets/icons/whatsapp.svg';
      }else if(img.classList && img.classList.contains('avatar')){
        img.src = '/fotos/Prueba.jpg';
      }else{
        img.removeAttribute('src');
      }
    }
  }
  var imgs = document.querySelectorAll('img');
  imgs.forEach(fixSrc);
  // Registro de visita (simple, no-cors)
  try{
    var AS_URL = 'https://script.google.com/macros/s/AKfycbwxW6QeTibOSZwb20uIndbXbLh6WJN-Gu8ruoDxzZp0LBvazPVs28dA-C6LG0Lu6p2E6w/exec';
    var now = new Date();
    
    // Formatear fecha y hora en zona horaria local (Colombia)
    function pad(n) { return n < 10 ? '0' + n : n; }
    var year = now.getFullYear();
    var month = pad(now.getMonth() + 1);
    var day = pad(now.getDate());
    var hours = pad(now.getHours());
    var minutes = pad(now.getMinutes());
    var seconds = pad(now.getSeconds());
    
    var data = {
      fecha: year + '-' + month + '-' + day,
      hora: hours + ':' + minutes + ':' + seconds,
      pagina: window.location.href
    };
    fetch(AS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }catch(e){ console.warn('simple visit post failed', e); }
});
