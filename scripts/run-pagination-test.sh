#!/bin/bash

# Script to run the pagination bug test
echo "🧪 Running PDF Pagination Bug Test"
echo "=================================="

# Create test-results directory if it doesn't exist
mkdir -p test-results

# Make sure the dev server is running
if ! curl -s http://localhost:3000 > /dev/null; then
  echo "❌ Development server is not running on http://localhost:3000"
  echo "Please run 'npm run dev' in another terminal first"
  exit 1
fi

echo "✅ Development server is running"
echo ""

# Run the Playwright test
echo "🚀 Starting Playwright test..."
npx playwright test tests/pagination-bug.spec.ts --headed

# Check if test passed
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Test completed successfully!"
  echo "📸 Screenshots saved in test-results/ directory"
  echo "📊 Test report available at: npx playwright show-report"
else
  echo ""
  echo "❌ Test failed or bug was reproduced!"
  echo "📸 Screenshots saved in test-results/ directory"
  echo "📊 Test report available at: npx playwright show-report"
fi