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

  downloadLink.addEventListener('click', function (e){
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
    // We only have a full name, put it into FN and attempt to split
    const names = fullName.split(' ');
    const first = names.shift() || '';
    const last = names.join(' ') || '';
    lines.push(`N:${last};${first};;;`);
    lines.push(`FN:${fullName}`);
    if(title) lines.push(`TITLE:${title}`);
    const companyFromRow = (function(){
      // try to find company label (Cargo) row value
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
