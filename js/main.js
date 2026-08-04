/*
 * main.js
 *
 * Contains common JavaScript used across the Deka Solutions website: mobile
 * navigation toggling, AOS scroll animations, and the contact form submit
 * handler (posts to a Google Apps Script endpoint that logs to a Sheet).
 */

document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navList = document.querySelector('.navbar nav ul');
  const navLinks = document.querySelectorAll('.navbar nav a');

  navLinks.forEach((link) => {
    const linkPath = new URL(link.getAttribute('href'), window.location.href).pathname.split('/').pop();
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';

    if (linkPath === currentPath) {
      link.classList.add('active-page');
      link.setAttribute('aria-current', 'page');
    }
  });

  if (menuToggle && navList) {
    const setMenuState = (isOpen) => {
      navList.classList.toggle('show', isOpen);
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuToggle.addEventListener('click', () => {
      setMenuState(!navList.classList.contains('show'));
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        setMenuState(false);
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setMenuState(false);
        menuToggle.focus();
      }
    });
  }

  // Initialise AOS (Animate On Scroll)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }

  // Contact form submission -> Google Apps Script -> Google Sheet
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    const endpoint = contactForm.dataset.endpoint;
    const statusEl = document.querySelector('#formStatus');
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      if (!endpoint) {
        if (statusEl) {
          statusEl.textContent = "This form isn't connected yet. Please reach us by phone in the meantime.";
          statusEl.className = 'form-status error';
        }
        return;
      }

      const payload = {
        name: contactForm.name.value,
        email: contactForm.email.value,
        subject: contactForm.subject.value,
        message: contactForm.message.value
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      if (statusEl) {
        statusEl.textContent = '';
        statusEl.className = 'form-status';
      }

      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      })
        .then(function() {
          if (statusEl) {
            statusEl.textContent = "Thanks! Your message is in — we'll get back to you soon.";
            statusEl.className = 'form-status success';
          }
          contactForm.reset();
        })
        .catch(function() {
          if (statusEl) {
            statusEl.textContent = 'Something went wrong sending that. Please try again or call us.';
            statusEl.className = 'form-status error';
          }
        })
        .finally(function() {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    });
  }
});
