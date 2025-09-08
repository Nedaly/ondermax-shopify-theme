# Testing Guide

This document explains how to run the automated test suite for the RTL/i18n feature.

## Prerequisites

- Node.js 20.x or later
- npm or yarn
- Shopify CLI
- A Shopify store for testing

## Local Testing

### 1. Setup Environment

1. Start your local development server:
   ```bash
   shopify theme dev --store yourstore.myshopify.com
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your development URL:
   ```
   BASE_URL=http://localhost:9292
   PDP_PATH=/products/your-product-handle
   ```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Tests

#### Locale Validation
```bash
npm run lint:locales
```

#### Theme Check
```bash
npm run test:theme
```

#### E2E Tests (with JavaScript)
```bash
npm run test:e2e
```

#### E2E Tests (without JavaScript)
```bash
npm run test:e2e:nojs
```

#### Lighthouse Performance Tests
```bash
npm run lighthouse
```

## Test Coverage

### I18N Tests (`tests/e2e/i18n.spec.ts`)
- ✅ Arabic locale HTML attributes (`lang="ar"`, `dir="rtl"`)
- ✅ Hebrew locale HTML attributes (`lang="he"`, `dir="rtl"`)
- ✅ Localized content rendering
- ✅ No-JS compatibility

### Stock Message Tests (`tests/e2e/stock-message.spec.ts`)
- ✅ Dynamic stock count rendering
- ✅ Arabic stock message translation
- ✅ Hebrew stock message translation
- ✅ English stock message fallback

### UI RTL Tests (`tests/e2e/ui-rtl.spec.ts`)
- ✅ RTL layout elements
- ✅ Input text alignment
- ✅ Cart drawer positioning
- ✅ RTL flip utility classes

### Locale Validation (`scripts/validate-locales.js`)
- ✅ Required translation keys exist
- ✅ JSON structure validation
- ✅ Non-empty translation values

### Lighthouse Performance
- ✅ Performance score ≥ 80
- ✅ Accessibility score ≥ 85
- ✅ Best practices score ≥ 85
- ✅ SEO score ≥ 85

## CI/CD Testing

### GitHub Actions Setup

1. Set the following secrets in your repository:
   - `SHOPIFY_STORE_DOMAIN`: Your Shopify store domain
   - `SHOPIFY_CLI_THEME_TOKEN`: Your Shopify CLI theme token
   - `PREVIEW_URL` (optional): Custom preview URL for testing

2. The CI workflow will:
   - Run on push/PR to `main` and `develop` branches
   - Validate locales and theme structure
   - Run E2E tests with and without JavaScript
   - Run Lighthouse performance tests
   - Upload test reports as artifacts

### Manual CI Trigger

You can also trigger the CI manually by pushing to the `main` or `develop` branches.

## Troubleshooting

### Common Issues

1. **"BASE_URL not set"**: Make sure your `.env` file has the correct `BASE_URL`
2. **"Product not found"**: Update `PDP_PATH` in `.env` to point to an existing product
3. **"Playwright browser not found"**: Run `npx playwright install --with-deps`
4. **"Theme check failed"**: Fix any Liquid syntax errors in your theme files
5. **"Shopify CLI not found"**: Run `npm i -g @shopify/cli @shopify/theme`

### Debug Mode

Run tests in headed mode for debugging:
```bash
npx playwright test --headed
```

### Test Reports

- Playwright reports: `playwright-report/index.html`
- Lighthouse results: `.lighthouseci/`

## Fonts (AR/HE) QA

### Manual Testing Checklist

1. **Network → Fonts Tab**:
   - Arabic pages (`/?locale=ar`): Should load `ibm-plex-sans-arabic-400.woff2` and `ibm-plex-sans-arabic-600.woff2` only
   - Hebrew pages (`/?locale=he`): Should load `heebo-400.woff2` and `heebo-600.woff2` only
   - English pages (`/`): Should NOT load any Arabic or Hebrew fonts

2. **Font Display**:
   - Confirm `font-display: swap` is in effect (no FOIT - Flash of Invisible Text)
   - Text should be visible immediately with fallback fonts, then swap to custom fonts when loaded

3. **Performance Impact**:
   - Lighthouse: Confirm minimal impact on English pages
   - Arabic/Hebrew pages should only download locale-specific fonts
   - No font downloads on English pages

4. **Preload Verification**:
   - View source on Arabic pages: Should see `<link rel="preload" as="font" href="...ibm-plex-sans-arabic-400.woff2"...>`
   - View source on Hebrew pages: Should see `<link rel="preload" as="font" href="...heebo-400.woff2"...>`
   - View source on English pages: Should NOT see Arabic/Hebrew font preloads

### Automated Font Tests

Run the font loading tests:
```bash
npx playwright test tests/e2e/fonts.spec.ts
```

## Adding New Tests

1. Create new test files in `tests/e2e/`
2. Follow the existing naming convention: `*.spec.ts`
3. Use TypeScript for better type safety
4. Make tests resilient (skip if selectors not found)
5. Update this documentation with new test coverage
