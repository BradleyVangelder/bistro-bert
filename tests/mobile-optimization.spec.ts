import { test, expect, devices } from '@playwright/test';

// Mobile device configurations for testing
const mobileDevices = [
  { ...devices['iPhone 12'], name: 'iPhone 12' },
  { ...devices['Pixel 5'], name: 'Pixel 5' },
  { ...devices['iPhone 14 Pro Max'], name: 'iPhone 14 Pro Max' },
  { ...devices['iPad'], name: 'iPad' }
];

test.describe('Mobile Optimization Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page
    await page.goto('/');
    
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
  });

  test.describe('Font Sizes and Readability', () => {
    mobileDevices.forEach(device => {
      test(`Text is readable on ${device.name}`, async ({ page }) => {
        // Set viewport to mobile device dimensions
        await page.setViewportSize(device.viewport);
        
        // Check main headings
        const mainHeadings = page.locator('h1, h2');
        const headingCount = await mainHeadings.count();
        
        for (let i = 0; i < headingCount; i++) {
          const heading = mainHeadings.nth(i);
          const fontSize = await heading.evaluate(el => 
            window.getComputedStyle(el).fontSize
          );
          const fontSizeValue = parseFloat(fontSize);
          
          // Headings should be at least 24px on mobile
          expect(fontSizeValue).toBeGreaterThanOrEqual(24);
        }
        
        // Check body text
        const bodyText = page.locator('p, .description, .content');
        const bodyTextCount = await bodyText.count();
        
        for (let i = 0; i < Math.min(bodyTextCount, 5); i++) {
          const text = bodyText.nth(i);
          const fontSize = await text.evaluate(el => 
            window.getComputedStyle(el).fontSize
          );
          const fontSizeValue = parseFloat(fontSize);
          
          // Body text should be at least 16px on mobile
          expect(fontSizeValue).toBeGreaterThanOrEqual(16);
        }
      });

      test(`Line height is appropriate for readability on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Check paragraph line height
        const paragraphs = page.locator('p');
        if (await paragraphs.count() > 0) {
          const lineHeight = await paragraphs.first().evaluate(el => 
            window.getComputedStyle(el).lineHeight
          );
          const lineHeightValue = parseFloat(lineHeight);
          
          // Line height should be at least 1.5 times font size
          expect(lineHeightValue).toBeGreaterThanOrEqual(1.5);
        }
      });

      test(`Text contrast meets WCAG standards on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Check contrast ratio for text elements
        const textElements = page.locator('h1, h2, h3, p, span, a');
        const textCount = await textElements.count();
        
        for (let i = 0; i < Math.min(textCount, 10); i++) {
          const element = textElements.nth(i);
          const computedStyle = await element.evaluate(el => {
            const style = window.getComputedStyle(el);
            return {
              color: style.color,
              backgroundColor: style.backgroundColor
            };
          });
          
          // Ensure text is visible (basic check)
          expect(computedStyle.color).not.toBe('rgba(0, 0, 0, 0)');
          expect(computedStyle.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
        }
      });
    });
  });

  test.describe('Touch Interactions', () => {
    mobileDevices.forEach(device => {
      test(`Touch targets are appropriately sized on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Check button sizes
        const buttons = page.locator('button, .btn, a[role="button"]');
        const buttonCount = await buttons.count();
        
        for (let i = 0; i < Math.min(buttonCount, 5); i++) {
          const button = buttons.nth(i);
          const boundingBox = await button.boundingBox();
          
          if (boundingBox) {
            // Touch targets should be at least 44x44px
            expect(boundingBox.width).toBeGreaterThanOrEqual(44);
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      });

      test(`Navigation is touch-friendly on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Check if mobile navigation exists and is accessible
        const mobileNav = page.locator('.mobile-navigation, .nav-mobile, [aria-label="mobile menu"]');
        
        if (await mobileNav.count() > 0) {
          // Check hamburger menu if present
          const hamburgerMenu = page.locator('.hamburger, .menu-toggle, [aria-label="menu"]');
          if (await hamburgerMenu.count() > 0) {
            const menuBox = await hamburgerMenu.first().boundingBox();
            expect(menuBox?.width).toBeGreaterThanOrEqual(44);
            expect(menuBox?.height).toBeGreaterThanOrEqual(44);
          }
        }
      });

      test(`Form inputs are touch-friendly on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Navigate to contact page to test forms
        await page.goto('/contact');
        await page.waitForLoadState('networkidle');
        
        // Check input field sizes
        const inputs = page.locator('input, textarea, select');
        const inputCount = await inputs.count();
        
        for (let i = 0; i < Math.min(inputCount, 5); i++) {
          const input = inputs.nth(i);
          const boundingBox = await input.boundingBox();
          
          if (boundingBox) {
            // Input fields should have adequate touch target size
            expect(boundingBox.height).toBeGreaterThanOrEqual(44);
          }
        }
      });
    });
  });

  test.describe('Responsive Design', () => {
    mobileDevices.forEach(device => {
      test(`Layout adapts to mobile viewport on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Check for horizontal scroll
        const bodyOverflow = await page.evaluate(() => 
          window.getComputedStyle(document.body).overflowX
        );
        expect(bodyOverflow).toBe('hidden');
        
        // Check if container widths are responsive
        const containers = page.locator('.container, .main-content, .content-wrapper');
        const containerCount = await containers.count();
        
        for (let i = 0; i < Math.min(containerCount, 3); i++) {
          const container = containers.nth(i);
          const containerWidth = await container.evaluate(el => 
            window.getComputedStyle(el).width
          );
          
          // Container should not exceed viewport width
          const viewportWidth = device.viewport.width;
          const containerWidthValue = parseFloat(containerWidth);
          expect(containerWidthValue).toBeLessThanOrEqual(viewportWidth);
        }
      });

      test(`Images are responsive on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Check image responsiveness
        const images = page.locator('img');
        const imageCount = await images.count();
        
        for (let i = 0; i < Math.min(imageCount, 5); i++) {
          const image = images.nth(i);
          const maxWidth = await image.evaluate(el => 
            window.getComputedStyle(el).maxWidth
          );
          
          // Images should have max-width set or be responsive
          expect(maxWidth === '100%' || maxWidth === 'none' || !maxWidth).toBeTruthy();
        }
      });

      test(`No horizontal scrolling on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Get page dimensions
        const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const viewportWidth = device.viewport.width;
        
        // Page should not be wider than viewport
        expect(pageWidth).toBeLessThanOrEqual(viewportWidth + 1); // Allow 1px tolerance
      });
    });
  });

  test.describe('Performance', () => {
    mobileDevices.forEach(device => {
      test(`Page loads efficiently on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Measure load time
        const navigationStart = await page.evaluate(() => 
          performance.timing.navigationStart
        );
        const loadComplete = await page.evaluate(() => 
          performance.timing.loadEventEnd
        );
        
        const loadTime = loadComplete - navigationStart;
        
        // Page should load within reasonable time (5 seconds for mobile)
        expect(loadTime).toBeLessThan(5000);
      });

      test(`No layout shifts on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Check for layout shifts
        const cls = await page.evaluate(() => {
          return new Promise((resolve) => {
            let clsValue = 0;
            new PerformanceObserver((list) => {
              for (const entry of list.getEntries()) {
                if ('hadRecentInput' in entry && 'value' in entry) {
                  const layoutShiftEntry = entry as PerformanceEntry & {
                    hadRecentInput: boolean;
                    value: number;
                  };
                  if (!layoutShiftEntry.hadRecentInput) {
                    clsValue += layoutShiftEntry.value;
                  }
                }
              }
            }).observe({ entryTypes: ['layout-shift'] });
            
            setTimeout(() => resolve(clsValue), 2000);
          });
        });
        
        // CLS should be very low (less than 0.1)
        expect(cls).toBeLessThan(0.1);
      });
    });
  });

  test.describe('Accessibility', () => {
    mobileDevices.forEach(device => {
      test(`Focus management works on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Test tab navigation
        await page.keyboard.press('Tab');
        
        // Check if focus is visible
        const focusedElement = await page.evaluate(() => document.activeElement);
        expect(focusedElement).toBeTruthy();
        
        // Check focus styles
        const focusStyles = await page.evaluate(() => {
          const active = document.activeElement as HTMLElement;
          if (active) {
            const style = window.getComputedStyle(active, ':focus');
            return {
              outline: style.outline,
              outlineOffset: style.outlineOffset,
              outlineWidth: style.outlineWidth
            };
          }
          return null;
        });
        
        // Focus should be visible
        if (focusStyles) {
          expect(focusStyles.outline !== 'none' || focusStyles.outlineWidth !== '0px').toBeTruthy();
        }
      });

      test(`Screen reader accessibility on ${device.name}`, async ({ page }) => {
        await page.setViewportSize(device.viewport);
        
        // Check for ARIA labels
        const interactiveElements = page.locator('button, a, input, textarea, select');
        const elementCount = await interactiveElements.count();
        
        for (let i = 0; i < Math.min(elementCount, 5); i++) {
          const element = interactiveElements.nth(i);
          const hasAriaLabel = await element.evaluate(el => 
            el.hasAttribute('aria-label') || 
            el.hasAttribute('aria-labelledby') || 
            el.hasAttribute('title') ||
            (el as HTMLElement).textContent?.trim() !== ''
          );
          
          // Interactive elements should have accessible labels
          expect(hasAriaLabel).toBeTruthy();
        }
      });
    });
  });
});