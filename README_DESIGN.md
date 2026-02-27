# AJK Insurance Brokers - Premium Website

A modern, conversion-focused insurance website built with pure HTML, CSS, and vanilla JavaScript.

## 🎨 Features

- **Premium Design**: Modern UI with gradients, shadows, and smooth animations
- **Fully Responsive**: Mobile-first approach with perfect display on all devices
- **Accessible**: WCAG compliant with keyboard navigation and screen reader support
- **Performance Optimized**: No heavy frameworks, fast loading times
- **Multi-Step Form**: User-friendly 2-step application process with validation
- **Scroll Animations**: Smooth reveal animations using IntersectionObserver
- **FAQ Accordion**: Interactive FAQ section with smooth transitions
- **SEO Optimized**: Semantic HTML5 with proper meta tags

## 📁 File Structure

```
/
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css         # Complete stylesheet with design system
│   ├── js/
│   │   └── main.js           # All JavaScript functionality
│   ├── logo.png              # Company logo
│   ├── hero-1.jpg            # Hero background image
│   ├── service-*.jpg         # Service images
│   └── office.jpg            # Office/contact image
└── README_DESIGN.md          # This file
```

## 🎯 Design System

### Colors
- **Primary**: `#0b3a66` (Deep blue)
- **Primary 2**: `#0a2f52` (Darker blue)
- **Background**: `#f6f8fc` (Soft gray-blue)
- **Text**: `#0b1220` (Nearly black)
- **Muted**: `#5b677a` (Gray)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: 700-800 weight
- **Body**: 400-500 weight

### Spacing
- **Mobile**: 48px section padding
- **Tablet**: 64px section padding
- **Desktop**: 96px section padding

### Border Radius
- **Small**: 12px
- **Medium**: 18px
- **Large**: 24px

## ✏️ How to Edit Content

### 1. Update Text Content
Open `index.html` and search for the section you want to edit. Each section is clearly commented:

```html
<!-- ======================================== -->
<!--      SECTION NAME                      -->
<!-- ======================================== -->
```

### 2. Change Colors
Edit CSS custom properties in `assets/css/style.css`:

```css
:root {
  --primary: #0b3a66;    /* Change brand color here */
  --bg: #f6f8fc;         /* Change background */
  /* ... */
}
```

### 3. Update Images
Replace image files in the `assets/` folder with the same filenames, or update the `src` attributes in `index.html`.

### 4. Modify Form
- **Add/Remove Fields**: Edit the form grid in `index.html`
- **Change Validation**: Update `validateField()` function in `assets/js/main.js`
- **Update Endpoint**: Change `FORM_ENDPOINT` constant in `assets/js/main.js`

### 5. Add/Remove Services
Edit the `.services-grid` section in `index.html`. Each service card follows this structure:

```html
<article class="service-card reveal">
  <div class="service-image">
    <img src="assets/service-NAME.jpg" alt="Service Name">
    <div class="service-icon">
      <!-- SVG icon here -->
    </div>
  </div>
  <div class="service-content">
    <h3 class="service-title">Service Name</h3>
    <p class="service-benefit">Short benefit headline</p>
    <p class="service-description">Description text</p>
    <a href="#apply" class="service-link">Get Started</a>
  </div>
</article>
```

### 6. Customize FAQ
Add/edit FAQ items in the `#faq` section of `index.html`:

```html
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span>Your question here?</span>
    <svg class="faq-icon"><!-- icon --></svg>
  </button>
  <div class="faq-answer">
    <p>Your answer here.</p>
  </div>
</div>
```

## 🚀 Deployment

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Deploy automatically

### Option 2: Netlify
1. Drag and drop the folder to [netlify.com](https://netlify.com)
2. Or connect GitHub repository

### Option 3: Any Web Host
Upload all files to your web server via FTP. Make sure:
- `index.html` is in the root directory
- `assets/` folder structure is preserved
- Images are accessible

## 📧 Form Setup (Formspree)

1. Go to [formspree.io](https://formspree.io) and sign up
2. Create a new form
3. Copy your form ID (looks like `xyzabc123`)
4. Update in `assets/js/main.js`:
   ```javascript
   const FORM_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';
   ```
5. Redeploy your site

## 🎨 Customization Tips

### Change Animations
To disable animations, add this to your CSS:
```css
* {
  animation: none !important;
  transition: none !important;
}
```

### Adjust Scroll Reveal
In `assets/js/main.js`, modify the IntersectionObserver options:
```javascript
const revealObserver = new IntersectionObserver((entries) => {
  // ...
}, {
  threshold: 0.15,          // When to trigger (0-1)
  rootMargin: '0px 0px -50px 0px'  // Offset
});
```

### Change Hero Background
Replace `assets/hero-1.jpg` or update in HTML:
```html
<img src="assets/YOUR-IMAGE.jpg" alt="..." class="hero-image">
```

## 🔧 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari 12+, Chrome Android 90+

## 📱 Accessibility Features

- Semantic HTML5 elements
- ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Screen reader friendly
- `prefers-reduced-motion` support
- Sufficient color contrast
- Alt text on all images

## 🐛 Troubleshooting

### Form not submitting?
1. Check console for errors (F12)
2. Verify `FORM_ENDPOINT` in `main.js`
3. Ensure Formspree form is activated
4. Check network tab for failed requests

### Animations not working?
1. Make sure JavaScript is enabled
2. Check browser console for errors
3. Verify `main.js` is loaded correctly
4. Check if `prefers-reduced-motion` is enabled in OS

### Images not loading?
1. Verify image files exist in `assets/` folder
2. Check file names match exactly (case-sensitive)
3. Look for 404 errors in browser console

## 📞 Support

For technical issues or questions:
- Email: Khan@ajkinsurancebrokersllc.com
- Phone: +1 (845) 662-8071

## 📄 License

© 2026 AJK Insurance Brokers LLC. All rights reserved.

---

**Last Updated**: February 26, 2026
**Version**: 2.0.0 (Premium Redesign)
