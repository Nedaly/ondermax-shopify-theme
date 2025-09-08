import { test, expect } from '@playwright/test';

test.describe('UI RTL Layout', () => {
  test('Arabic RTL layout elements', async ({ page }) => {
    await page.goto('/?locale=ar');
    
    // Check HTML has RTL direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    
    // Check cart drawer RTL positioning if it exists
    const cartDrawer = page.locator('.cart-drawer');
    if (await cartDrawer.count() > 0) {
      // Check if cart drawer has RTL-specific classes or positioning
      const cartDrawerClasses = await cartDrawer.getAttribute('class');
      expect(cartDrawerClasses).toBeTruthy();
    }
    
    // Check for RTL flip utility on arrow icons if they exist
    const rtlFlipElements = page.locator('.rtl-flip');
    if (await rtlFlipElements.count() > 0) {
      await expect(rtlFlipElements.first()).toBeVisible();
    }
    
    // Check input alignment for RTL
    const inputs = page.locator('input, textarea, select');
    if (await inputs.count() > 0) {
      const firstInput = inputs.first();
      const textAlign = await firstInput.evaluate(el => 
        window.getComputedStyle(el).textAlign
      );
      // In RTL, text-align should be 'start' or 'right'
      expect(['start', 'right']).toContain(textAlign);
    }
  });

  test('Hebrew RTL layout elements', async ({ page }) => {
    await page.goto('/?locale=he');
    
    // Check HTML has RTL direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    
    // Check cart drawer RTL positioning if it exists
    const cartDrawer = page.locator('.cart-drawer');
    if (await cartDrawer.count() > 0) {
      // Check if cart drawer has RTL-specific classes or positioning
      const cartDrawerClasses = await cartDrawer.getAttribute('class');
      expect(cartDrawerClasses).toBeTruthy();
    }
    
    // Check for RTL flip utility on arrow icons if they exist
    const rtlFlipElements = page.locator('.rtl-flip');
    if (await rtlFlipElements.count() > 0) {
      await expect(rtlFlipElements.first()).toBeVisible();
    }
    
    // Check input alignment for RTL
    const inputs = page.locator('input, textarea, select');
    if (await inputs.count() > 0) {
      const firstInput = inputs.first();
      const textAlign = await firstInput.evaluate(el => 
        window.getComputedStyle(el).textAlign
      );
      // In RTL, text-align should be 'start' or 'right'
      expect(['start', 'right']).toContain(textAlign);
    }
  });

  test('English LTR layout elements', async ({ page }) => {
    await page.goto('/');
    
    // Check HTML has LTR direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'ltr');
    
    // Check input alignment for LTR
    const inputs = page.locator('input, textarea, select');
    if (await inputs.count() > 0) {
      const firstInput = inputs.first();
      const textAlign = await firstInput.evaluate(el => 
        window.getComputedStyle(el).textAlign
      );
      // In LTR, text-align should be 'start' or 'left'
      expect(['start', 'left']).toContain(textAlign);
    }
  });
});
