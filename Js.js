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
})();