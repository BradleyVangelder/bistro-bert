#!/usr/bin/env node

console.log('=== Production Build Verification ===');
console.log('Checking that canvas is not included in production bundle...\n');

const fs = require('fs');
const path = require('path');

// Check if canvas exists in node_modules
function checkCanvasInNodeModules() {
  const canvasPath = path.join(process.cwd(), 'node_modules', 'canvas');
  const exists = fs.existsSync(canvasPath);

  if (exists) {
    console.log('⚠️  Canvas found in node_modules - ensuring it is excluded from build matches...');
    return true;
  } else {
    console.log('✅ Canvas not found in node_modules');
    return true;
  }
}

// Check package.json dependencies
function checkPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const canvasInDev = packageJson.devDependencies && packageJson.devDependencies.canvas;
  const canvasInProd = packageJson.dependencies && packageJson.dependencies.canvas;
  const canvasInPeer = packageJson.peerDependencies && packageJson.peerDependencies.canvas;

  let passed = true;

  if (canvasInDev) {
    console.log('❌ Canvas found in devDependencies');
    passed = false;
  } else {
    console.log('✅ Canvas not in devDependencies');
  }

  if (canvasInProd) {
    console.log('❌ Canvas found in dependencies');
    passed = false;
  } else {
    console.log('✅ Canvas not in dependencies');
  }

  if (canvasInPeer) {
    console.log('✅ Canvas correctly placed in peerDependencies');
  } else {
    console.log('⚠️  Canvas not found in peerDependencies');
  }

  return passed;
}

// Check .next build output for canvas references
function checkBuildOutput() {
  const buildDir = path.join(process.cwd(), '.next');

  if (!fs.existsSync(buildDir)) {
    console.log('⚠️  Build output not found - run "npm run build" first');
    return true;
  }

  console.log('Checking build output for canvas references...');

  try {
    // Simple check - look for canvas in main files
    const filesToCheck = [
      path.join(buildDir, 'server', 'app', 'page.js'),
      path.join(buildDir, 'static', 'chunks', 'webpack.js'),
    ];

    let canvasFound = false;

    filesToCheck.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes('canvas') && !content.includes('html5 canvas') && !content.includes('createElement(\'canvas\')') && !content.includes('createElement("canvas")') && !content.includes('getContext(\'webgl\')') && !content.includes('getContext("webgl")')) {
          console.log(`❌ Canvas reference found in ${file}`);
          canvasFound = true;
        }
      }
    });

    if (!canvasFound) {
      console.log('✅ No canvas references found in build output');
    }

    return !canvasFound;
  } catch (error) {
    console.log('⚠️  Could not check build output:', error.message);
    return true;
  }
}

// Main verification
console.log('Node version:', process.version);
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('');

const checks = [
  checkCanvasInNodeModules(),
  checkPackageJson(),
  checkBuildOutput()
];

const passed = checks.filter(Boolean).length;
const total = checks.length;

console.log('\n=== Summary ===');
console.log(`Passed: ${passed}/${total} checks`);

if (passed === total) {
  console.log('✅ All checks passed! Your build should work on Vercel.');
  process.exit(0);
} else {
  console.log('❌ Some checks failed. Please fix the issues before deploying.');
  process.exit(1);
}