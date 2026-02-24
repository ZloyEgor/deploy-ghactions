#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting development environment...');

// Step 1: Build frontend assets once
console.log('⚛️  Building frontend assets...');
try {
  execSync('npm run build:frontend', { stdio: 'inherit' });
  console.log('✅ Frontend assets built successfully');
} catch (error) {
  console.error('❌ Failed to build frontend assets');
  process.exit(1);
}

// Step 2: Start MkDocs dev server
console.log('📚 Starting MkDocs dev server...');
console.log('🌐 Site will be available at: http://127.0.0.1:8000');
console.log('🔄 Make changes to Markdown files and they will auto-reload');
console.log('🎨 To rebuild frontend assets, run: npm run build:frontend');
console.log('');

try {
  const mkdocsProcess = spawn('python', ['-m', 'mkdocs', 'serve', '--dev-addr=127.0.0.1:8000'], {
    cwd: path.join(__dirname, '..', 'my-static-site'),
    stdio: 'inherit'
  });

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping development server...');
    mkdocsProcess.kill('SIGINT');
    process.exit(0);
  });

  mkdocsProcess.on('close', (code) => {
    console.log(`\n📚 MkDocs server exited with code ${code}`);
    process.exit(code);
  });

} catch (error) {
  console.error('❌ Failed to start MkDocs server:', error.message);
  process.exit(1);
}