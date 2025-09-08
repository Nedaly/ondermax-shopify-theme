# I18N RTL QA Checklist (Arabic & Hebrew)

- HTML attributes:
  - Arabic pages: <html lang="ar" dir="rtl">
  - Hebrew pages: <html lang="he" dir="rtl">
- No JS flicker:
  - Disable JavaScript in DevTools; /ar and /he still render localized content.
- UI sanity:
  - Breadcrumbs, arrows/chevrons, carousels, cart drawer all correct in RTL.
  - Inputs, placeholders align start in RTL.
- Stock message:
  - Dynamic count renders via `fake_stock_message_html` in each language.
- SEO:
  - Hreflang tags present.
  - Localized slugs where configured.
- Performance:
  - `rtl.css` preloaded only for ar/he; lang CSS loaded conditionally.
