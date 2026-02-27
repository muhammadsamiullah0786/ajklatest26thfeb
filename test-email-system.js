/**
 * Test Script for Email Form Submission
 * 
 * Usage:
 * 1. Make sure backend is running: npm start
 * 2. Open browser console (F12)
 * 3. Paste this entire script and press Enter
 * 
 * Or save as test.js and run: node test.js
 */

// Configuration
const BACKEND_URL = 'http://localhost:3000';
const API_ENDPOINT = `${BACKEND_URL}/api/send-email`;

// Test data
const testFormData = {
  fullName: 'John Doe',
  email: 'test@example.com',
  phone: '(555) 123-4567',
  insuranceType: 'Life',
  dob: '1990-01-15',
  city: 'New York',
  country: 'United States',
  message: 'I am interested in a life insurance policy. Please contact me with options.',
  honeypot: '' // IMPORTANT: Keep empty to pass spam check
};

// Test 1: Check if backend is running
async function testHealthCheck() {
  console.log('\n========== TEST 1: Health Check ==========');
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    const data = await res.json();
    console.log('✓ Backend is running!', data);
    return true;
  } catch (error) {
    console.error('✗ Backend is not running. Start it with: npm start', error);
    return false;
  }
}

// Test 2: Check SMTP connection
async function testSMTPConnection() {
  console.log('\n========== TEST 2: SMTP Connection ==========');
  try {
    const res = await fetch(`${BACKEND_URL}/api/health/smtp`);
    const data = await res.json();
    if (data.status === 'ok') {
      console.log('✓ SMTP connection successful!', data);
      return true;
    } else {
      console.error('✗ SMTP connection failed:', data);
      return false;
    }
  } catch (error) {
    console.error('✗ Could not test SMTP:', error.message);
    return false;
  }
}

// Test 3: Send test email (valid data)
async function testValidEmail() {
  console.log('\n========== TEST 3: Send Valid Email ==========');
  console.log('Test data:', testFormData);
  
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(testFormData)
    });

    const data = await res.json();
    
    if (res.ok) {
      console.log('✓ Email sent successfully!', data);
      return true;
    } else {
      console.error('✗ Email failed:', data);
      return false;
    }
  } catch (error) {
    console.error('✗ Request failed:', error.message);
    return false;
  }
}

// Test 4: Test spam protection (honeypot filled)
async function testSpamProtection() {
  console.log('\n========== TEST 4: Spam Protection (Honeypot) ==========');
  
  const spamData = { ...testFormData, honeypot: 'FILLED' };
  console.log('Sending form with filled honeypot field...');
  
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(spamData)
    });

    const data = await res.json();
    
    if (res.status === 400) {
      console.log('✓ Spam correctly blocked!', data);
      return true;
    } else {
      console.error('✗ Spam not blocked:', data);
      return false;
    }
  } catch (error) {
    console.error('✗ Request failed:', error.message);
    return false;
  }
}

// Test 5: Test validation (missing required fields)
async function testValidation() {
  console.log('\n========== TEST 5: Validation Check ==========');
  
  const invalidData = {
    fullName: 'X', // Too short
    email: 'invalid-email', // Invalid format
    phone: '123', // Too short
    insuranceType: '', // Empty (required)
    honeypot: ''
  };
  
  console.log('Sending form with invalid data...');
  
  try {
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(invalidData)
    });

    const data = await res.json();
    
    if (!res.ok && data.errors) {
      console.log('✓ Validation errors correctly detected:', data.errors);
      return true;
    } else {
      console.error('✗ Validation not working:', data);
      return false;
    }
  } catch (error) {
    console.error('✗ Request failed:', error.message);
    return false;
  }
}

// Test 6: Test rate limiting
async function testRateLimiting() {
  console.log('\n========== TEST 6: Rate Limiting ==========');
  console.log('Sending 6 requests rapidly (limit is 5 per minute)...\n');
  
  let successCount = 0;
  let blockedCount = 0;

  for (let i = 1; i <= 6; i++) {
    try {
      const testData = { ...testFormData, email: `test${i}@example.com` };
      
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      if (res.status === 429) {
        console.log(`  Request ${i}: ✗ Rate limited (too many requests)`);
        blockedCount++;
      } else if (res.ok) {
        console.log(`  Request ${i}: ✓ Sent successfully`);
        successCount++;
      } else {
        console.log(`  Request ${i}: ? Status ${res.status}`);
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log(`  Request ${i}: ✗ Error - ${error.message}`);
    }
  }

  console.log(`\n✓ Rate limiting working! Allowed: ${successCount}, Blocked: ${blockedCount}`);
  return blockedCount > 0;
}

// Run all tests
async function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║    AJK Insurance Email System Tests    ║');
  console.log('║           Backend: ' + BACKEND_URL.padEnd(20) + '║');
  console.log('╚════════════════════════════════════════╝');

  const results = {
    healthCheck: await testHealthCheck(),
    smtpConnection: await testSMTPConnection(),
    validEmail: await testValidEmail(),
    spamProtection: await testSpamProtection(),
    validation: await testValidation(),
    rateLimiting: await testRateLimiting()
  };

  console.log('\n╔════════════════════════════════════════╗');
  console.log('║              Test Summary              ║');
  console.log('╚════════════════════════════════════════╝\n');

  const passed = Object.values(results).filter(r => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, result]) => {
    const status = result ? '✓ PASS' : '✗ FAIL';
    console.log(`${status} - ${test}`);
  });

  console.log(`\n${passed}/${total} tests passed\n`);

  if (passed === total) {
    console.log('🎉 All tests passed! Your email system is ready!');
  } else {
    console.log('⚠️  Some tests failed. Check the errors above.');
  }
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runAllTests, testHealthCheck, testSMTPConnection, testValidEmail };
}

// Auto-run if executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runAllTests().catch(console.error);
}
