#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const glob = require('glob');

console.log('🔍 Starting HTML validation...');

console.log('📋 Validating theme templates...');
try {
  execSync('npx html-validate my-static-site/theme/**/*.html --ignore-errors', { stdio: 'inherit' });
  console.log('✅ Theme templates validation completed');
} catch (error) {
  console.log('⚠️  Theme templates have validation warnings (continuing...)');
}
const siteDir = path.join(__dirname, '..', 'my-static-site', 'site');
if (fs.existsSync(siteDir)) {
  console.log('🌐 Validating built HTML files...');
  
  // Find all HTML files in the built site
  const htmlFiles = glob.sync('**/*.html', { cwd: siteDir });
  
  if (htmlFiles.length > 0) {
    console.log(`Found ${htmlFiles.length} HTML files to validate`);
    
    let validationPassed = true;
    
    for (const file of htmlFiles) {
      const filePath = path.join(siteDir, file);
      try {
        execSync(`npx html-validate "${filePath}"`, { stdio: 'pipe' });
        console.log(`✅ ${file} - Valid`);
      } catch (error) {
        console.log(`⚠️  ${file} - Has validation issues`);
        validationPassed = false;
      }
    }
    
    if (validationPassed) {
      console.log('🎉 All HTML files passed validation!');
    } else {
      console.log('⚠️  Some HTML files have validation issues (build continues)');
    }
  } else {
    console.log('📭 No HTML files found in built site');
  }
} else {
  console.log('📁 Built site directory not found, skipping built files validation');
}

console.log('🔧 Running additional HTML checks...');

const checkCommonIssues = (htmlContent, filename) => {
  const issues = [];
  
  const imgTags = htmlContent.match(/<img[^>]*>/g) || [];
  imgTags.forEach(img => {
    if (!img.includes('alt=')) {
      issues.push('Missing alt attribute on image');
    }
  });
  
  // Check for missing lang attribute on html tag
  if (!htmlContent.includes('<html') || !htmlContent.includes('lang=')) {
    issues.push('Missing lang attribute on html tag');
  }
  
  if (!htmlContent.includes('charset=')) {
    issues.push('Missing charset meta tag');
  }
  
  if (!htmlContent.includes('viewport')) {
    issues.push('Missing viewport meta tag');
  }
  
  return issues;
};
const themeDir = path.join(__dirname, '..', 'my-static-site', 'theme');
if (fs.existsSync(themeDir)) {
  const templateFiles = glob.sync('**/*.html', { cwd: themeDir });
  
  templateFiles.forEach(file => {
    const filePath = path.join(themeDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = checkCommonIssues(content, file);
    
    if (issues.length > 0) {
      console.log(`📋 ${file}:`);
      issues.forEach(issue => console.log(`  - ${issue}`));
    }
  });
}

console.log('✅ HTML validation completed');