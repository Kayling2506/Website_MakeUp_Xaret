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
      // copiar dimensiones para evitar salto de layout
      wrapper.style.display = getComputedStyle(img).display === 'block' ? 'block' : 'inline-block';
      wrapper.style.width = img.width ? img.width + 'px' : img.style.width || 'auto';
      wrapper.style.height = img.height ? img.height + 'px' : img.style.height || 'auto';
      // insertar wrapper y mover la imagen dentro
      img.parentNode.insertBefore(wrapper, img);
      wrapper.appendChild(img);
      // crear overlay que captura clicks y evita menú contextual
      const overlay = document.createElement('span');
      overlay.className = 'img-protect__overlay';
      wrapper.appendChild(overlay);
    } catch(e){}
  };

  // Proteger imágenes ya existentes
  document.querySelectorAll('img').forEach(wrapImage);

  // Observer para nuevas imágenes
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

  // Bloqueos globales
  window.addEventListener('contextmenu', function(e){
    // bloquear menú contextual sobre imágenes y sobre overlays
    if (e.target && (e.target.tagName === 'IMG' || e.target.classList && e.target.classList.contains('img-protect__overlay'))) {
      e.preventDefault();
    }
  }, {passive:false});

  document.addEventListener('dragstart', function(e){
    if (e.target && e.target.tagName === 'IMG') e.preventDefault();
  }, {passive:false});

  // Evitar selección de texto y copiar en toda la página (opcionalmente puedes limitarlo)
  document.addEventListener('selectstart', function(e){
    if (e.target && (e.target.tagName === 'IMG' || e.target.closest && e.target.closest('.img-protect'))) {
      e.preventDefault();
    }
  }, {passive:false});

  // Bloquear atajos comunes para guardar/inspeccionar
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
    // bloquear Ctrl+Shift+S (guardar como en algunos navegadores)
    if (e.ctrlKey && e.shiftKey && key === 's') {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }, {passive:false});

  // Evitar pulsación larga en móviles sobre imágenes (algunos navegadores)
  document.addEventListener('touchstart', function(e){
    if (e.target && (e.target.tagName === 'IMG' || e.target.classList && e.target.classList.contains('img-protect__overlay'))) {
      // no impedir todos los toques, solo evitar gesto de pulsación larga
      // usando preventDefault puede afectar scroll; aplicamos solo si hay más de un toque
      if (e.touches && e.touches.length === 1) {
        // pequeña protección: cancelar el contexto si se detecta touch prolonged via timeout
        let t = setTimeout(()=>{},1);
        clearTimeout(t);
      }
    }
  }, {passive:false});

  // Opción extra: superponer una capa global que capture clics sobre imágenes (descomentar si se desea)
  // const globalOverlay = document.createElement('div');
  // globalOverlay.style.position = 'fixed';
  // globalOverlay.style.inset = '0';
  // globalOverlay.style.pointerEvents = 'none';
  // document.body.appendChild(globalOverlay);

})();