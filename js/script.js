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

// vCard / VCF download handler
document.addEventListener('DOMContentLoaded',function(){
  const downloadLink = document.getElementById('downloadVcard');
  if(!downloadLink) return;

  function getText(selector){
    const el = document.querySelector(selector);
    return el ? el.textContent.trim() : '';
  }

  // Convert an <img> element (or its src) into base64 + mime info
  async function imageElementToBase64(img){
    if(!img) return null;
    const src = img.getAttribute('src') || img.src;
    if(!src) return null;

    // data: URIs
    if(src.startsWith('data:')){
      // data:[<mediatype>][;base64],<data>
      const comma = src.indexOf(',');
      const meta = src.substring(5, comma);
      const data = src.substring(comma + 1);
      const isBase64 = meta.includes(';base64');
      const mime = meta.split(';')[0] || 'image/png';
      if(isBase64) return { mime, base64: data };
      // not base64 — text data, encode to base64
      try{
        const encoded = btoa(unescape(encodeURIComponent(decodeURIComponent(data))));
        return { mime, base64: encoded };
      }catch(e){
        // fallback: attempt simple btoa
        try{ return { mime, base64: btoa(data) }; }catch(e2){ return null; }
      }
    }

    // Otherwise fetch the image and convert to base64
    try{
      const resp = await fetch(src);
      if(!resp.ok) return null;
      const blob = await resp.blob();
      const mime = blob.type || 'image/jpeg';
      return await new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onloadend = ()=>{
          const result = reader.result; // data:<mime>;base64,<data>
          const comma = result.indexOf(',');
          const base64 = result.substring(comma + 1);
          resolve({ mime, base64 });
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }catch(err){
      return null;
    }
  }

  downloadLink.addEventListener('click', async function (e){
    e.preventDefault();

    // Collect data from page (fall back to known values)
    const fullName = getText('.name') || 'Valentina Gaviria';
    const title = getText('.role') || 'Analista de innovación - Alico SAS BIC';
    const phone = '+573003003030';
    const email = 'correo@alico-sa.com';
    const website = 'https://alicoempaques.com';
    const city = (function(){
      const rows = document.querySelectorAll('.row');
      for(const r of rows){
        const label = r.querySelector('.label');
        const value = r.querySelector('.value');
        if(label && value && /ciudad/i.test(label.textContent)) return value.textContent.trim();
      }
      return '';
    })();

    // Build vCard 3.0
    const lines = [];
    lines.push('BEGIN:VCARD');
    lines.push('VERSION:3.0');
    // Name: N:Last;First;Additional;Prefix;Suffix and FN for formatted name
    const names = fullName.split(' ');
    const first = names.shift() || '';
    const last = names.join(' ') || '';
    lines.push(`N:${last};${first};;;`);
    lines.push(`FN:${fullName}`);
    if(title) lines.push(`TITLE:${title}`);
    const companyFromRow = (function(){
      const rows = document.querySelectorAll('.row');
      for(const r of rows){
        const label = r.querySelector('.label');
        const value = r.querySelector('.value');
        if(label && value && /cargo|empresa|company/i.test(label.textContent)) return value.textContent.trim();
      }
      return '';
    })();
    if(companyFromRow){
      lines.push(`ORG:${companyFromRow}`);
    }
    if(phone) lines.push(`TEL;TYPE=CELL:${phone}`);
    if(email) lines.push(`EMAIL;TYPE=INTERNET:${email}`);
    if(city) lines.push(`ADR;TYPE=WORK:;;;${city};;;;`);
    if(website) lines.push(`URL:${website}`);

    // Try to include avatar photo as base64 in vCard
    try{
      const avatar = document.querySelector('.avatar');
      const imgInfo = await imageElementToBase64(avatar);
      if(imgInfo && imgInfo.base64){
        // vCard expects TYPE name like JPEG or PNG; derive from mime
        let typePart = 'JPEG';
        try{
          const sub = (imgInfo.mime || '').split('/')[1] || '';
          typePart = sub.split('+')[0].toUpperCase() || 'JPEG';
        }catch(e){/* ignore */}
        // Add PHOTO field. Using ENCODING=b for vCard 3.0
        lines.push(`PHOTO;ENCODING=b;TYPE=${typePart}:${imgInfo.base64}`);
      }
    }catch(err){
      // if photo fails, continue without it
      console.warn('No se pudo incluir la foto en la vCard:', err);
    }

    lines.push('END:VCARD');

    const vcardString = lines.join('\r\n');

    const blob = new Blob([vcardString], {type: 'text/vcard;charset=utf-8'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    // filename safe
    const safeName = fullName.replace(/[^a-z0-9\-_\. ]/ig,'_');
    a.download = `${safeName}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // revoke
    setTimeout(()=> URL.revokeObjectURL(url), 1500);
  });
});
