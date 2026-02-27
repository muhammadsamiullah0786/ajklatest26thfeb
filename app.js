// ==============================================
// AJK INSURANCE - EMAILJS FORM HANDLER
// ==============================================
// This file handles ONLY the quote/contact form submission via EmailJS
// All other UI functionality (Swiper, menu, animations) is in main.js
// ==============================================

document.addEventListener('DOMContentLoaded', function() {

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
