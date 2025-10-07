const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('=== Simulating Vercel Build Process ===\n');

// 1. Check if package-lock.json exists
console.log('1. Checking for package-lock.json...');
if (fs.existsSync('package-lock.json')) {
  console.log('✓ package-lock.json exists - Vercel will use npm');
} else {
  console.log('✗ package-lock.json not found');
  process.exit(1);
}

// 2. Check that yarn.lock doesn't exist
console.log('\n2. Checking that yarn.lock does not exist...');
if (!fs.existsSync('yarn.lock')) {
  console.log('✓ yarn.lock not found - confirms npm will be used');
} else {
  console.log('✗ yarn.lock exists - this could cause issues');
}

// 3. Check vercel.json configuration
console.log('\n3. Checking vercel.json configuration...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  if (vercelConfig.installCommand === 'npm install --omit=dev --omit=optional') {
    console.log('✓ vercel.json has correct npm install command with --omit=dev --omit=optional');
  } else {
    console.log('✗ vercel.json has incorrect install command:', vercelConfig.installCommand);
  }
} catch (e) {
  console.log('✗ Error reading vercel.json:', e.message);
}

// 4. Check .npmrc configuration
console.log('\n4. Checking .npmrc configuration...');
try {
  const npmrc = fs.readFileSync('.npmrc', 'utf8');
  if (!npmrc.includes('package-lock=false')) {
    console.log('✓ .npmrc does not contain package-lock=false');
  } else {
    console.log('✗ .npmrc still contains package-lock=false');
  }
} catch (e) {
  console.log('✗ Error reading .npmrc:', e.message);
}

// 5. Check if canvas is in devDependencies
console.log('\n5. Checking package.json for canvas dependency...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (packageJson.devDependencies && packageJson.devDependencies.canvas) {
    console.log('✓ canvas is listed as a devDependency in package.json');
  } else {
    console.log('✗ canvas is not properly listed as a devDependency');
  }
} catch (e) {
  console.log('✗ Error reading package.json:', e.message);
}

// 6. Check if canvas is an optional dependency of pdfjs-dist
console.log('\n6. Checking if canvas is an optional dependency of pdfjs-dist...');
try {
  const packageLockJson = JSON.parse(fs.readFileSync('package-lock.json', 'utf8'));
  const pdfjsDist = packageLockJson.packages['node_modules/pdfjs-dist'];
  if (pdfjsDist && pdfjsDist.optionalDependencies && pdfjsDist.optionalDependencies.canvas) {
    console.log('✓ canvas is an optional dependency of pdfjs-dist');
    console.log('  This means --omit=optional is required to exclude it');
  } else {
    console.log('? canvas is not an optional dependency of pdfjs-dist');
  }
} catch (e) {
  console.log('✗ Error reading package-lock.json:', e.message);
}

// 7. Simulate npm install with --omit=dev --omit=optional
console.log('\n7. Simulating npm install with --omit=dev --omit=optional...');
try {
  // First clean up node_modules to simulate fresh environment
  if (fs.existsSync('node_modules')) {
    console.log('  Cleaning existing node_modules...');
    execSync('rm -rf node_modules', { stdio: 'inherit' });
  }
  
  // Run the install command
  console.log('  Running: npm install --omit=dev --omit=optional');
  const result = execSync('npm install --omit=dev --omit=optional', { encoding: 'utf8' });
  
  // Check if canvas was installed
  if (fs.existsSync('node_modules/canvas')) {
    console.log('✗ canvas was installed - this will cause build issues');
  } else {
    console.log('✓ canvas was not installed - build should succeed');
  }
  
  // Check if pdfjs-dist was installed
  if (fs.existsSync('node_modules/pdfjs-dist')) {
    console.log('✓ pdfjs-dist was installed without canvas');
  } else {
    console.log('✗ pdfjs-dist was not installed');
  }
  
} catch (e) {
  console.log('✗ Error during npm install:', e.message);
}

console.log('\n=== Simulation Complete ===');