import { test, expect } from '@playwright/test';

test.describe('PDF Pagination Bug Test', () => {
  test.beforeEach(async ({ page }) => {
    // Enable detailed console logging
    page.on('console', msg => {
      console.log(`[${msg.type()}] ${msg.text()}`);
    });

    // Monitor network requests
    page.on('request', request => {
      if (request.url().includes('menu.pdf') || request.url().includes('slide')) {
        console.log(`[REQUEST] ${request.method()} ${request.url()}`);
      }
    });

    page.on('response', response => {
      if (response.url().includes('menu.pdf') || response.url().includes('slide')) {
        console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
      }
    });
  });

  test('should reproduce pagination infinite loop bug', async ({ page }) => {
    // Navigate to the menu page
    await page.goto('/menu', { waitUntil: 'networkidle' });
    
    // Wait for the PDF viewer to load completely
    await page.waitForSelector('.monochrome-pdf-viewer', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ path: 'test-results/initial-state.png', fullPage: true });
    
    // Check the initial page number (should be page 1)
    const initialPageIndicator = await page.locator('text=/Pagina \\d+\\/\\d+/').first();
    await expect(initialPageIndicator).toBeVisible({ timeout: 10000 });
    
    const initialPageText = await initialPageIndicator.textContent();
    console.log(`Initial page text: ${initialPageText}`);
    expect(initialPageText).toContain('Pagina 1');
    
    // Check the initial URL parameters
    const initialUrl = page.url();
    console.log(`Initial URL: ${initialUrl}`);
    
    // Find the "volgende pagina" (next page) button
    const nextPageButton = page.locator('button:has-text("Volgende pagina")');
    await expect(nextPageButton).toBeVisible({ timeout: 10000 });
    
    // Check if the button is disabled (should be enabled if there are multiple pages)
    const isDisabled = await nextPageButton.isDisabled();
    console.log(`Next page button disabled: ${isDisabled}`);
    
    if (isDisabled) {
      console.log('Next page button is disabled, likely only one page in PDF. Test cannot proceed.');
      return;
    }
    
    // Track URL changes to detect infinite loops
    let urlChangeCount = 0;
    let lastPageNumber = 1;
    const pageChangeHistory: string[] = [];
    
    // Monitor URL changes by polling instead of using urlchanged event
    let lastUrl = page.url();
    const urlMonitor = setInterval(async () => {
      const currentUrl = page.url();
      if (currentUrl !== lastUrl) {
        urlChangeCount++;
        console.log(`URL change #${urlChangeCount}: ${currentUrl}`);
        pageChangeHistory.push(currentUrl);
        
        // Extract page number from URL
        const urlObj = new URL(currentUrl);
        const slideParam = urlObj.searchParams.get('slide');
        if (slideParam) {
          const currentPageNum = parseInt(slideParam);
          console.log(`Current page from URL: ${currentPageNum}`);
          
          // Check if we're stuck in a loop (going back to page 1 repeatedly)
          if (currentPageNum === 1 && lastPageNumber > 1) {
            console.error('BUG DETECTED: Page redirected back to page 1!');
          }
          lastPageNumber = currentPageNum;
        }
        lastUrl = currentUrl;
      }
    }, 100);
    
    // Clean up the monitor after test
    test.afterEach(() => {
      clearInterval(urlMonitor);
    });
    
    // Click the next page button and monitor behavior
    console.log('Clicking "Volgende pagina" button...');
    await nextPageButton.click();
    
    // Wait a moment for any potential redirects
    await page.waitForTimeout(1000);
    
    // Check the page indicator after first click
    const pageIndicatorAfterClick = await page.locator('text=/Pagina \\d+\\/\\d+/').first();
    const pageTextAfterClick = await pageIndicatorAfterClick.textContent();
    console.log(`Page text after first click: ${pageTextAfterClick}`);
    
    // Check URL after first click
    const urlAfterFirstClick = page.url();
    console.log(`URL after first click: ${urlAfterFirstClick}`);
    
    // Take screenshot after first click
    await page.screenshot({ path: 'test-results/after-first-click.png', fullPage: true });
    
    // Click next page multiple times to catch the infinite loop
    console.log('Testing multiple page clicks to detect infinite loop...');
    for (let i = 0; i < 5; i++) {
      // Check if next page button is still enabled
      const isStillEnabled = await nextPageButton.isEnabled();
      if (!isStillEnabled) {
        console.log(`Reached last page after ${i + 1} clicks`);
        break;
      }
      
      console.log(`Click #${i + 2} on next page button...`);
      await nextPageButton.click();
      
      // Wait for potential redirects
      await page.waitForTimeout(1000);
      
      // Check current page
      const currentPageText = await page.locator('text=/Pagina \\d+\\/\\d+/').first().textContent();
      console.log(`Page text after click #${i + 2}: ${currentPageText}`);
      
      // Check URL
      const currentUrl = page.url();
      console.log(`URL after click #${i + 2}: ${currentUrl}`);
      
      // Take screenshot every 2 clicks
      if ((i + 2) % 2 === 0) {
        await page.screenshot({ path: `test-results/after-click-${i + 2}.png`, fullPage: true });
      }
    }
    
    // Analyze the results
    console.log(`\n=== TEST RESULTS ===`);
    console.log(`Total URL changes: ${urlChangeCount}`);
    console.log(`Page change history:`, pageChangeHistory);
    
    // Check for signs of infinite loop
    const page1Occurrences = pageChangeHistory.filter(url => {
      const urlObj = new URL(url);
      const slideParam = urlObj.searchParams.get('slide');
      return slideParam === '1';
    }).length;
    
    console.log(`Times returned to page 1: ${page1Occurrences}`);
    
    // Final screenshot
    await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });
    
    // Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    if (consoleErrors.length > 0) {
      console.log(`Console errors detected: ${consoleErrors.length}`);
      consoleErrors.forEach(error => console.log(`  - ${error}`));
    }
    
    // Assert that we can advance pages properly (this will fail if the bug exists)
    if (page1Occurrences >= 2) {
      console.error('BUG REPRODUCED: Page keeps redirecting back to page 1');
    }
    expect(page1Occurrences).toBeLessThan(2);
  });

  test('should check URL parameter handling', async ({ page }) => {
    // Test direct navigation with slide parameter
    await page.goto('/menu?slide=2', { waitUntil: 'networkidle' });
    
    // Wait for PDF viewer to load
    await page.waitForSelector('.monochrome-pdf-viewer', { timeout: 15000 });
    await page.waitForLoadState('networkidle');
    
    // Check if we're on page 2
    const pageIndicator = await page.locator('text=/Pagina \\d+\\/\\d+/').first();
    await expect(pageIndicator).toBeVisible({ timeout: 10000 });
    
    const pageText = await pageIndicator.textContent();
    console.log(`Page text when navigating directly to slide=2: ${pageText}`);
    
    // Take screenshot
    await page.screenshot({ path: 'test-results/direct-navigation-slide2.png', fullPage: true });
    
    // Check current URL
    const currentUrl = page.url();
    console.log(`URL after direct navigation: ${currentUrl}`);
    
    // Try clicking next page from this state
    const nextPageButton = page.locator('button:has-text("Volgende pagina")');
    if (await nextPageButton.isEnabled()) {
      await nextPageButton.click();
      await page.waitForTimeout(1000);
      
      const urlAfterClick = page.url();
      console.log(`URL after clicking next from slide=2: ${urlAfterClick}`);
      
      await page.screenshot({ path: 'test-results/after-click-from-slide2.png', fullPage: true });
    }
  });

  test('should monitor component state changes', async ({ page }) => {
    // Navigate to menu page
    await page.goto('/menu', { waitUntil: 'networkidle' });
    
    // Wait for PDF viewer
    await page.waitForSelector('.monochrome-pdf-viewer', { timeout: 15000 });
    
    // Monitor component state through development panel if available
    const devPanel = page.locator('.fixed.bottom-4.left-4.bg-black\\/80.text-white');
    const isDevMode = await devPanel.isVisible();
    
    if (isDevMode) {
      console.log('Development panel detected, monitoring component state...');
      
      // Take initial state screenshot
      await page.screenshot({ path: 'test-results/dev-panel-initial.png' });
      
      // Click next page and monitor state changes
      const nextPageButton = page.locator('button:has-text("Volgende pagina")');
      if (await nextPageButton.isEnabled()) {
        await nextPageButton.click();
        await page.waitForTimeout(500);
        
        await page.screenshot({ path: 'test-results/dev-panel-after-click.png' });
        
        // Check for any error states or unusual behavior in the dev panel
        const devPanelText = await devPanel.textContent();
        console.log(`Development panel content: ${devPanelText}`);
      }
    } else {
      console.log('Development panel not visible, running in production mode');
    }
  });
});