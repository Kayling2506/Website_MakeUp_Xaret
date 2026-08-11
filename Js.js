(function(){
  const wrapImage = (img) => {
    if (!img || img.dataset.protected === "1") return;
    try {
      img.dataset.protected = "1";
      img.setAttribute('draggable','false');
      img.style.userSelect = 'none';
      img.style.webkitUserSelect = 'none';
      img.style.MozUserSelect = 'none';
      img.style.pointerEvents = 'none'; // evitar interacción directa
      // crear wrapper
      const wrapper = document.createElement('span');
      wrapper.className = 'img-protect';
      wrapper.setAttribute('aria-hidden','true');
      wrapper.style.display = getComputedStyle(img).display === 'block' ? 'block' : 'inline-block';
      wrapper.style.width = img.width ? img.width + 'px' : img.style.width || 'auto';
      wrapper.style.height = img.height ? img.height + 'px' : img.style.height || 'auto';

      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
 
      const overlay = document.createElement('span');
      overlay.className = 'img-protect__overlay';
      wrapper.appendChild(overlay);
    } catch(e){}
  };
  document.querySelectorAll('img').forEach(wrapImage);

  const mo = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes && m.addedNodes.forEach(node => {
        if (!node) return;
        if (node.tagName === 'IMG') wrapImage(node);
        if (node.querySelectorAll) node.querySelectorAll('img').forEach(wrapImage);
      });
    });
  });
  mo.observe(document.documentElement || document.body, { childList: true, subtree: true });


  window.addEventListener('contextmenu', function(e){
    if (e.target && (e.target.tagName === 'IMG' || e.target.classList && e.target.classList.contains('img-protect__overlay'))) {
      e.preventDefault();
    }
  }, {passive:false});

  document.addEventListener('dragstart', function(e){
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  }, {passive:false});

  document.addEventListener('selectstart', function(e){
    if (e.target && (e.target.tagName === 'IMG' || e.target.closest && e.target.closest('.img-protect'))) {
      e.preventDefault();
    }
  }, {passive:false});

  document.addEventListener('keydown', function(e){
    const key = e.key.toLowerCase();
    if ((e.ctrlKey && key === 's') ||
        (e.ctrlKey && key === 'u') ||
        (e.ctrlKey && e.shiftKey && (key === 'i' || key === 'c' || key === 'j')) ||
        (e.key === 'F12')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    if (e.ctrlKey && e.shiftKey && key === 's') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, {passive:false});

  // Evitar pulsación larga en móviles sobre imágenes (algunos navegadores)
  document.addEventListener('touchstart', function(e){
    if (e.target && (e.target.tagName === 'IMG' || e.target.classList && e.target.classList.contains('img-protect__overlay'))) {
      if (e.touches && e.touches.length === 1) {
        let t = setTimeout(()=>{},1);
        clearTimeout(t);
      }
    }
  }, {passive:false});
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

const globalOverlay = document.createElement('div');
globalOverlay.style.position = 'fixed';
globalOverlay.style.inset = '0';
globalOverlay.style.pointerEvents = 'none';
document.body.appendChild(globalOverlay);

// Functions for WhatsApp Quote & Schedule Modal Popup
window.openQuoteModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  const modal = document.getElementById('quote-modal');
  if (modal) {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
};

window.closeQuoteModal = function() {
  const modal = document.getElementById('quote-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
};

window.handleModalBackdropClick = function(e) {
  if (e.target && e.target.id === 'quote-modal') {
    window.closeQuoteModal();
  }
};

window.sendWhatsAppQuote = function() {
  const serviceEl = document.getElementById('service-select');
  const dateEl = document.getElementById('date-input');
  const locationEl = document.getElementById('location-select');
  const peopleEl = document.getElementById('people-select');

  const service = serviceEl ? serviceEl.value : 'Maquillaje Profesional';
  const dateRaw = dateEl ? dateEl.value : '';
  const location = locationEl ? locationEl.value : 'Toluca / Metepec';
  const people = peopleEl ? peopleEl.value : '1 persona';

  let formattedDate = 'Por definir';
  if (dateRaw) {
    const parts = dateRaw.split('-');
    if (parts.length === 3) {
      formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  }

  const text = `¡Hola, Gabriela! Vi tu página web y me gustaría consultar disponibilidad para una cita:\n\n` +
    `• Servicio: ${service}\n` +
    `• Fecha estimada: ${formattedDate}\n` +
    `• Modalidad / Ubicación: ${location}\n` +
    `• Personas: ${people}\n\n` +
    `¿Tienes disponibilidad para esta fecha?`;

  const phone = '527221659309';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');

  window.closeQuoteModal();
};

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    window.closeQuoteModal();
  }
});

const initDateInputMin = function() {
  const dateInput = document.getElementById('date-input');
  if (dateInput) {
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDateInputMin);
} else {
  initDateInputMin();
}
})();