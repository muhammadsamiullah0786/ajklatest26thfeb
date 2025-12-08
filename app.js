
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
  const nav = document.querySelector('.nav');
  
  mobileBtn && mobileBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const expanded = this.getAttribute('aria-expanded') === 'true';
    this.setAttribute('aria-expanded', String(!expanded));
    if (nav) {
      nav.style.display = expanded ? 'none' : 'flex';
      nav.style.flexDirection = 'column';
      nav.style.gap = '1rem';
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(e) {
    if (nav && window.innerWidth <= 1100) {
      if (!e.target.closest('.nav') && !e.target.closest('.hamburger')) {
        nav.style.display = 'none';
        if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Close mobile menu when clicking nav links
  if (nav) {
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1100) {
          nav.style.display = 'none';
          if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href !== '#' && href !== '#home') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ===== Lead Form Submission =====
  const leadForm = document.getElementById('leadForm');
  const API_ENDPOINT = '/.netlify/functions/submit-form';

  leadForm && leadForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const status = document.getElementById('formStatus');
    
    // Show loading state
    status.textContent = 'Submitting...';
    status.style.color = '#0b3b5d';
    status.style.fontWeight = '600';

    // Collect form data with correct field mapping
    const formData = new FormData(leadForm);
    const data = {
      name: formData.get('fullName') || '',
      email: formData.get('email') || '',
      phone: formData.get('phone') || '',
      dob: formData.get('dob') || '',
      insuranceType: formData.get('insuranceType') || '',
      city: formData.get('city') || '',
      country: formData.get('country') || '',
      message: formData.get('message') || ''
    };

    console.log('Submitting form data:', data);

    try {
      const res = await fetch(API_ENDPOINT, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      console.log('Server response:', result);
      
      if (!res.ok) {
        throw new Error(result.error || 'Network error');
      }
      
      status.textContent = '✓ Thank you! We will contact you shortly.';
      status.style.color = '#28a745';
      leadForm.reset();
      
      setTimeout(() => {
        status.textContent = '';
      }, 5000);
    } catch (err) {
      console.error('Form submission error:', err);
      status.textContent = '✗ Error: ' + (err.message || 'Please try again later.');
      status.style.color = '#dc3545';
      
      // Show more detailed error after 3 seconds if in development
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        setTimeout(() => {
          status.textContent += ' (Check console for details)';
        }, 3000);
      }
    }
  });

});
