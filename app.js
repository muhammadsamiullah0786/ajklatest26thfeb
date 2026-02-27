
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

  // ===== EmailJS Configuration =====
  // Wait for EmailJS to load, then initialize
  if (typeof emailjs !== 'undefined') {
    emailjs.init('PYcH71DH2oAKBx8OP');
    console.log('✓ EmailJS initialized');
  } else {
    console.error('✗ EmailJS library not loaded');
  }

  // ===== Application Form Submission (Contact & Quote Form) using EmailJS =====
  const applicationForm = document.getElementById('applicationForm');
  const formStatus = document.getElementById('formStatus');
  const submitButton = applicationForm && applicationForm.querySelector('button[type="submit"]');

  if (applicationForm) {
    applicationForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('Form submission triggered');
      
      if (!submitButton) {
        console.error('Submit button not found');
        return;
      }

      // Check if EmailJS is loaded
      if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded');
        if (formStatus) {
          formStatus.innerHTML = '✗ <strong>Error:</strong> Email service not loaded. Please refresh the page.';
          formStatus.style.color = '#dc3545';
        }
        return;
      }

      // Check honeypot (spam protection)
      const honeypot = document.getElementById('honeypot');
      if (honeypot && honeypot.value) {
        console.warn('Spam detected via honeypot');
        return;
      }
    if (honeypot) {
      console.warn('Spam detected via honeypot');
      return false;
    }

    // Show loading state
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoader = submitButton.querySelector('.btn-loader');
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline-flex';
    submitButton.disabled = true;

    if (formStatus) {
      formStatus.textContent = 'Sending your request...';
      formStatus.style.color = '#0b3b5d';
      formStatus.style.fontWeight = '600';
    }

    try {
      // Collect form data
      const formData = new FormData(applicationForm);
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: formData.get('fullName') || '',
        from_email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        dob: formData.get('dob') || 'Not provided',
        insurance_type: formData.get('insuranceType') || '',
        city: formData.get('city') || 'Not provided',
        country: formData.get('country') || 'Not provided',
        message: formData.get('message') || 'No additional message',
        to_email: 'khan@ajk-insurance.com' // Your admin email
      };

      console.log('Sending email via EmailJS...', { name: templateParams.from_name, email: templateParams.from_email });

      // Send email using EmailJS
      const response = await emailjs.send(
        'service_l35eaus',      // Your Service ID
        'template_bcfbrbg',     // Your Template ID
        templateParams
      );

      console.log('EmailJS Response:', response);
      
      // Success!
      if (formStatus) {
        formStatus.innerHTML = '✓ <strong>Thank you!</strong> We received your quote request. We\'ll contact you within 24 hours at ' + templateParams.from_email;
        formStatus.style.color = '#28a745';
      }
      
      // Reset form
      applicationForm.reset();
      
      // Scroll to success message
      formStatus && formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Clear message after 10 seconds
      setTimeout(() => {
        if (formStatus) formStatus.textContent = '';
      }, 10000);
      
    } catch (err) {
      console.error('EmailJS Error:', err);
      console.error('Error details:', err.text || err.message || err);
      
      if (formStatus) {
        const errorMsg = err.text || err.message || 'Unknown error';
        formStatus.innerHTML = '✗ <strong>Something went wrong.</strong> ' + errorMsg + '<br>Please try again or call us at +1 (845) 662-8071';
        formStatus.style.color = '#dc3545';
      }
    } finally {
      // Reset button state
      if (btnText) btnText.style.display = 'inline';
      if (btnLoader) btnLoader.style.display = 'none';
      submitButton.disabled = false;
    }
    });
  }

});
