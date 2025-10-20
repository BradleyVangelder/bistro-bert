# PDF Pagination Bug Test

This test suite is designed to reproduce and identify the pagination bug in the MinimalistPDFViewer component where clicking "volgende pagina" (next page) causes an infinite loop redirecting back to page 1.

## Test Overview

The test suite includes three main tests:

1. **Pagination Infinite Loop Test** - The main test that reproduces the bug by:
   - Navigating to the menu page
   - Waiting for the PDF to load completely
   - Checking the initial page number (should be page 1)
   - Clicking the "volgende pagina" (next page) button multiple times
   - Monitoring for URL changes and infinite redirects
   - Capturing screenshots at key points
   - Recording console logs and network requests

2. **URL Parameter Handling Test** - Tests direct navigation with slide parameters to check if the URL handling is working correctly.

3. **Component State Monitoring Test** - Monitors the development panel (if available) to track component state changes during pagination.

## Prerequisites

- Node.js and npm installed
- Development server running on `http://localhost:3000`
- Playwright installed (already included in devDependencies)

## Running the Tests

### Option 1: Using the convenience script (recommended)

```bash
# Make sure the dev server is running in another terminal
npm run dev

# Run the pagination test
./scripts/run-pagination-test.sh
```

### Option 2: Running directly with Playwright

```bash
# Make sure the dev server is running
npm run dev

# Run the test in headed mode (visible browser)
npx playwright test tests/pagination-bug.spec.ts --headed

# Run in headless mode (background)
npx playwright test tests/pagination-bug.spec.ts

# Run with additional debugging
npx playwright test tests/pagination-bug.spec.ts --headed --debug
```

## Test Configuration

The test is configured in `playwright.config.ts` with the following settings:

- **Headed mode**: Browser is visible so you can observe the behavior
- **Screenshots**: Captured on failure and at key points during the test
- **Video recording**: Recorded on failure for debugging
- **Network monitoring**: Monitors PDF and slide-related requests
- **Console logging**: Captures all console output for debugging

## Expected Results

### If the bug is present:
- The test will detect multiple redirects back to page 1
- Console logs will show "BUG DETECTED: Page redirected back to page 1!"
- The test assertion will fail because `page1Occurrences` will be >= 2
- Screenshots will show the page stuck on page 1 despite clicking next

### If the bug is fixed:
- The page number should advance correctly with each click
- URL parameters should update properly (slide=2, slide=3, etc.)
- No infinite redirects will be detected
- The test will pass successfully

## Artifacts Generated

The test generates the following artifacts in the `test-results/` directory:

- `initial-state.png` - Screenshot before any interaction
- `after-first-click.png` - Screenshot after first next page click
- `after-click-{n}.png` - Screenshots after every 2 clicks
- `final-state.png` - Screenshot after all interactions
- `direct-navigation-slide2.png` - Screenshot when navigating directly to slide=2
- `after-click-from-slide2.png` - Screenshot after clicking next from slide=2
- `dev-panel-*.png` - Screenshots of development panel (if available)
- Test report (HTML) - Detailed test results with traces and videos

## Debugging Information

The test provides extensive logging:

1. **Console output**: All browser console messages are captured
2. **Network requests**: PDF and slide-related requests are monitored
3. **URL changes**: Every URL change is logged and analyzed
4. **Page indicators**: Current page number is tracked throughout the test
5. **Component state**: Development panel information (if available)

## Analyzing Results

After running the test:

1. Check the console output for "BUG DETECTED" messages
2. Review the screenshots to visually confirm the behavior
3. Examine the URL change history for patterns of redirects
4. View the HTML test report with `npx playwright show-report`
5. Check for any console errors that might indicate the root cause

## Troubleshooting

### Test fails to find PDF viewer
- Ensure the PDF file exists at `/public/menu.pdf`
- Check that the development server is running
- Verify the PDF viewer component is rendering correctly

### Test times out
- Increase the timeout values in the test
- Check if the PDF is loading slowly
- Verify network connectivity

### Browser doesn't launch
- Install Playwright browsers: `npx playwright install`
- Check system requirements for Playwright
- Try running without `--headed` flag

## Next Steps

If the bug is reproduced:

1. Analyze the URL change patterns to identify when the redirect occurs
2. Check the console logs for any error messages
3. Review the MinimalistPDFViewer component's URL handling logic
4. Focus on the `isUpdatingFromUrl` state management
5. Test the fix by running the test again

The test is designed to be run repeatedly during development to verify that any fix actually resolves the infinite loop issue.