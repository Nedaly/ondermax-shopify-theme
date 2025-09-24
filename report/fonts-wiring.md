# Fonts Wiring Report

## Detected Font Files

### Arabic (IBM Plex Sans Arabic)
- **400 weight**: `ibm-plex-sans-arabic-400.woff2` ✅
- **600 weight**: `ibm-plex-sans-arabic-600.woff2` ✅

### Hebrew (Heebo)
- **400 weight**: `heebo-400.woff2` ✅
- **600 weight**: `heebo-600.woff2` ✅

## Final @font-face Blocks

### Arabic (assets/lang-ar.css)
```css
@font-face {
  font-family: 'PlexArabic';
  src: url('{{ "ibm-plex-sans-arabic-400.woff2" | asset_url }}') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'PlexArabic';
  src: url('{{ "ibm-plex-sans-arabic-600.woff2" | asset_url }}') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

### Hebrew (assets/lang-he.css)
```css
@font-face {
  font-family: 'HeeboLocal';
  src: url('{{ "heebo-400.woff2" | asset_url }}') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'HeeboLocal';
  src: url('{{ "heebo-600.woff2" | asset_url }}') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
```

## Head Includes Status

✅ **Present** in `layout/theme.liquid`:

```liquid
{% if request.locale.iso_code contains 'ar' %}
  {{ 'lang-ar.css' | asset_url | stylesheet_tag }}
{% endif %}
{% if request.locale.iso_code contains 'he' %}
  {{ 'lang-he.css' | asset_url | stylesheet_tag }}
{% endif %}
{% if request.locale.iso_code contains 'ar' or request.locale.iso_code contains 'he' %}
  {{ 'rtl.css' | asset_url | stylesheet_tag }}
{% endif %}
```

## Browser Test Commands

### Arabic Font Test
```js
// On /ar
Promise.all([document.fonts.ready, document.fonts.check('1em PlexArabic')]).then(r=>console.log('PlexArabic loaded?', r[1]))
```

### Hebrew Font Test
```js
// On /he
Promise.all([document.fonts.ready, document.fonts.check('1em HeeboLocal')]).then(r=>console.log('HeeboLocal loaded?', r[1]))
```

## Status: ✅ COMPLETE

All font files are present and properly wired. The theme is ready for Arabic and Hebrew font rendering.
