/**
 * Makeup Xaret - Main JavaScript Module
 * Clean, accessible, event-driven module
 */

(function () {
  'use strict';

  // --- 1. MODAL CONTROLLER ---
  const ModalController = {
    modal: null,
    lastActiveElement: null,

    init() {
      this.modal = document.getElementById('quote-modal');
      if (!this.modal) return;

      // Event delegation for opening modal
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-modal-open="quote-modal"]');
        if (trigger) {
          e.preventDefault();
          this.open(trigger);
        }
      });

      // Event delegation for closing modal
      document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('[data-modal-close]');
        if (closeBtn || e.target === this.modal) {
          e.preventDefault();
          this.close();
        }
      });

      // Keyboard listener (Escape key & Focus trap)
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen()) return;

        if (e.key === 'Escape') {
          this.close();
        } else if (e.key === 'Tab') {
          this.trapFocus(e);
        }
      });
    },

    isOpen() {
      return this.modal && this.modal.classList.contains('active');
    },

    open(triggerElement = null) {
      if (!this.modal) return;
      this.lastActiveElement = triggerElement || document.activeElement;

      this.modal.classList.add('active');
      this.modal.setAttribute('aria-hidden', 'false');
      this.modal.setAttribute('aria-modal', 'true');
      document.body.style.overflow = 'hidden';

      // Focus first input or button in modal
      const focusable = this.getFocusableElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      }
    },

    close() {
      if (!this.modal) return;

      this.modal.classList.remove('active');
      this.modal.setAttribute('aria-hidden', 'true');
      this.modal.removeAttribute('aria-modal');
      document.body.style.overflow = '';

      if (this.lastActiveElement && typeof this.lastActiveElement.focus === 'function') {
        this.lastActiveElement.focus();
      }
    },

    getFocusableElements() {
      if (!this.modal) return [];
      return Array.from(
        this.modal.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
    },

    trapFocus(e) {
      const focusables = this.getFocusableElements();
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  // --- 2. WHATSAPP QUOTE FORM MODULE ---
  const QuoteForm = {
    init() {
      const form = document.getElementById('quote-form');
      const dateInput = document.getElementById('date-input');

      // Set minimum date to today
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          this.sendQuote();
        });
      }
    },

    sendQuote() {
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

      const text =
        `¡Hola, Gabriela! Vi tu página web y me gustaría consultar disponibilidad para una cita:\n\n` +
        `• Servicio: ${service}\n` +
        `• Fecha estimada: ${formattedDate}\n` +
        `• Modalidad / Ubicación: ${location}\n` +
        `• Personas: ${people}\n\n` +
        `¿Tienes disponibilidad para esta fecha?`;

      const phone = '527221659309';
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

      window.open(url, '_blank', 'noopener,noreferrer');
      ModalController.close();
    }
  };

  // --- 3. MEDIA PROTECTION & ACCESSIBILITY ---
  const MediaProtection = {
    init() {
      // Prevent dragging of image assets
      document.querySelectorAll('img').forEach((img) => {
        img.setAttribute('draggable', 'false');
        img.classList.add('img-protected');
      });

      // Prevent right-click context menu specifically on images without interfering with page inspection/accessibility
      document.addEventListener('contextmenu', (e) => {
        if (e.target && e.target.tagName === 'IMG') {
          e.preventDefault();
        }
      });
    }
  };

  // --- 4. UTILITIES & INIT ---
  const App = {
    init() {
      // Populate current copyright year
      const currentYear = new Date().getFullYear();
      document.querySelectorAll('.current-year').forEach((el) => {
        el.textContent = currentYear;
      });

      // Initialize modules
      ModalController.init();
      QuoteForm.init();
      MediaProtection.init();
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.init);
  } else {
    App.init();
  }
})();