// Direct SMTP test to verify credentials
require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('\n=== Testing SMTP Configuration ===\n');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? '***' + process.env.SMTP_PASS.slice(-4) : 'NOT SET');
console.log('Password length:', process.env.SMTP_PASS?.length);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  debug: true, // Enable debug output
  logger: true  // Log to console
});

console.log('\n=== Attempting SMTP Connection ===\n');

transporter.verify((error, success) => {
  if (error) {
    console.log('\n❌ SMTP Connection FAILED:');
    console.log('Error:', error.message);
    console.log('Response Code:', error.responseCode);
    console.log('Response:', error.response);
  } else {
    console.log('\n✅ SMTP Connection SUCCESSFUL!');
    console.log('Server is ready to send emails');
  }
  process.exit(error ? 1 : 0);
});
