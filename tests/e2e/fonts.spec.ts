import { test, expect } from '@playwright/test';

test.describe('Font Loading Tests', () => {
  test('Arabic page loads Arabic font', async ({ page }) => {
    const fontRequests: string[] = [];
    
    // Capture network requests for font files
    page.on('request', request => {
      if (request.url().includes('.woff2')) {
        fontRequests.push(request.url());
      }
    });

    await page.goto('/?locale=ar');
    
    // Wait for page to load and fonts to be requested
    await page.waitForLoadState('networkidle');
    
    // Check that Arabic font was requested
    const arabicFontRequested = fontRequests.some(url => 
      url.includes('ibm-plex-sans-arabic-400.woff2')
    );
    
    expect(arabicFontRequested).toBe(true);
  });

  test('Hebrew page loads Hebrew font', async ({ page }) => {
    const fontRequests: string[] = [];
    
    // Capture network requests for font files
    page.on('request', request => {
      if (request.url().includes('.woff2')) {
        fontRequests.push(request.url());
      }
    });

    await page.goto('/?locale=he');
    
    // Wait for page to load and fonts to be requested
    await page.waitForLoadState('networkidle');
    
    // Check that Hebrew font was requested
    const hebrewFontRequested = fontRequests.some(url => 
      url.includes('heebo-400.woff2')
    );
    
    expect(hebrewFontRequested).toBe(true);
  });

  test('English page does NOT load AR/HE fonts', async ({ page }) => {
    const fontRequests: string[] = [];
    
    // Capture network requests for font files
    page.on('request', request => {
      if (request.url().includes('.woff2')) {
        fontRequests.push(request.url());
      }
    });

    await page.goto('/');
    
    // Wait for page to load and fonts to be requested
    await page.waitForLoadState('networkidle');
    
    // Check that no Arabic or Hebrew fonts were requested
    const arabicHebrewFontsRequested = fontRequests.some(url => 
      /(ibm-plex-sans-arabic|heebo)-\d+\.woff2/.test(url)
    );
    
    expect(arabicHebrewFontsRequested).toBe(false);
  });
});
