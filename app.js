
document.addEventListener('DOMContentLoaded', function() {

  // ===== Preloader & Current Year =====
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.style.opacity = '0';
    setTimeout(() => preloader && (preloader.style.display = 'none'), 450);
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }, 500);

  // ===== Hero Swiper =====
  const heroSwiper = new Swiper('.hero-swiper', {
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    effect: 'fade',
    speed: 700,
    fadeEffect: { crossFade: true }
  });

  const heroEl = document.querySelector('.hero-swiper');
  if (heroEl) {
    heroEl.addEventListener('mouseenter', () => heroSwiper.autoplay.stop());
    heroEl.addEventListener('mouseleave', () => heroSwiper.autoplay.start());
  }

  // ===== Services Swiper =====
  const servicesSwiper = new Swiper('.services-swiper', {
    slidesPerView: 1,
    spaceBetween: 16,
    loop: false,
    breakpoints: {
      480: { slidesPerView: 1 },
      640: { slidesPerView: 2 },
      900: { slidesPerView: 3 },
      1200: { slidesPerView: 4 }
    },
    pagination: { el: '.services-pagination', clickable: true }
  });

  // ===== Mobile Menu Toggle =====
  const mobileBtn = document.getElementById('mobileMenuBtn');
  mobileBtn && mobileBtn.addEventListener('click', function() {
    const nav = document.querySelector('.nav');
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if (nav) {
      nav.style.display = expanded ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '1rem';
    }
  });

  // ===== Lead Form Submission =====
  const leadForm = document.getElementById('leadForm');
  const API_ENDPOINT = ''; // replace with your backend URL if available

  leadForm && leadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    status.textContent = 'Submitting...';

    const formData = new FormData(leadForm);

    try {
      if (API_ENDPOINT) {
        const res = await fetch(API_ENDPOINT, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Network error');
        status.textContent = 'Thank you! We will contact you shortly.';
        leadForm.reset();
      } else {
        // Local capture (no backend)
        const data = {};
        formData.forEach((v, k) => { data[k] = v; });
        console.log('Lead (no-backend):', data);
        status.textContent = 'Form captured locally (check console) or connect your API.';
        leadForm.reset();
      }
    } catch (err) {
      console.error(err);
      status.textContent = 'Submission failed. Try again later.';
    }
  });

});
