// ==============================================
// AJK INSURANCE - EMAILJS FORM HANDLER
// ==============================================
// This file handles ONLY the quote/contact form submission via EmailJS
// All other UI functionality (Swiper, menu, animations) is in main.js
// ==============================================

document.addEventListener('DOMContentLoaded', function() {

  // ===== EmailJS Configuration =====
  // Wait for EmailJS to load, then initialize
  console.log('Checking EmailJS availability...');
  
  // Give the EmailJS library time to load
  setTimeout(function() {
    if (typeof emailjs !== 'undefined') {
      emailjs.init('PYcH71DH2oAKBx8OP');
      console.log('✓ EmailJS initialized successfully');
    } else {
      console.error('✗ EmailJS library not loaded - please check internet connection');
    }
  }, 100);

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
          formStatus.innerHTML = '✗ <strong>Error:</strong> Email service not loaded. Please refresh the page and try again.';
          formStatus.style.cssText = 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 6px; padding: 16px; margin-bottom: 16px; font-weight: 500;';
        }
        // Reset button state
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
        submitButton.disabled = false;
        return;
      }

      // Check honeypot (spam protection)
      const honeypot = document.getElementById('honeypot');
      if (honeypot && honeypot.value) {
        console.warn('Spam detected via honeypot');
        return;
      }

      // Show loading state
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoader = submitButton.querySelector('.btn-loader');
    if (btnText) btnText.style.display = 'none';
    if (btnLoader) btnLoader.style.display = 'inline-flex';
    submitButton.disabled = true;

    if (formStatus) {
      formStatus.innerHTML = '<svg style="width: 18px; height: 18px; vertical-align: middle; margin-right: 8px; display: inline-block; animation: spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2 A10 10 0 0 1 22 12"></path></svg>Processing your request...';
      formStatus.style.cssText = 'color: #0b3b5d; background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 6px; padding: 16px; margin-bottom: 16px; font-weight: 500;';
    }

    try {
      // Collect form data
      const formData = new FormData(applicationForm);
      
      // Prepare template parameters for EmailJS
      const templateParams = {
        from_name: 'AJK Insurance Brokers', // Branded sender name
        to_email: 'khan@ajk-insurance.com',
        reply_to: 'khan@ajk-insurance.com',
        
        // Email subject with dynamic content
        subject: 'New Lead - ' + (formData.get('insuranceType') || 'Quote Request') + ' - ' + (formData.get('city') || 'Location TBD'),
        
        // User information
        fullName: formData.get('fullName') || '',
        from_email: formData.get('email') || '',
        phone: formData.get('phone') || '',
        dob: formData.get('dob') || 'Not provided',
        insurance_type: formData.get('insuranceType') || '',
        city: formData.get('city') || 'Not provided',
        country: formData.get('country') || 'Not provided',
        message: formData.get('message') || 'No additional message'
      };

      console.log('Sending email via EmailJS...', { 
        subject: templateParams.subject, 
        to_email: templateParams.to_email,
        from_email: templateParams.from_email,
        service: 'service_l35eaus',
        template: 'template_bcfbrbg'
      });

      // Send email using EmailJS
      const response = await emailjs.send(
        'service_l35eaus',      // Your Service ID
        'template_bcfbrbg',     // Your Template ID
        templateParams
      );

      console.log('EmailJS Response:', response);
      
      // Success!
      if (formStatus) {
        formStatus.innerHTML = '<svg style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; display: inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg><strong>Thank you!</strong> We received your quote request.<br>We\'ll contact you within 24 hours at <strong>' + templateParams.from_email + '</strong>';
        formStatus.style.cssText = 'color: #28a745; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 6px; padding: 16px; margin-bottom: 16px; font-weight: 500;';
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
        formStatus.innerHTML = '<svg style="width: 20px; height: 20px; vertical-align: middle; margin-right: 8px; display: inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg><strong>Submission Error</strong><br>' + errorMsg + '<br><br><a href="tel:+18456628071" style="color: #dc3545; font-weight: 600;">📞 Call us: +1 (845) 662-8071</a> or try again.';
        formStatus.style.cssText = 'color: #721c24; background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 6px; padding: 16px; margin-bottom: 16px; font-weight: 500;';
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
