#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Starting unified build process...');

// Step 1: Clean previous builds
console.log('🧹 Cleaning previous builds...');
try {
  execSync('npm run build:clean', { stdio: 'inherit' });
} catch (error) {
  console.log('Clean step completed (some directories may not have existed)');
}

console.log('⚛️  Building frontend assets...');
execSync('npm run build:frontend', { stdio: 'inherit' });

console.log('📝 Updating MkDocs configuration with asset paths...');
const manifestPath = path.join(__dirname, '..', 'my-static-site', 'theme', 'assets', 'manifest.json');

if (fs.existsSync(manifestPath)) {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  const mkdocsConfigPath = path.join(__dirname, '..', 'my-static-site', 'mkdocs.yml');
  let mkdocsConfig = fs.readFileSync(mkdocsConfigPath, 'utf8');
  
  Object.keys(manifest).forEach(key => {
    const assetPath = manifest[key].file;
    if (key.includes('main.ts')) {
      mkdocsConfig = mkdocsConfig.replace('assets/js/main.js', `assets/${assetPath}`);
    }
    if (key.includes('main.scss')) {
      mkdocsConfig = mkdocsConfig.replace('assets/css/main.css', `assets/${assetPath}`);
    }
  });
  
  fs.writeFileSync(mkdocsConfigPath, mkdocsConfig);
  console.log('✅ MkDocs configuration updated with asset paths');
} else {
  console.log('⚠️  Manifest file not found, using default asset paths');
}

console.log('📚 Building MkDocs site...');
execSync('npm run build:mkdocs', { stdio: 'inherit' });

console.log('📁 Copying site content to dist...');
execSync('mkdir -p dist', { stdio: 'inherit' });
execSync('cp -r my-static-site/site/* dist/', { stdio: 'inherit' });

console.log('🗜️  Minifying HTML files...');
try {
  execSync('html-minifier --remove-comments --collapse-whitespace --minify-css --minify-js --input-dir dist --output-dir dist --file-ext html', { stdio: 'inherit' });
  console.log('✅ HTML minification completed');
} catch (error) {
  console.log('⚠️  HTML minification failed, but files are copied');
}

console.log('🎉 Build completed successfully!');
console.log('📁 Output directory: dist/');
console.log('🌐 You can serve the site with: npm run serve');