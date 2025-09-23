# Ondermax Brand Glossary for Translation

## Overview
This document defines the brand glossary rules for consistent translation across all languages (English, Arabic, Hebrew) in the Ondermax Shopify theme.

## Brand Terms - Keep As-Is (Never Translate)

### Company & Product Names
- **Ondermax** - Company name, always keep in English
- **SURGE** - Day energy patch product name
- **DRIFT** - Night sleep patch product name
- **NAD+** - Scientific compound name
- **Creatine** - Scientific compound name
- **B-Vitamins** - Scientific compound name
- **Glutathione** - Scientific compound name

### Technical Terms
- **TIC-003** - Error code identifier
- **Shrine** - Theme provider name
- **Transcy** - Translation service name

## Brand Terms - Translate (With Specific Mappings)

### Product Descriptions
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

### Marketing Copy
| English | Arabic | Hebrew |
|---------|--------|--------|
| Join 10,000+ Professionals Who Choose SURGE | انضم إلى 10,000+ محترف يثقون بـ SURGE | הצטרפו ל-10,000+ מקצוענים שבוחרים ב-SURGE |
| SURGE Energy Patches: Your Questions Answered | لصقات طاقة SURGE: إجابات على أسئلتك | מדבקות האנרגיה SURGE: שאלות ותשובות |
| Get SURGE Now | اطلب SURGE الآن | להזמין SURGE עכשיו |

## Translation Guidelines

### 1. Brand Name Protection
- Always preserve brand names (Ondermax, SURGE, DRIFT) in their original English form
- Never translate scientific compound names (NAD+, Creatine, B-Vitamins, Glutathione)
- Keep technical identifiers unchanged (TIC-003, Shrine, Transcy)

### 2. Context-Aware Translation
- Consider the context when translating product descriptions
- Maintain the marketing tone and energy of the original copy
- Ensure translations sound natural in the target language

### 3. RTL Language Considerations
- Arabic and Hebrew are right-to-left languages
- Ensure proper text alignment and layout adjustments
- Test all translations in RTL context

### 4. Transcy Integration
- Use `data-i18n-lock` attribute for brand terms that should never be translated
- Use `translate="no"` for technical identifiers
- Configure Transcy exclusion rules for protected terms

## Implementation Notes

### In Liquid Templates
```liquid
<!-- Brand names - never translate -->
<h1>{{ 'Ondermax' }}</h1>
<span class="notranslate" data-i18n-lock>SURGE</span>

<!-- Translatable content -->
<h2>{{ 'home.blocks.science' | t }}</h2>
<p>{{ 'power_bar.high_energy' | t }}</p>
```

### In CSS
```css
/* RTL support for brand elements */
html[dir="rtl"] .brand-name {
  text-align: right;
}
```

### In JavaScript
```javascript
// Protect brand terms from translation
const brandTerms = ['Ondermax', 'SURGE', 'DRIFT', 'NAD+'];
brandTerms.forEach(term => {
  const elements = document.querySelectorAll(`*:contains("${term}")`);
  elements.forEach(el => el.setAttribute('data-i18n-lock', 'true'));
});
```

## Quality Assurance Checklist

- [ ] All brand names preserved in English across all languages
- [ ] Scientific terms kept untranslated
- [ ] Product descriptions properly localized
- [ ] RTL languages display correctly
- [ ] Transcy exclusion rules configured
- [ ] Shrine token protected from translation
- [ ] All hardcoded English text replaced with locale keys

## Last Updated
September 20, 2025 - Hotfix Implementation
