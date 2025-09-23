# QA Testing Checklist - Ondermax i18n Hotfix

## Overview
This checklist ensures all hotfix components are working correctly before production deployment.

## Pre-Deployment Testing

### 1. RTL Language Support Testing

#### Arabic (ar) Testing
- [ ] Navigate to `/ar` URL
- [ ] Verify page loads with RTL direction
- [ ] Check text alignment is right-to-left
- [ ] Verify navigation menu is right-aligned
- [ ] Test product cards display correctly
- [ ] Check form inputs are right-aligned
- [ ] Verify button positioning is correct

#### Hebrew (he) Testing
- [ ] Navigate to `/he` URL
- [ ] Verify page loads with RTL direction
- [ ] Check text alignment is right-to-left
- [ ] Verify navigation menu is right-aligned
- [ ] Test product cards display correctly
- [ ] Check form inputs are right-aligned
- [ ] Verify button positioning is correct

### 2. Translation Testing

#### Homepage Content
- [ ] "Science Backed Energy" displays as "طاقة مدعومة بالعلم" (AR) / "אנרגיה מבוססת מדע" (HE)
- [ ] "All-Day Energy" displays as "طاقة طوال اليوم" (AR) / "אנרגיה לכל היום" (HE)
- [ ] "Join 10,000+ Professionals Who Choose SURGE" displays correctly in AR/HE
- [ ] "SURGE Energy Patches: Your Questions Answered" displays correctly in AR/HE
- [ ] "Get SURGE Now" displays as "اطلب SURGE الآن" (AR) / "להזמין SURGE עכשיו" (HE)

#### Power Bar Section
- [ ] "High Energy" displays as "طاقة عالية" (AR) / "אנרגיה גבוהה" (HE)
- [ ] "Doctor Developed" displays as "مطوّر من قبل طبيب" (AR) / "פותח על ידי רופא" (HE)
- [ ] "Backed by Science" displays as "مدعوم بالعلم" (AR) / "מבוסס על מדע" (HE)
- [ ] "Free Worldwide Shipping" displays as "شحن مجاني عالمي" (AR) / "משלוח חינם עולמי" (HE)

### 3. Brand Term Protection Testing

#### Brand Names (Should Remain in English)
- [ ] "Ondermax" appears in English across all languages
- [ ] "SURGE" appears in English across all languages
- [ ] "DRIFT" appears in English across all languages
- [ ] "NAD+" appears in English across all languages
- [ ] "Creatine" appears in English across all languages
- [ ] "B-Vitamins" appears in English across all languages
- [ ] "Glutathione" appears in English across all languages

### 4. Shrine Token Integrity Testing

#### Token Protection
- [ ] Check browser developer tools for `meta[name="shrine-auth"]` tag
- [ ] Verify token content is present and not translated
- [ ] Confirm token has `class="notranslate"` attribute
- [ ] Verify token has `data-i18n-lock` attribute
- [ ] Confirm token has `translate="no"` attribute

#### JavaScript Verification
```javascript
// Run in browser console to verify token
const shrineToken = document.querySelector('meta[name="shrine-auth"]');
console.log('Shrine token exists:', !!shrineToken);
console.log('Token content:', shrineToken?.content);
console.log('Has notranslate class:', shrineToken?.classList.contains('notranslate'));
console.log('Has i18n-lock data:', shrineToken?.hasAttribute('data-i18n-lock'));
console.log('Has translate=no:', shrineToken?.getAttribute('translate') === 'no');
```

### 5. Transcy Integration Testing

#### Dashboard Status
- [ ] Transcy → Themes shows "Translated" status (not "Translation outdated")
- [ ] All exclusion rules are configured
- [ ] Brand glossary is properly set up
- [ ] RTL language support is enabled

#### Live Site Verification
- [ ] Arabic site loads without translation errors
- [ ] Hebrew site loads without translation errors
- [ ] No broken translations or missing text
- [ ] All dynamic content translates correctly

### 6. Checkout Flow Testing

#### Arabic Checkout
- [ ] Add product to cart in Arabic
- [ ] Proceed to checkout
- [ ] Verify all checkout text is in Arabic
- [ ] Test form validation messages in Arabic
- [ ] Complete test purchase (if possible)

#### Hebrew Checkout
- [ ] Add product to cart in Hebrew
- [ ] Proceed to checkout
- [ ] Verify all checkout text is in Hebrew
- [ ] Test form validation messages in Hebrew
- [ ] Complete test purchase (if possible)

### 7. Mobile Responsiveness Testing

#### Arabic Mobile
- [ ] Test on mobile device with Arabic language
- [ ] Verify RTL layout works on small screens
- [ ] Check navigation menu functionality
- [ ] Test product page layout
- [ ] Verify checkout flow on mobile

#### Hebrew Mobile
- [ ] Test on mobile device with Hebrew language
- [ ] Verify RTL layout works on small screens
- [ ] Check navigation menu functionality
- [ ] Test product page layout
- [ ] Verify checkout flow on mobile

### 8. Performance Testing

#### Page Load Times
- [ ] English homepage loads within 3 seconds
- [ ] Arabic homepage loads within 3 seconds
- [ ] Hebrew homepage loads within 3 seconds
- [ ] No JavaScript errors in console
- [ ] All CSS files load correctly

#### Lighthouse Scores
- [ ] Performance score > 90
- [ ] Accessibility score > 95
- [ ] Best Practices score > 90
- [ ] SEO score > 95

### 9. Cross-Browser Testing

#### Desktop Browsers
- [ ] Chrome (latest) - English, Arabic, Hebrew
- [ ] Firefox (latest) - English, Arabic, Hebrew
- [ ] Safari (latest) - English, Arabic, Hebrew
- [ ] Edge (latest) - English, Arabic, Hebrew

#### Mobile Browsers
- [ ] Chrome Mobile - English, Arabic, Hebrew
- [ ] Safari Mobile - English, Arabic, Hebrew
- [ ] Samsung Internet - English, Arabic, Hebrew

### 10. Error Handling Testing

#### Network Issues
- [ ] Test with slow network connection
- [ ] Verify graceful degradation
- [ ] Check error messages are translated
- [ ] Test offline functionality

#### Invalid Data
- [ ] Test with invalid form inputs
- [ ] Verify error messages display correctly
- [ ] Check validation in all languages

## Post-Deployment Verification

### 1. Live Site Monitoring
- [ ] Monitor error logs for 24 hours
- [ ] Check analytics for any traffic drops
- [ ] Verify all language switchers work
- [ ] Test customer feedback forms

### 2. Rollback Preparation
- [ ] Keep previous theme version ready
- [ ] Document rollback procedure
- [ ] Test rollback process
- [ ] Prepare rollback communication

## Testing Tools

### Browser Developer Tools
- Console for JavaScript errors
- Network tab for resource loading
- Elements tab for HTML structure
- Application tab for local storage

### Translation Testing
- Transcy dashboard for status monitoring
- Browser language switching
- URL parameter testing (`?locale=ar`, `?locale=he`)

### Performance Testing
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Chrome DevTools Lighthouse

## Sign-off Checklist

- [ ] All RTL languages display correctly
- [ ] All translations are accurate and complete
- [ ] Brand terms are protected from translation
- [ ] Shrine token is secure and functional
- [ ] Transcy integration is working properly
- [ ] Checkout flow works in all languages
- [ ] Mobile responsiveness is maintained
- [ ] Performance metrics meet standards
- [ ] Cross-browser compatibility confirmed
- [ ] Error handling is robust
- [ ] Rollback plan is ready

## Test Results Documentation

### Test Environment
- **Date**: ___________
- **Tester**: ___________
- **Browser**: ___________
- **Device**: ___________
- **Network**: ___________

### Issues Found
| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
|       |          |        |       |
|       |          |        |       |
|       |          |        |       |

### Sign-off
- [ ] **QA Lead**: ___________
- [ ] **Developer**: ___________
- [ ] **Product Owner**: ___________

## Last Updated
September 20, 2025 - Hotfix Implementation
