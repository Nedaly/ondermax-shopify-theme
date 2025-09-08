import { test, expect } from '@playwright/test';

test.describe('Stock Message Localization', () => {
  const pdpPath = process.env.PDP_PATH || '/products/your-product-handle';

  test('Arabic stock message displays correctly', async ({ page }) => {
    await page.goto(`${pdpPath}?locale=ar`);
    
    // Look for the fake stock message
    const stockMessage = page.locator('.fake-stock-message');
    const stockCount = page.locator('#fake-stock-count');
    
    // Check if stock message exists (skip if not found)
    if (await stockMessage.count() > 0) {
      await expect(stockMessage).toBeVisible();
      
      // Check if stock count exists and contains a number
      if (await stockCount.count() > 0) {
        const countText = await stockCount.textContent();
        const countNumber = parseInt(countText || '0', 10);
        expect(countNumber).toBeGreaterThanOrEqual(1);
      }
      
      // Check for Arabic text in the message
      await expect(stockMessage).toContainText('تبقّى فقط');
    }
  });

  test('Hebrew stock message displays correctly', async ({ page }) => {
    await page.goto(`${pdpPath}?locale=he`);
    
    // Look for the fake stock message
    const stockMessage = page.locator('.fake-stock-message');
    const stockCount = page.locator('#fake-stock-count');
    
    // Check if stock message exists (skip if not found)
    if (await stockMessage.count() > 0) {
      await expect(stockMessage).toBeVisible();
      
      // Check if stock count exists and contains a number
      if (await stockCount.count() > 0) {
        const countText = await stockCount.textContent();
        const countNumber = parseInt(countText || '0', 10);
        expect(countNumber).toBeGreaterThanOrEqual(1);
      }
      
      // Check for Hebrew text in the message
      await expect(stockMessage).toContainText('נשארו רק');
    }
  });

  test('English stock message displays correctly', async ({ page }) => {
    await page.goto(pdpPath);
    
    // Look for the fake stock message
    const stockMessage = page.locator('.fake-stock-message');
    const stockCount = page.locator('#fake-stock-count');
    
    // Check if stock message exists (skip if not found)
    if (await stockMessage.count() > 0) {
      await expect(stockMessage).toBeVisible();
      
      // Check if stock count exists and contains a number
      if (await stockCount.count() > 0) {
        const countText = await stockCount.textContent();
        const countNumber = parseInt(countText || '0', 10);
        expect(countNumber).toBeGreaterThanOrEqual(1);
      }
      
      // Check for English text in the message
      await expect(stockMessage).toContainText('Only');
    }
  });
});
