/**
 * AJK Insurance - Email Server
 * Sends form submissions via Titan SMTP
 * 
 * SETUP:
 * 1. Install dependencies: npm install express nodemailer cors body-parser dotenv
 * 2. Add your Titan password to .env file
 * 3. Run: node backend/server.js
 */

require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'https://ajk-insurance.com', 'https://www.ajk-insurance.com'],
  credentials: true
}));
app.use(bodyParser.json());

// ===== Rate Limiting (Simple in-memory) =====
const requestCounts = {};
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW) || 60000; // 1 minute
const MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 5;

function checkRateLimit(ip) {
  const now = Date.now();
  if (!requestCounts[ip]) {
    requestCounts[ip] = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
  }

  const userData = requestCounts[ip];
  
  // Reset if window expired
  if (now > userData.resetTime) {
    userData.count = 0;
    userData.resetTime = now + RATE_LIMIT_WINDOW;
  }

  userData.count++;

  return userData.count <= MAX_REQUESTS;
}

// ===== Nodemailer Transport (Titan SMTP) =====
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true', // TLS (false for port 587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// ===== Verify Connection on Startup =====
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP Connection Error:', error.message);
    console.error('Make sure your .env file has the correct Titan credentials');
  } else {
    console.log('✓ SMTP connection ready');
  }
});

// ===== Validation Function =====
function validateFormData(data) {
  const errors = [];

  // Required fields
  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.push('Full name is required (min 2 characters)');
  }
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }
  if (!data.phone || data.phone.trim().length < 7) {
    errors.push('Valid phone number is required');
  }
  if (!data.insuranceType || data.insuranceType.trim().length === 0) {
    errors.push('Insurance type is required');
  }

  // Optional but validate if provided
  if (data.dob && !/^\d{4}-\d{2}-\d{2}$/.test(data.dob)) {
    errors.push('Date of birth must be in YYYY-MM-DD format');
  }

  return errors;
}

// ===== Email Templates =====
function getAdminEmailTemplate(data) {
  return `
    <h2>New Insurance Quote Request</h2>
    <p><strong>Received at:</strong> ${new Date().toLocaleString()}</p>
    
    <h3>Customer Information:</h3>
    <ul>
      <li><strong>Full Name:</strong> ${escapeHtml(data.fullName)}</li>
      <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Phone:</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Date of Birth:</strong> ${escapeHtml(data.dob || 'Not provided')}</li>
      <li><strong>Insurance Type:</strong> ${escapeHtml(data.insuranceType)}</li>
      <li><strong>City:</strong> ${escapeHtml(data.city || 'Not provided')}</li>
      <li><strong>Country:</strong> ${escapeHtml(data.country || 'Not provided')}</li>
    </ul>
    
    <h3>Message:</h3>
    <p>${escapeHtml(data.message || 'No additional message').replace(/\n/g, '<br>')}</p>
    
    <hr>
    <p><em>This is an automated message. Please reply to ${data.email}</em></p>
  `;
}

function getCustomerEmailTemplate(data) {
  return `
    <h2>Thank You for Your Insurance Quote Request!</h2>
    
    <p>Hi ${escapeHtml(data.fullName)},</p>
    
    <p>We have received your quote request for <strong>${escapeHtml(data.insuranceType)} insurance</strong>.</p>
    
    <p>Our team will review your information and contact you shortly at:</p>
    <ul>
      <li><strong>Phone:</strong> ${escapeHtml(data.phone)}</li>
      <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
    </ul>
    
    <p><strong>What happens next?</strong></p>
    <ol>
      <li>We'll review your request and insurance needs</li>
      <li>Our team will provide you with personalized quotes from multiple carriers</li>
      <li>We'll contact you within 24 hours with available options</li>
    </ol>
    
    <p><strong>In the meantime:</strong></p>
    <ul>
      <li>Check your spam folder if you don't receive our response</li>
      <li>Call us directly: <a href="tel:+18456628071">+1 (845) 662-8071</a></li>
      <li>Visit our FAQ: <a href="https://ajk-insurance.com#faq">ajk-insurance.com</a></li>
    </ul>
    
    <p>Thank you for choosing <strong>AJK Insurance Brokers</strong>!</p>
    
    <hr>
    <p>
      <strong>AJK Insurance Brokers LLC</strong><br>
      Phone: <a href="tel:+18456628071">+1 (845) 662-8071</a><br>
      Email: <a href="mailto:khan@ajk-insurance.com">khan@ajk-insurance.com</a>
    </p>
  `;
}

// ===== Escape HTML to Prevent XSS =====
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// ===== Main Email Endpoint =====
app.post('/api/send-email', async (req, res) => {
  try {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    
    // Rate limiting check
    if (!checkRateLimit(clientIP)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please wait before submitting again.'
      });
    }

    const { fullName, email, phone, insuranceType, dob, city, country, message, honeypot } = req.body;

    // Honeypot spam check - if filled, it's a bot
    if (honeypot) {
      console.warn('🚫 Honeypot triggered from IP:', clientIP);
      return res.status(400).json({
        success: false,
        message: 'Invalid form submission'
      });
    }

    // Validate required fields
    const errors = validateFormData({ fullName, email, phone, insuranceType, dob, city, country, message });
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }

    // Prepare form data object
    const formData = {
      fullName,
      email,
      phone,
      insuranceType,
      dob: dob || '',
      city: city || '',
      country: country || '',
      message: message || ''
    };

    // Send email to admin
    await transporter.sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Quote Request: ${formData.insuranceType} Insurance from ${formData.fullName}`,
      html: getAdminEmailTemplate(formData),
      replyTo: email,
      priority: 'high'
    });

    console.log(`✓ Admin email sent for: ${email}`);

    // Send auto-reply to customer
    await transporter.sendMail({
      from: `"${process.env.SENDER_NAME}" <${process.env.SENDER_EMAIL}>`,
      to: email,
      subject: 'We Received Your Insurance Quote Request',
      html: getCustomerEmailTemplate(formData),
      priority: 'normal'
    });

    console.log(`✓ Auto-reply email sent to: ${email}`);

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Thank you! Your quote request has been received. Check your email for confirmation.'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to send email. Please try again later.',
      debug: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// ===== Health Check Endpoint =====
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Email server is running' });
});

// ===== Health Check Endpoint with SMTP Test =====
app.get('/api/health/smtp', async (req, res) => {
  try {
    await transporter.verify();
    res.json({ status: 'ok', message: 'SMTP connection successful' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'SMTP connection failed: ' + error.message });
  }
});

// ===== 404 Handler =====
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    message: 'Server error occurred',
    debug: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== Start Server =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✓ Email server running on http://localhost:${PORT}`);
  console.log(`✓ Test endpoint: GET http://localhost:${PORT}/api/health`);
  console.log(`✓ Test SMTP: GET http://localhost:${PORT}/api/health/smtp`);
  console.log(`✓ Send email: POST http://localhost:${PORT}/api/send-email\n`);
});
