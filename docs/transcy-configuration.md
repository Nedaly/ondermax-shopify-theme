# Transcy Configuration Guide for Ondermax Hotfix

## Overview
This document provides the configuration steps for Transcy to ensure proper translation management and brand term protection for the Ondermax Shopify theme.

## Transcy Configuration Steps

### 1. Exclusion Rules

#### Elements to Exclude from Translation
Configure Transcy to exclude the following elements:

```css
/* CSS Selectors for Exclusion */
[data-i18n-lock]
meta[name="shrine-auth"]
.notranslate
.translate-no
```

#### Specific Elements to Exclude
- `meta[name="shrine-auth"]` - Shrine authentication token
- Any element with `data-i18n-lock` attribute
- Any element with `notranslate` class
- Any element with `translate="no"` attribute

### 2. Brand Glossary Configuration

#### Keep As-Is (Never Translate)
Add these terms to the Transcy glossary with "Keep Original" setting:

```
Ondermax
SURGE
DRIFT
NAD+
Creatine
B-Vitamins
Glutathione
TIC-003
Shrine
Transcy
```

#### Mapped Translations
Configure these terms with specific translations:

| English | Arabic | Hebrew |
|---------|--------|--------|
| Day Patch | لصقة النهار | מדבקת יום |
| Night Patch | لصقة الليل | מדבקת לילה |
| All-Day Energy | طاقة طوال اليوم | אנרגיה לכל היום |
| Science Backed Energy | طاقة مدعومة بالعلم | אנרגיה מבוססת מדע |
| Doctor Developed | مطوّر من قبل طبيب | פותח על ידי רופא |
| Backed by Science | مدعوم بالعلم | מבוסס על מדע |
| High Energy | طاقة عالية | אנרגיה גבוהה |
| Free Worldwide Shipping | شحن مجاني عالمي | משלוח חינם עולמי |
| Join 10,000+ Professionals Who Choose SURGE | انضم إلى 10,000+ محترف يثقون بـ SURGE | הצטרפו ל-10,000+ מקצוענים שבוחרים ב-SURGE |
| SURGE Energy Patches: Your Questions Answered | لصقات طاقة SURGE: إجابات على أسئلتك | מדבקות האנרגיה SURGE: שאלות ותשובות |
| Get SURGE Now | اطلب SURGE الآن | להזמין SURGE עכשיו |

### 3. Theme Sync Configuration

#### Steps to Sync Themes
1. **Access Transcy Dashboard**
   - Go to Transcy → Themes
   - Select the Ondermax theme

2. **Clear Translation Cache**
   - Click "Clear Cache" to remove outdated translations
   - This will show "Translation outdated" status

3. **Sync with Theme**
   - Click "Sync" to update translations with latest theme changes
   - Wait for sync to complete

4. **Publish Translations**
   - Review all translations
   - Click "Publish" to make translations live
   - Verify status shows "Translated"

### 4. RTL Language Support

#### Arabic (ar) Configuration
- Enable RTL support
- Set text direction to right-to-left
- Configure font fallbacks for Arabic text

#### Hebrew (he) Configuration
- Enable RTL support
- Set text direction to right-to-left
- Configure font fallbacks for Hebrew text

### 5. Quality Assurance

#### Pre-Publish Checklist
- [ ] All brand terms protected from translation
- [ ] Shrine token excluded from translation
- [ ] RTL languages display correctly
- [ ] All hardcoded text replaced with locale keys
- [ ] Theme sync completed successfully
- [ ] Translation status shows "Translated"

#### Post-Publish Testing
- [ ] Test Arabic site (`/ar`) for proper RTL display
- [ ] Test Hebrew site (`/he`) for proper RTL display
- [ ] Verify brand names remain in English
- [ ] Check Shrine token integrity
- [ ] Test checkout flow in all languages
- [ ] Verify all translations display correctly

### 6. Monitoring and Maintenance

#### Regular Checks
- Monitor translation status in Transcy dashboard
- Check for any new hardcoded text that needs localization
- Verify brand term protection remains active
- Test RTL language functionality

#### Troubleshooting
- If translations show as "outdated", re-sync with theme
- If brand terms are being translated, check exclusion rules
- If RTL display is broken, verify CSS RTL utilities
- If Shrine token is missing, check meta tag protection

## Implementation Notes

### HTML Attributes for Protection
```html
<!-- Protect from translation -->
<meta name="shrine-auth" content="..." class="notranslate" data-i18n-lock translate="no">

<!-- Brand terms -->
<span class="notranslate" data-i18n-lock>SURGE</span>
<span class="notranslate" data-i18n-lock>DRIFT</span>
```

### CSS for RTL Support
```css
/* RTL utilities already added to base.css */
html[dir="rtl"] body { direction: rtl; }
html[dir="rtl"] .text-start { text-align: right; }
html[dir="rtl"] .text-end { text-align: left; }
html[dir="rtl"] .ml-auto { margin-left: 0; margin-right: auto; }
html[dir="rtl"] .mr-auto { margin-right: 0; margin-left: auto; }
```

## Last Updated
September 20, 2025 - Hotfix Implementation
