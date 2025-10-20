import { test, expect, devices } from '@playwright/test';

// Mobile device configurations for testing
const mobileDevices = [
  { ...devices['iPhone 13'], name: 'iPhone 13' },
  { ...devices['Pixel 5'], name: 'Pixel 5' },
  { ...devices['iPad'], name: 'iPad' },
  { ...devices['Galaxy S9+'], name: 'Galaxy S9+' }
];

// Desktop device for comparison
const desktopDevice = { ...devices['Desktop Chrome'], name: 'Desktop Chrome' };

test.describe('Mobile PDF Viewer UX Improvements', () => {
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

  test.describe('Mobile-specific tests', () => {
    mobileDevices.forEach(device => {
      test(`Vertical spacing is reduced on ${device.name}`, async ({ page }) => {
        // Set viewport to mobile device dimensions
        await page.setViewportSize(device.viewport);
        
        // Get the computed styles for the PDF viewer
        const pdfViewer = page.locator('.monochrome-pdf-viewer');
        const gap = await pdfViewer.evaluate(el => 
          window.getComputedStyle(el).gap
        );
        
        // Verify gap is reduced on mobile (should be 0.75rem)
        expect(gap).toBe('0.75rem');
        
        // Get the computed padding for the PDF viewer
        const padding = await pdfViewer.evaluate(el => 
          window.getComputedStyle(el).padding
        );
        
        // Verify padding is reduced on mobile
        // Mobile padding should be clamp(0.75rem, 4vw, 1.25rem)
        // We'll check that it's less than the desktop value
        const paddingValue = parseFloat(padding);
        expect(paddingValue).toBeLessThan(20); // Less than 20px (desktop minimum)
      });

      test(`Navigation controls are visible concurrently with PDF content on ${device.name}`, async ({ page }) => {
        // Set viewport to mobile device dimensions
        await page.setViewportSize(device.viewport);
        
        // Get the bounding boxes of navigation controls and PDF container
        const controls = page.locator('.monochrome-pdf-controls');
        const container = page.locator('.monochrome-pdf-container');
        
        const controlsBox = await controls.boundingBox();
        const containerBox = await container.boundingBox();
        
        // Verify both elements are visible
        expect(controlsBox).toBeTruthy();
        expect(containerBox).toBeTruthy();
        
        // Verify there's minimal overlap between controls and container
        // The controls should be above the container with reduced gap
        if (controlsBox && containerBox) {
          expect(controlsBox.y + controlsBox.height).toBeLessThan(containerBox.y);
          
          // Verify the gap between controls and container is reduced
          const gap = containerBox.y - (controlsBox.y + controlsBox.height);
          expect(gap).toBeLessThan(50); // Gap should be less than 50px
        }
      });

      test(`Page navigation functionality works correctly on ${device.name}`, async ({ page }) => {
        // Set viewport to mobile device dimensions
        await page.setViewportSize(device.viewport);
        
        // Wait for PDF to load
        await page.waitForSelector('.monochrome-pdf-sheet', { timeout: 15000 });
        
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
          await page.waitForTimeout(500);
          
          // Verify page number increased
          const newPageText = await pageIndicator.textContent();
          const newPageNumber = parseInt(newPageText?.match(/\d+/)?.[0] || '1');
          expect(newPageNumber).toBeGreaterThan(initialPageNumber);
          
          // Test previous button functionality
          const prevButton = page.locator('button[aria-label="Vorige pagina"]');
          await prevButton.click();
          
          // Wait for page to change
          await page.waitForTimeout(500);
          
          // Verify page number decreased back
          const finalPageText = await pageIndicator.textContent();
          const finalPageNumber = parseInt(finalPageText?.match(/\d+/)?.[0] || '1');
          expect(finalPageNumber).toBe(initialPageNumber);
        }
      });

      test(`Mobile layout optimizations are applied on ${device.name}`, async ({ page }) => {
        // Set viewport to mobile device dimensions
        await page.setViewportSize(device.viewport);
        
        // Check that mobile-specific styles are applied
        const controls = page.locator('.monochrome-pdf-controls');
        const controlsFlexDirection = await controls.evaluate(el => 
          window.getComputedStyle(el).flexDirection
        );
        
        // On mobile, controls should be in a column layout
        expect(controlsFlexDirection).toBe('column');
        
        // Check that buttons are full width on mobile
        const buttons = page.locator('.monochrome-pdf-button');
        const buttonWidth = await buttons.first().evaluate(el => 
          window.getComputedStyle(el).width
        );
        
        // On mobile, buttons should be full width
        expect(buttonWidth).toBe('100%');
        
        // Check that page indicator is centered and ordered first
        const pageIndicator = page.locator('.monochrome-pdf-indicator');
        const indicatorOrder = await pageIndicator.evaluate(el => 
          window.getComputedStyle(el).order
        );
        
        // On mobile, page indicator should be ordered first (order: -1)
        expect(indicatorOrder).toBe('-1');
      });
    });
  });

  test('Responsive design switching works correctly', async ({ page }) => {
    // Start with desktop view
    await page.setViewportSize(desktopDevice.viewport);
    
    // Check desktop layout
    const controls = page.locator('.monochrome-pdf-controls');
    const controlsFlexDirectionDesktop = await controls.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    );
    expect(controlsFlexDirectionDesktop).toBe('row');
    
    // Switch to mobile view
    await page.setViewportSize(mobileDevices[0].viewport);
    
    // Wait for layout to adjust
    await page.waitForTimeout(300);
    
    // Check mobile layout
    const controlsFlexDirectionMobile = await controls.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    );
    expect(controlsFlexDirectionMobile).toBe('column');
    
    // Switch back to desktop view
    await page.setViewportSize(desktopDevice.viewport);
    
    // Wait for layout to adjust
    await page.waitForTimeout(300);
    
    // Verify desktop layout is restored
    const controlsFlexDirectionRestored = await controls.evaluate(el => 
      window.getComputedStyle(el).flexDirection
    );
    expect(controlsFlexDirectionRestored).toBe('row');
  });

  test('Touch interactions work correctly on mobile', async ({ page }) => {
    // Set viewport to mobile device dimensions
    await page.setViewportSize(mobileDevices[0].viewport);
    
    // Wait for PDF to load
    await page.waitForSelector('.monochrome-pdf-sheet', { timeout: 15000 });
    
    // Test touch-friendly button sizing
    const buttons = page.locator('.monochrome-pdf-button');
    const firstButton = buttons.first();
    
    // Check that buttons have sufficient touch target size
    const buttonBox = await firstButton.boundingBox();
    expect(buttonBox?.height).toBeGreaterThanOrEqual(48); // Minimum touch target size
    
    // Test button click functionality
    const pageIndicator = page.locator('.monochrome-pdf-indicator');
    const initialPageText = await pageIndicator.textContent();
    
    // Try to click the next button if it's enabled
    const nextButton = page.locator('button[aria-label="Volgende pagina"]');
    const isNextDisabled = await nextButton.isDisabled();
    
    if (!isNextDisabled) {
      await nextButton.tap();
      
      // Wait for page to change
      await page.waitForTimeout(500);
      
      // Verify page changed
      const newPageText = await pageIndicator.textContent();
      expect(newPageText).not.toBe(initialPageText);
    }
  });

  test('PDF viewer handles different screen sizes correctly', async ({ page }) => {
    // Test various mobile screen sizes
    const screenSizes = [
      { width: 375, height: 667 },  // iPhone SE
      { width: 390, height: 844 },  // iPhone 13
      { width: 414, height: 896 },  // iPhone 13 Pro Max
      { width: 768, height: 1024 }, // iPad
    ];
    
    for (const size of screenSizes) {
      await page.setViewportSize(size);
      
      // Wait for layout to adjust
      await page.waitForTimeout(300);
      
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