import { test, expect } from '@playwright/test';

test.describe('I18N RTL Support', () => {
  test('Arabic locale renders correctly', async ({ page }) => {
    await page.goto('/?locale=ar');
    
    // Check HTML attributes
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveClass(/locale-ar/);
    
    // Check for Arabic content (CTA text)
    const body = page.locator('body');
    await expect(body).toContainText('تسوّق الآن'); // Arabic "Shop now"
  });

  test('Hebrew locale renders correctly', async ({ page }) => {
    await page.goto('/?locale=he');
    
    // Check HTML attributes
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'he');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveClass(/locale-he/);
    
    // Check for Hebrew content (CTA text)
    const body = page.locator('body');
    await expect(body).toContainText('לעגלה'); // Hebrew "To cart"
  });

  test('Arabic locale works without JavaScript', async ({ page }) => {
    test.skip(({ project }) => project.name !== 'nojs', 'Only for nojs project');
    
    await page.goto('/?locale=ar');
    
    // Check HTML attributes still work without JS
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'ar');
    await expect(html).toHaveAttribute('dir', 'rtl');
    
    // Check for Arabic content without JS
    const body = page.locator('body');
    await expect(body).toContainText(/تسوّق الآن|تسوق الآن/);
  });

  test('Hebrew locale works without JavaScript', async ({ page }) => {
    test.skip(({ project }) => project.name !== 'nojs', 'Only for nojs project');
    
    await page.goto('/?locale=he');
    
    // Check HTML attributes still work without JS
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'he');
    await expect(html).toHaveAttribute('dir', 'rtl');
    
    // Check for Hebrew content without JS
    const body = page.locator('body');
    await expect(body).toContainText(/לעגלה|לקנייה/);
  });
});
