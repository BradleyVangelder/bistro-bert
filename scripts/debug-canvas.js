#!/usr/bin/env node

console.log('=== Canvas Dependency Debug Script ===');
console.log('Node version:', process.version);
console.log('Platform:', process.platform);
console.log('Architecture:', process.arch);

try {
  console.log('\n=== Checking Canvas Package ===');
  const canvas = require('canvas');
  console.log('✅ Canvas loaded successfully');
  console.log('Canvas version:', canvas.version);
} catch (error) {
  console.log('❌ Canvas failed to load:', error.message);
  console.log('Error code:', error.code);
}

try {
  console.log('\n=== Checking PDF Dependencies ===');
  const pdfjs = require('pdfjs-dist');
  console.log('✅ PDF.js loaded successfully');
  console.log('PDF.js version:', pdfjs.version);
} catch (error) {
  console.log('❌ PDF.js failed to load:', error.message);
}

try {
  console.log('\n=== Checking React PDF Viewer ===');
  const core = require('@react-pdf-viewer/core');
  console.log('✅ React PDF Viewer core loaded successfully');
} catch (error) {
  console.log('❌ React PDF Viewer failed to load:', error.message);
}

console.log('\n=== Environment Variables ===');
console.log('NEXT_PUBLIC_ENV:', process.env.NEXT_PUBLIC_ENV);
console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('\n=== Native Dependencies Check ===');
const { execSync } = require('child_process');
try {
  const pkgConfig = execSync('pkg-config --cflags --libs cairo', { encoding: 'utf8' });
  console.log('✅ Cairo found:', pkgConfig.trim());
} catch (error) {
  console.log('❌ Cairo not found or pkg-config missing');
}

try {
  const pkgConfigPango = execSync('pkg-config --cflags --libs pango', { encoding: 'utf8' });
  console.log('✅ Pango found:', pkgConfigPango.trim());
} catch (error) {
  console.log('❌ Pango not found or pkg-config missing');
}