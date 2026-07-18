// ==========================================================================
// Wraphix — main.js
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initReveal();
  initGalleryFilter();
  initLightbox();
  initContactForm();
  initYear();
});

/* ---- Nav: scroll state + mobile menu ---- */
function initNav() {
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
        burger.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }
}

/* ---- Scroll reveal via IntersectionObserver ---- */
function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('is-visible'));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  targets.forEach(t => io.observe(t));
}

/* ---- Gallery category filter ---- */
function initGalleryFilter() {
  const bar = document.querySelector('.filter-bar');
  const items = document.querySelectorAll('.gallery-item');
  if (!bar || !items.length) return;

  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filter = btn.dataset.filter;

    items.forEach(item => {
      const match = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !match);
    });
  });
}

/* ---- Lightbox for gallery images ---- */
function initLightbox() {
  const lightbox = document.querySelector('.lightbox');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  if (!lightbox || !items.length) return;

  const imgEl = lightbox.querySelector('img');
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  let currentIndex = 0;

  const visibleItems = () => items.filter(i => !i.classList.contains('is-hidden'));

  const open = (index) => {
    const list = visibleItems();
    currentIndex = index;
    const src = list[currentIndex].querySelector('img').getAttribute('data-full') ||
                list[currentIndex].querySelector('img').src;
    imgEl.src = src;
    imgEl.alt = list[currentIndex].querySelector('img').alt;
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  const step = (dir) => {
    const list = visibleItems();
    currentIndex = (currentIndex + dir + list.length) % list.length;
    open(currentIndex);
  };

  items.forEach((item) => {
    item.addEventListener('click', () => {
      const list = visibleItems();
      const idx = list.indexOf(item);
      open(idx >= 0 ? idx : 0);
    });
  });

  closeBtn && closeBtn.addEventListener('click', close);
  prevBtn && prevBtn.addEventListener('click', () => step(-1));
  nextBtn && nextBtn.addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
}

/* ---- Contact form: client-side validation, no backend yet ---- */
function initContactForm() {
  const form = document.querySelector('#quote-form');
  if (!form) return;
  const success = form.parentElement.querySelector('.form-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll('[data-required]').forEach((field) => {
      const wrapper = field.closest('.field');
      const value = field.value.trim();
      let fieldValid = value.length > 0;
      if (field.type === 'email' && value) {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      wrapper.classList.toggle('has-error', !fieldValid);
      if (!fieldValid) valid = false;
    });

    if (!valid) {
      const firstError = form.querySelector('.has-error');
      if (firstError) firstError.querySelector('input, select, textarea').focus();
      return;
    }

    // No backend wired yet — visual confirmation only.
    if (success) success.classList.add('is-visible');
    form.reset();
    form.querySelectorAll('.has-error').forEach(f => f.classList.remove('has-error'));
  });

  form.querySelectorAll('[data-required]').forEach((field) => {
    field.addEventListener('blur', () => {
      const wrapper = field.closest('.field');
      const value = field.value.trim();
      let fieldValid = value.length > 0;
      if (field.type === 'email' && value) {
        fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      wrapper.classList.toggle('has-error', !fieldValid);
    });
  });
}

function initYear() {
  const el = document.querySelector('#year');
  if (el) el.textContent = new Date().getFullYear();
}
