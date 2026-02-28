# 🔧 EmailJS Template Configuration Guide

## ❌ Problem
The email is received but Name, Email, and Insurance Type are not showing in the email body.

## ✅ Solution
You need to update your EmailJS template to use the correct variable names.

---

## 📧 Step-by-Step Instructions

### 1. Go to EmailJS Dashboard
Visit: https://dashboard.emailjs.com/admin

### 2. Navigate to Email Templates
- Click on **"Email Templates"** in the left sidebar
- Find and click on template: **template_bcfbrbg**

### 3. Update the Email Template

**SUBJECT LINE:**
```
{{subject}}
```

**EMAIL BODY (HTML):**
```html
<h2>New Insurance Quote Request</h2>

<div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
  
  <h3 style="color: #0b3b5d; margin-top: 0;">Contact Information</h3>
  
  <p><strong>Name:</strong> {{fullName}}</p>
  <p><strong>Email:</strong> {{from_email}}</p>
  <p><strong>Phone:</strong> {{phone}}</p>
  <p><strong>Date of Birth:</strong> {{dob}}</p>
  
  <h3 style="color: #0b3b5d; margin-top: 25px;">Insurance Details</h3>
  
  <p><strong>Insurance Type:</strong> {{insurance_type}}</p>
  <p><strong>City:</strong> {{city}}</p>
  <p><strong>Country:</strong> {{country}}</p>
  
  <h3 style="color: #0b3b5d; margin-top: 25px;">Additional Message</h3>
  
  <p style="background: white; padding: 15px; border-left: 4px solid #0b3b5d; border-radius: 4px;">
    {{message}}
  </p>

</div>

<hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

<p style="color: #666; font-size: 12px;">
  This email was sent from AJK Insurance Brokers website contact form.<br>
  Reply to: {{from_email}}
</p>
```

### 4. Configure Template Settings

**From Name:** 
```
{{from_name}}
```

**From Email:** Use your verified EmailJS sender email (e.g., your@email.com)

**Reply To:** 
```
{{reply_to}}
```

**To Email:**
```
{{to_email}}
```

---

## 🔑 Important Variable Names

Make sure to use these EXACT variable names with double curly braces:

| Variable | Description |
|----------|-------------|
| `{{subject}}` | Email subject line |
| `{{fullName}}` | Customer's full name |
| `{{from_email}}` | Customer's email address |
| `{{phone}}` | Customer's phone number |
| `{{dob}}` | Date of birth |
| `{{insurance_type}}` | Type of insurance requested |
| `{{city}}` | Customer's city |
| `{{country}}` | Customer's country |
| `{{message}}` | Additional message from customer |
| `{{from_name}}` | Sender name (AJK Insurance Brokers) |
| `{{to_email}}` | Recipient email (khan@ajk-insurance.com) |
| `{{reply_to}}` | Reply-to address |

---

## 📝 Quick Copy Template

Here's a simple template you can copy and paste:

**SUBJECT:**
```
{{subject}}
```

**CONTENT:**
```
New Insurance Quote Request

Name: {{fullName}}
Email: {{from_email}}
Phone: {{phone}}
DOB: {{dob}}

Insurance Type: {{insurance_type}}
City: {{city}}
Country: {{country}}

Message:
{{message}}

---
Reply to: {{from_email}}
```

---

## ✅ After Making Changes

1. Click **"Save"** in EmailJS dashboard
2. Go back to your website: https://ajk-insurance.com
3. Submit a test form
4. Check your email at khan@ajk-insurance.com
5. You should now see all the information correctly displayed!

---

## 🆘 Need Help?

If you're still having issues:
1. Make sure you're editing template: **template_bcfbrbg**
2. Make sure you're using Service: **service_l35eaus**
3. Double-check the variable names match exactly (case-sensitive!)
4. Test with the simple test file: test-emailjs-simple.html
