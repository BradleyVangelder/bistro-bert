import { test, expect } from '@playwright/test';

test.describe('Mobile PDF Viewer UX Improvements - Simplified Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the menu page
    await page.goto('/menu');
    
    // Wait for the PDF viewer to load
    await page.waitForSelector('.monochrome-pdf-viewer', { timeout: 10000 });
  });

  test('Component renders without errors', async ({ page }) => {
    // Check that the PDF viewer container is present
    const pdfViewer = page.locator('.monochrome-pdf-viewer');
    await expect(pdfViewer).toBeVisible();
    
    // Check that navigation controls are present
    const controls = page.locator('.monochrome-pdf-controls');
    await expect(controls).toBeVisible();
    
    // Check that the PDF container is present
    const container = page.locator('.monochrome-pdf-container');
    await expect(container).toBeVisible();
    
    // Check that previous and next buttons are present
    const prevButton = page.locator('button[aria-label="Vorige pagina"]');
    const nextButton = page.locator('button[aria-label="Volgende pagina"]');
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Check that page indicator is present
    const pageIndicator = page.locator('.monochrome-pdf-indicator');
    await expect(pageIndicator).toBeVisible();
  });

  test('High contrast button is completely removed', async ({ page }) => {
    // Check that no high contrast toggle button exists
    const highContrastToggle = page.locator('.high-contrast-toggle');
    await expect(highContrastToggle).toHaveCount(0);
    
    // Check that no high contrast overlay exists
    const highContrastOverlay = page.locator('.high-contrast-overlay');
    await expect(highContrastOverlay).toHaveCount(0);
    
    // Verify no element with high contrast related text exists
    const highContrastText = page.locator('text=/high contrast/i');
    await expect(highContrastText).toHaveCount(0);
  });

  test('Mobile layout is applied correctly', async ({ page }) => {
    // Set viewport to mobile dimensions
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13 dimensions
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);
    
    // Check that mobile-specific styles are applied by checking the computed styles
    const pdfViewer = page.locator('.monochrome-pdf-viewer');
    
    // Get the computed gap value
    const gap = await pdfViewer.evaluate(el => 
      window.getComputedStyle(el).gap
    );
    
    // Verify gap is reduced on mobile (should be approximately 12px which equals 0.75rem)
    expect(gap).toBe('12px');
    
    // Get the computed padding value
    const padding = await pdfViewer.evaluate(el => 
      window.getComputedStyle(el).padding
    );
    
    // Verify padding is in the expected range for mobile
    // Mobile padding should be clamp(0.75rem, 4vw, 1.25rem)
    // For 390px width, 4vw = 15.6px, so padding should be around 12-20px
    const paddingValue = parseFloat(padding);
    expect(paddingValue).toBeGreaterThanOrEqual(10);
    expect(paddingValue).toBeLessThanOrEqual(25);
  });

  test('Navigation controls are visible on mobile', async ({ page }) => {
    // Set viewport to mobile dimensions
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13 dimensions
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);
    
    // Check that navigation controls are visible
    const controls = page.locator('.monochrome-pdf-controls');
    await expect(controls).toBeVisible();
    
    // Check that buttons are visible
    const prevButton = page.locator('button[aria-label="Vorige pagina"]');
    const nextButton = page.locator('button[aria-label="Volgende pagina"]');
    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();
    
    // Check that page indicator is visible
    const pageIndicator = page.locator('.monochrome-pdf-indicator');
    await expect(pageIndicator).toBeVisible();
    
    // Check that PDF container is visible
    const container = page.locator('.monochrome-pdf-container');
    await expect(container).toBeVisible();
  });

  test('Page navigation functionality works correctly', async ({ page }) => {
    // Set viewport to mobile dimensions
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13 dimensions
    
    // Wait for PDF to load
    await page.waitForTimeout(2000);
    
    // Get initial page number
    const pageIndicator = page.locator('.monochrome-pdf-indicator');
    const initialPageText = await pageIndicator.textContent();
    const initialPageNumber = parseInt(initialPageText?.match(/\d+/)?.[0] || '1');
    
    // Test next button functionality
    const nextButton = page.locator('button[aria-label="Volgende pagina"]');
    
    // Check if next button is enabled (not on last page)
    const isNextDisabled = await nextButton.isDisabled();
    
    if (!isNextDisabled) {
      await nextButton.click();
      
      // Wait for page to change
      await page.waitForTimeout(1000);
      
      // Verify page number increased
      const newPageText = await pageIndicator.textContent();
      const newPageNumber = parseInt(newPageText?.match(/\d+/)?.[0] || '1');
      expect(newPageNumber).toBeGreaterThan(initialPageNumber);
      
      // Test previous button functionality
      const prevButton = page.locator('button[aria-label="Vorige pagina"]');
      await prevButton.click();
      
      // Wait for page to change
      await page.waitForTimeout(1000);
      
      // Verify page number decreased back
      const finalPageText = await pageIndicator.textContent();
      const finalPageNumber = parseInt(finalPageText?.match(/\d+/)?.[0] || '1');
      expect(finalPageNumber).toBe(initialPageNumber);
    }
  });

  test('Responsive design switching works correctly', async ({ page }) => {
    // Start with desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);
    
    // Check desktop layout - get the gap value
    const pdfViewer = page.locator('.monochrome-pdf-viewer');
    const desktopGap = await pdfViewer.evaluate(el => 
      window.getComputedStyle(el).gap
    );
    
    // Switch to mobile view
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Wait for layout to adjust
    await page.waitForTimeout(500);
    
    // Check mobile layout - get the gap value
    const mobileGap = await pdfViewer.evaluate(el => 
      window.getComputedStyle(el).gap
    );
    
    // Verify the gap values are different
    expect(desktopGap).not.toBe(mobileGap);
    
    // Verify mobile gap is smaller
    const desktopGapValue = parseFloat(desktopGap);
    const mobileGapValue = parseFloat(mobileGap);
    expect(mobileGapValue).toBeLessThan(desktopGapValue);
  });

  test('Touch interactions work correctly on mobile', async ({ page }) => {
    // Set viewport to mobile dimensions
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 13 dimensions
    
    // Wait for PDF to load
    await page.waitForTimeout(2000);
    
    // Test button click functionality
    const pageIndicator = page.locator('.monochrome-pdf-indicator');
    const initialPageText = await pageIndicator.textContent();
    
    // Try to click the next button if it's enabled
    const nextButton = page.locator('button[aria-label="Volgende pagina"]');
    const isNextDisabled = await nextButton.isDisabled();
    
    if (!isNextDisabled) {
      await nextButton.tap();
      
      // Wait for page to change
      await page.waitForTimeout(1000);
      
      // Verify page changed
      const newPageText = await pageIndicator.textContent();
      expect(newPageText).not.toBe(initialPageText);
    }
  });

  test('PDF viewer handles different mobile screen sizes correctly', async ({ page }) => {
    // Test various mobile screen sizes
    const screenSizes = [
      { width: 375, height: 667 },  // iPhone SE
      { width: 390, height: 844 },  // iPhone 13
      { width: 414, height: 896 },  // iPhone 13 Pro Max
    ];
    
    for (const size of screenSizes) {
      await page.setViewportSize(size);
      
      // Wait for layout to adjust
      await page.waitForTimeout(500);
      
      // Check that PDF viewer is responsive
      const pdfViewer = page.locator('.monochrome-pdf-viewer');
      await expect(pdfViewer).toBeVisible();
      
      // Check that controls are visible
      const controls = page.locator('.monochrome-pdf-controls');
      await expect(controls).toBeVisible();
      
      // Check that PDF container is visible
      const container = page.locator('.monochrome-pdf-container');
      await expect(container).toBeVisible();
      
      // Verify no horizontal overflow
      const bodyOverflow = await page.evaluate(() => 
        window.getComputedStyle(document.body).overflowX
      );
      expect(bodyOverflow).toBe('hidden');
    }
  });
});