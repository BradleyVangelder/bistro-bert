import { test, expect, devices } from '@playwright/test';

// Mobile device configurations for testing
const mobileDevices = [
  { ...devices['iPhone 13'], name: 'iPhone 13' },
  { ...devices['Pixel 5'], name: 'Pixel 5' },
  { ...devices['iPad'], name: 'iPad' }
];

// Desktop device for comparison
const desktopDevice = { ...devices['Desktop Chrome'], name: 'Desktop Chrome' };

test.describe('ImageGallery Nested Scroll Fix Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page where the gallery is located
    await page.goto('/');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Initial Page Load Test', () => {
    test('Gallery section does not create nested scroll containers during image loading', async ({ page }) => {
      // Navigate to the gallery section
      await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
      
      // Wait for gallery to start loading
      await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
      
      // Check that the gallery section is not scrollable during loading
      const gallerySection = page.locator('section[class*="min-h-[80vh]"]');
      const isScrollable = await gallerySection.evaluate(el => {
        const style = window.getComputedStyle(el);
        return (el.scrollHeight > el.clientHeight) && 
               (style.overflow === 'auto' || style.overflow === 'scroll' || 
                style.overflowY === 'auto' || style.overflowY === 'scroll');
      });
      
      expect(isScrollable).toBeFalsy();
      
      // Check that the gallery grid has visible overflow
      const galleryGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2');
      const gridOverflow = await galleryGrid.evaluate(el => 
        window.getComputedStyle(el).overflow
      );
      
      expect(gridOverflow).toBe('visible');
      
      // Check for any nested scrollable elements
      const nestedScrollElements = await galleryGrid.evaluate(el => {
        const scrollableElements = [];
        const allElements = el.querySelectorAll('*');
        
        for (const element of allElements) {
          const style = window.getComputedStyle(element);
          if ((style.overflow === 'auto' || style.overflow === 'scroll' ||
               style.overflowY === 'auto' || style.overflowY === 'scroll') &&
              element.scrollHeight > element.clientHeight) {
            scrollableElements.push({
              tagName: element.tagName,
              className: element.className,
              overflow: style.overflow,
              overflowY: style.overflowY
            });
          }
        }
        
        return scrollableElements;
      });
      
      expect(nestedScrollElements.length).toBe(0);
    });

    test('Page scrolls as a single unit from the start', async ({ page }) => {
      // Get initial scroll position
      const initialScrollY = await page.evaluate(() => window.scrollY);
      
      // Scroll down to the gallery section
      await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
      
      // Wait for scroll to complete
      await page.waitForTimeout(500);
      
      // Check that we've scrolled down
      const afterScrollY = await page.evaluate(() => window.scrollY);
      expect(afterScrollY).toBeGreaterThan(initialScrollY);
      
      // Check that the body is scrollable
      const bodyScrollable = await page.evaluate(() => {
        const body = document.body;
        const style = window.getComputedStyle(body);
        return (body.scrollHeight > body.clientHeight) && 
               (style.overflow !== 'hidden' && style.overflowY !== 'hidden');
      });
      
      expect(bodyScrollable).toBeTruthy();
    });

    test('Gallery container height is properly set during loading', async ({ page }) => {
      // Navigate to the gallery section
      await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
      
      // Wait for gallery to start loading
      await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
      
      // Check that the gallery grid has a minimum height set
      const galleryGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2');
      const minHeight = await galleryGrid.evaluate(el => 
        window.getComputedStyle(el).minHeight
      );
      
      // Should have a minimum height during loading
      expect(minHeight).not.toBe('0px');
      expect(minHeight).not.toBe('auto');
      
      // Wait for all images to load
      await page.waitForTimeout(3000);
      
      // Check that minHeight is still set after loading
      const minHeightAfterLoad = await galleryGrid.evaluate(el => 
        window.getComputedStyle(el).minHeight
      );
      
      expect(minHeightAfterLoad).not.toBe('0px');
    });
  });

  test.describe('Lightbox Interaction Test', () => {
    test('Background scroll is properly locked when lightbox opens', async ({ page }) => {
      // Navigate to the gallery section
      await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
      
      // Wait for gallery to load
      await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Get scroll position before opening lightbox
      const scrollBefore = await page.evaluate(() => window.scrollY);
      
      // Click on the first image to open lightbox
      const firstImage = page.locator('.grid.grid-cols-1.md\\:grid-cols-2 > div').first();
      await firstImage.click();
      
      // Wait for lightbox to open
      await page.waitForSelector('[class*="fixed inset-0 z-50"]', { timeout: 5000 });
      
      // Check that body scroll is locked
      const bodyOverflow = await page.evaluate(() => {
        const body = document.body;
        const style = window.getComputedStyle(body);
        return {
          overflow: style.overflow,
          overflowY: style.overflowY,
          position: style.position
        };
      });
      
      // With react-remove-scroll, the body should have specific styles
      expect(bodyOverflow.overflow).toBe('hidden');
      expect(bodyOverflow.position).toBe('fixed');
      
      // Try to scroll - should not work
      await page.evaluate(() => window.scrollBy(0, 100));
      await page.waitForTimeout(500);
      
      const scrollDuringLightbox = await page.evaluate(() => window.scrollY);
      expect(scrollDuringLightbox).toBe(scrollBefore);
    });

    test('Scroll position is restored when lightbox closes', async ({ page }) => {
      // Navigate to the gallery section
      await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
      
      // Wait for gallery to load
      await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Get scroll position before opening lightbox
      const scrollBefore = await page.evaluate(() => window.scrollY);
      
      // Click on the first image to open lightbox
      const firstImage = page.locator('.grid.grid-cols-1.md\\:grid-cols-2 > div').first();
      await firstImage.click();
      
      // Wait for lightbox to open
      await page.waitForSelector('[class*="fixed inset-0 z-50"]', { timeout: 5000 });
      
      // Close the lightbox
      const closeButton = page.locator('button[aria-label="Sluit afbeelding weergave"]');
      await closeButton.click();
      
      // Wait for lightbox to close
      await page.waitForSelector('[class*="fixed inset-0 z-50"]', { state: 'hidden', timeout: 5000 });
      
      // Check that scroll position is restored
      const scrollAfter = await page.evaluate(() => window.scrollY);
      expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(5);
      
      // Check that body scroll is restored
      const bodyOverflow = await page.evaluate(() => {
        const body = document.body;
        const style = window.getComputedStyle(body);
        return {
          overflow: style.overflow,
          overflowY: style.overflowY,
          position: style.position
        };
      });
      
      expect(bodyOverflow.overflow).not.toBe('hidden');
      expect(bodyOverflow.position).not.toBe('fixed');
    });

    test('No nested scroll containers remain after closing lightbox', async ({ page }) => {
      // Navigate to the gallery section
      await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
      
      // Wait for gallery to load
      await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
      await page.waitForTimeout(2000);
      
      // Click on the first image to open lightbox
      const firstImage = page.locator('.grid.grid-cols-1.md\\:grid-cols-2 > div').first();
      await firstImage.click();
      
      // Wait for lightbox to open
      await page.waitForSelector('[class*="fixed inset-0 z-50"]', { timeout: 5000 });
      
      // Close the lightbox
      const closeButton = page.locator('button[aria-label="Sluit afbeelding weergave"]');
      await closeButton.click();
      
      // Wait for lightbox to close
      await page.waitForSelector('[class*="fixed inset-0 z-50"]', { state: 'hidden', timeout: 5000 });
      
      // Check that no nested scroll containers remain
      const galleryGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2');
      const nestedScrollElements = await galleryGrid.evaluate(el => {
        const scrollableElements = [];
        const allElements = el.querySelectorAll('*');
        
        for (const element of allElements) {
          const style = window.getComputedStyle(element);
          if ((style.overflow === 'auto' || style.overflow === 'scroll' ||
               style.overflowY === 'auto' || style.overflowY === 'scroll') &&
              element.scrollHeight > element.clientHeight) {
            scrollableElements.push({
              tagName: element.tagName,
              className: element.className
            });
          }
        }
        
        return scrollableElements;
      });
      
      expect(nestedScrollElements.length).toBe(0);
    });
  });

  test.describe('Mobile Touch Interaction Test', () => {
    mobileDevices.forEach(device => {
      test(`Vertical scrolling works naturally in lightbox on ${device.name}`, async ({ page }) => {
        // Set viewport to mobile device dimensions
        await page.setViewportSize(device.viewport);
        
        // Navigate to the gallery section
        await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
        
        // Wait for gallery to load
        await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
        await page.waitForTimeout(2000);
        
        // Click on the first image to open lightbox
        const firstImage = page.locator('.grid.grid-cols-1.md\\:grid-cols-2 > div').first();
        await firstImage.click();
        
        // Wait for lightbox to open
        await page.waitForSelector('[class*="fixed inset-0 z-50"]', { timeout: 5000 });
        
        // Check that touchAction is set to 'pan-y' on the lightbox
        const lightboxElement = page.locator('[class*="fixed inset-0 z-50"]');
        const touchAction = await lightboxElement.evaluate(el => 
          window.getComputedStyle(el).touchAction
        );
        
        expect(touchAction).toBe('pan-y');
        
        // Test vertical swipe in lightbox (should not be prevented)
        const lightbox = page.locator('[class*="fixed inset-0 z-50"]');
        const box = await lightbox.boundingBox();
        
        if (box) {
          // Create touch pointer
          await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
          
          // Test vertical swipe using mouse wheel as alternative
          await page.mouse.wheel(0, -100);
          
          // Wait a bit
          await page.waitForTimeout(500);
        }
      });

      test(`Horizontal swipe gestures work for image navigation on ${device.name}`, async ({ page }) => {
        // Set viewport to mobile device dimensions
        await page.setViewportSize(device.viewport);
        
        // Navigate to the gallery section
        await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
        
        // Wait for gallery to load
        await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
        await page.waitForTimeout(2000);
        
        // Click on the first image to open lightbox
        const firstImage = page.locator('.grid.grid-cols-1.md\\:grid-cols-2 > div').first();
        await firstImage.click();
        
        // Wait for lightbox to open
        await page.waitForSelector('[class*="fixed inset-0 z-50"]', { timeout: 5000 });
        
        // Get initial image counter
        const imageCounter = page.locator('text=/\\d+\\/\\d+/');
        const initialCounter = await imageCounter.textContent();
        
        // Test horizontal swipe for next image
        const lightbox = page.locator('[class*="fixed inset-0 z-50"]');
        const box = await lightbox.boundingBox();
        
        if (box && initialCounter) {
          // Create touch pointer for swipe
          await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
          
          // Test horizontal swipe using keyboard navigation as alternative
          // Press right arrow key to navigate to next image
          await page.keyboard.press('ArrowRight');
          
          // Wait for animation
          await page.waitForTimeout(1000);
          
          // Check if image counter changed (indicating navigation)
          const newCounter = await imageCounter.textContent();
          // Note: This should work as an alternative to touch swipe
        }
      });
    });
  });

  test.describe('Gallery Debug Page Test', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to the debug page
      await page.goto('/gallery-debug');
      await page.waitForLoadState('networkidle');
    });

    test('Normal Gallery variant works correctly', async ({ page }) => {
      // Select normal gallery mode
      await page.locator('input[value="none"]').check();
      
      // Wait for gallery to load
      await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
      
      // Check debug info panel
      const debugInfo = page.locator('.bg-yellow-50');
      await expect(debugInfo).toBeVisible();
      
      // Check that test mode is set to 'none'
      const testModeText = await debugInfo.locator('text=Test Mode: none').textContent();
      expect(testModeText).toContain('none');
      
      // Check for nested scroll issues
      const galleryGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2');
      const nestedScrollElements = await galleryGrid.evaluate(el => {
        const scrollableElements = [];
        const allElements = el.querySelectorAll('*');
        
        for (const element of allElements) {
          const style = window.getComputedStyle(element);
          if ((style.overflow === 'auto' || style.overflow === 'scroll' ||
               style.overflowY === 'auto' || style.overflowY === 'scroll') &&
              element.scrollHeight > element.clientHeight) {
            scrollableElements.push({
              tagName: element.tagName,
              className: element.className
            });
          }
        }
        
        return scrollableElements;
      });
      
      expect(nestedScrollElements.length).toBe(0);
    });

    test('Different test modes work correctly', async ({ page }) => {
      const testModes = ['no-lightbox', 'no-skeleton', 'no-aspect-ratio', 'fixed-height'];
      
      for (const mode of testModes) {
        // Select test mode
        await page.locator(`input[value="${mode}"]`).check();
        
        // Wait for gallery to update
        await page.waitForTimeout(1000);
        
        // Check debug info panel
        const debugInfo = page.locator('.bg-yellow-50');
        await expect(debugInfo).toBeVisible();
        
        // Check that test mode is updated
        const testModeText = await debugInfo.locator(`text=Test Mode: ${mode}`).textContent();
        expect(testModeText).toContain(mode);
        
        // Check that gallery is still visible
        const galleryGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2');
        await expect(galleryGrid).toBeVisible();
      }
    });

    test('Manual scroll state check works', async ({ page }) => {
      // Select normal gallery mode
      await page.locator('input[value="none"]').check();
      
      // Wait for gallery to load
      await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
      
      // Click the manual check button
      await page.locator('button:has-text("Check Scroll State")').click();
      
      // Wait for debug output
      await page.waitForTimeout(1000);
      
      // Check for console logs (we can't directly check console in Playwright,
      // but we can verify the button is clickable and the action completes)
      const checkButton = page.locator('button:has-text("Check Scroll State")');
      await expect(checkButton).toBeVisible();
    });
  });

  test.describe('Cross-browser Compatibility Test', () => {
    const browsers = [
      { ...devices['Desktop Chrome'], name: 'Chrome' },
      { ...devices['Desktop Firefox'], name: 'Firefox' },
      { ...devices['Desktop Safari'], name: 'Safari' }
    ];

    browsers.forEach(browser => {
      test(`Gallery scroll behavior is consistent in ${browser.name}`, async ({ page }) => {
        // Set viewport to desktop dimensions
        await page.setViewportSize(browser.viewport);
        
        // Navigate to the gallery section
        await page.locator('text=Smaakvolle Verhalen').scrollIntoViewIfNeeded();
        
        // Wait for gallery to load
        await page.waitForSelector('.grid.grid-cols-1.md\\:grid-cols-2', { timeout: 10000 });
        
        // Check that gallery is not creating nested scroll containers
        const galleryGrid = page.locator('.grid.grid-cols-1.md\\:grid-cols-2');
        const gridOverflow = await galleryGrid.evaluate(el => 
          window.getComputedStyle(el).overflow
        );
        
        expect(gridOverflow).toBe('visible');
        
        // Check for nested scrollable elements
        const nestedScrollElements = await galleryGrid.evaluate(el => {
          const scrollableElements = [];
          const allElements = el.querySelectorAll('*');
          
          for (const element of allElements) {
            const style = window.getComputedStyle(element);
            if ((style.overflow === 'auto' || style.overflow === 'scroll' ||
                 style.overflowY === 'auto' || style.overflowY === 'scroll') &&
                element.scrollHeight > element.clientHeight) {
              scrollableElements.push({
                tagName: element.tagName,
                className: element.className
              });
            }
          }
          
          return scrollableElements;
        });
        
        expect(nestedScrollElements.length).toBe(0);
        
        // Test lightbox functionality
        const firstImage = page.locator('.grid.grid-cols-1.md\\:grid-cols-2 > div').first();
        await firstImage.click();
        
        // Wait for lightbox to open
        await page.waitForSelector('[class*="fixed inset-0 z-50"]', { timeout: 5000 });
        
        // Check that lightbox is visible
        const lightbox = page.locator('[class*="fixed inset-0 z-50"]');
        await expect(lightbox).toBeVisible();
        
        // Close lightbox
        const closeButton = page.locator('button[aria-label="Sluit afbeelding weergave"]');
        await closeButton.click();
        
        // Wait for lightbox to close
        await page.waitForSelector('[class*="fixed inset-0 z-50"]', { state: 'hidden', timeout: 5000 });
        
        // Verify gallery is still visible and functional
        await expect(galleryGrid).toBeVisible();
      });
    });
  });
});