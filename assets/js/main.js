/*
==============================================
AJK INSURANCE BROKERS - MAIN JAVASCRIPT
==============================================

HOW TO EDIT:
------------
1. FORM ENDPOINT: Update FORM_ENDPOINT constant below with your Formspree URL
2. ANIMATIONS: Enable/disable scroll animations in IntersectionObserver section
3. MOBILE BREAKPOINT: Change MOBILE_BREAKPOINT if needed
4. FORM VALIDATION: Customize validation rules in validateField()

FEATURES:
---------
- Preloader animation
- Sticky header with scroll effects
- Mobile menu toggle
- Multi-step form with validation
- Scroll reveal animations (IntersectionObserver)
- FAQ accordion
- Smooth scrolling with active section highlighting
- Parallax effects
- Form submission to Formspree
- Accessibility features (keyboard navigation, ARIA)

*/

// ==============================================
// CONFIGURATION
// ==============================================
const FORM_ENDPOINT = 'https://formspree.io/f/xwpgokyb'; // Update with your Formspree form ID
const MOBILE_BREAKPOINT = 768;

// ==============================================
// DOM READY
// ==============================================
document.addEventListener('DOMContentLoaded', function() {
  
  // Initialize all features
  initPreloader();
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initMultiStepForm();
  initFAQ();
  initParallax();
  updateYear();
  
  console.log('✓ AJK Insurance website initialized');
});

// ==============================================
// PRELOADER
// ==============================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  
  // Hide preloader after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.style.display = 'none';
        preloader.setAttribute('aria-hidden', 'true');
      }, 500);
    }, 800); // Show preloader for at least 800ms
  });
}

// ==============================================
// HEADER SCROLL EFFECTS
// ==============================================
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  
  let lastScroll = 0;
  
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add 'scrolled' class for background effect
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// ==============================================
// MOBILE MENU
// ==============================================
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (!menuToggle || !navMenu) return;
  
  // Toggle menu
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    
    menuToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    }
  });
  
  // Close menu when clicking nav links
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= MOBILE_BREAKPOINT) {
        closeMenu();
      }
    });
  });
  
  // Close menu on window resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      closeMenu();
    }
  });
  
  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ==============================================
// SMOOTH SCROLL & ACTIVE SECTION
// ==============================================
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  
  // Smooth scroll to section
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
          const headerOffset = 80;
          const elementPosition = targetSection.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
  
  // Highlight active section in nav
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (window.pageYOffset >= (sectionTop - 150)) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

// ==============================================
// SCROLL REVEAL ANIMATIONS
// ==============================================
function initScrollReveal() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Show all elements immediately if user prefers reduced motion
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }
  
  // IntersectionObserver for scroll reveal
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // Optionally unobserve after revealing
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });
  
  // Observe all elements with .reveal class
  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
}

// ==============================================
// MULTI-STEP FORM
// ==============================================
function initMultiStepForm() {
  const form = document.getElementById('applicationForm');
  if (!form) return;
  
  const steps = form.querySelectorAll('.form-step');
  const stepIndicators = form.querySelectorAll('.step-indicator');
  const btnNext = form.querySelector('.btn-next');
  const btnPrev = form.querySelector('.btn-prev');
  const btnSubmit = form.querySelector('.btn-submit');
  
  let currentStep = 1;
  
  // Next button
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (validateStep(currentStep)) {
        goToStep(currentStep + 1);
      }
    });
  }
  
  // Previous button
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      goToStep(currentStep - 1);
    });
  }
  
  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    await handleFormSubmit(form);
  });
  
  // Real-time validation on blur
  const inputs = form.querySelectorAll('.form-input[required]');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    // Clear error on input
    input.addEventListener('input', () => {
      clearFieldError(input);
    });
  });
  
  // Function to go to specific step
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > steps.length) return;
    
    // Hide all steps
    steps.forEach(step => step.classList.remove('active'));
    stepIndicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show target step
    const targetStep = form.querySelector(`.form-step[data-step="${stepNumber}"]`);
    const targetIndicator = form.querySelector(`.step-indicator[data-step="${stepNumber}"]`);
    
    if (targetStep) targetStep.classList.add('active');
    if (targetIndicator) targetIndicator.classList.add('active');
    
    currentStep = stepNumber;
    
    // Scroll to form top
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  
  // Validate current step
  function validateStep(stepNumber) {
    const step = form.querySelector(`.form-step[data-step="${stepNumber}"]`);
    if (!step) return true;
    
    const requiredInputs = step.querySelectorAll('.form-input[required]');
    let isValid = true;
    
    requiredInputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  // Validate individual field
  function validateField(input) {
    const value = input.value.trim();
    const fieldName = input.name;
    let errorMessage = '';
    
    // Check if empty
    if (!value) {
      errorMessage = 'This field is required';
    }
    // Email validation
    else if (input.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address';
      }
    }
    // Phone validation (basic)
    else if (input.type === 'tel') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 10) {
        errorMessage = 'Please enter a valid phone number';
      }
    }
    // Date validation
    else if (input.type === 'date') {
      const selectedDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - selectedDate.getFullYear();
      
      if (age < 18 || age > 100) {
        errorMessage = 'You must be between 18 and 100 years old';
      }
    }
    // Select validation
    else if (input.tagName === 'SELECT') {
      if (!value) {
        errorMessage = 'Please select an option';
      }
    }
    
    // Show/hide error
    if (errorMessage) {
      showFieldError(input, errorMessage);
      return false;
    } else {
      clearFieldError(input);
      return true;
    }
  }
  
  // Show field error
  function showFieldError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');
    
    const errorSpan = input.parentElement.querySelector('.form-error');
    if (errorSpan) {
      errorSpan.textContent = message;
      errorSpan.classList.add('show');
    }
  }
  
  // Clear field error
  function clearFieldError(input) {
    input.classList.remove('error');
    if (input.value.trim()) {
      input.classList.add('success');
    }
    
    const errorSpan = input.parentElement.querySelector('.form-error');
    if (errorSpan) {
      errorSpan.textContent = '';
      errorSpan.classList.remove('show');
    }
  }
  
  // Handle form submission
  async function handleFormSubmit(form) {
    const submitBtn = form.querySelector('.btn-submit');
    const statusDiv = document.getElementById('formStatus');
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    try {
      // Prepare form data
      const formData = new FormData(form);
      
      // Send to Formspree
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Success
        showFormStatus(statusDiv, 'success', '✓ Thank you! We will contact you within 24 hours.');
        form.reset();
        goToStep(1);
      } else {
        // Error from server
        const data = await response.json();
        throw new Error(data.error || 'Submission failed');
      }
    } catch (error) {
      // Network or other error
      console.error('Form submission error:', error);
      showFormStatus(statusDiv, 'error', '✗ Something went wrong. Please try again or call us at +1 (845) 662-8071');
    } finally {
      // Remove loading state
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
  }
  
  // Show form status message
  function showFormStatus(statusDiv, type, message) {
    if (!statusDiv) return;
    
    statusDiv.textContent = message;
    statusDiv.className = `form-status show ${type}`;
    
    // Hide after 10 seconds
    setTimeout(() => {
      statusDiv.classList.remove('show');
    }, 10000);
  }
}

// ==============================================
// FAQ ACCORDION
// ==============================================
function initFAQ() {
  const faqButtons = document.querySelectorAll('.faq-question');
  
  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      const answer = button.nextElementSibling;
      
      // Close all other FAQs
      faqButtons.forEach(otherButton => {
        if (otherButton !== button) {
          otherButton.setAttribute('aria-expanded', 'false');
          const otherAnswer = otherButton.nextElementSibling;
          if (otherAnswer) {
            otherAnswer.classList.remove('open');
          }
        }
      });
      
      // Toggle current FAQ
      button.setAttribute('aria-expanded', !isExpanded);
      
      if (answer) {
        if (isExpanded) {
          answer.classList.remove('open');
        } else {
          answer.classList.add('open');
        }
      }
    });
    
    // Keyboard accessibility
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });
}

// ==============================================
// PARALLAX EFFECT
// ==============================================
function initParallax() {
  const parallaxImages = document.querySelectorAll('.parallax-image');
  
  if (parallaxImages.length === 0) return;
  
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  window.addEventListener('scroll', () => {
    parallaxImages.forEach(image => {
      const rect = image.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * 0.05; // Parallax strength (adjust as needed)
      
      // Only apply if image is in viewport
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        image.style.transform = `translateY(${rate}px)`;
      }
    });
  });
}

// ==============================================
// UPDATE YEAR IN FOOTER
// ==============================================
function updateYear() {
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

// ==============================================
// UTILITY: Debounce function
// ==============================================
function debounce(func, wait = 20) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ==============================================
// KEYBOARD NAVIGATION HELPER
// ==============================================
// Add visual focus indicators for keyboard users
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// ==============================================
// PERFORMANCE: Reduce animations on low-end devices
// ==============================================
// Detect if device might be low-powered
if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) {
  console.log('Low-powered device detected, reducing animations');
  document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
  document.documentElement.style.setProperty('--transition-slow', 'all 0.3s ease');
}

// ==============================================
// ERROR HANDLING
// ==============================================
window.addEventListener('error', (e) => {
  console.error('Global error:', e.error);
  // Silently handle errors in production
  // Could send to error tracking service here
});

// ==============================================
// CONSOLE WELCOME MESSAGE
// ==============================================
console.log(`
%c🛡️ AJK Insurance Brokers LLC
%cProtecting what matters most
%cDeveloped with ❤️ for premium user experience
`, 
'font-size: 20px; font-weight: bold; color: #0b3a66',
'font-size: 14px; color: #5b677a',
'font-size: 12px; color: #10b981'
);
