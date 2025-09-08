#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Required keys to validate
const REQUIRED_KEYS = [
  'products.product.fake_stock_message_html',
  'hero.cta_primary',
];

// Locale files to validate
const LOCALE_FILES = [
  'locales/en.default.json',
  'locales/ar.json',
  'locales/he.json',
];

function stripShopifyComments(content) {
  // Remove leading /* ... */ block and any leading // lines
  let out = content.replace(/^\/\*[\s\S]*?\*\/\s*/, '');
  out = out.replace(/^(?:\s*\/\/.*\r?\n)+/m, '');
  return out;
}

function getNestedValue(obj, keyPath) {
  return keyPath.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

function validateLocaleFile(filePath) {
  console.log(`Validating ${filePath}...`);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return false;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanContent = stripShopifyComments(content);
    const localeData = JSON.parse(cleanContent);

    let isValid = true;

    for (const keyPath of REQUIRED_KEYS) {
      const value = getNestedValue(localeData, keyPath);
      if (value === undefined) {
        console.error(`❌ Missing key: ${keyPath} in ${filePath}`);
        isValid = false;
      } else if (typeof value !== 'string' || value.trim() === '') {
        console.error(`❌ Invalid value for key: ${keyPath} in ${filePath}`);
        isValid = false;
      } else {
        console.log(`✅ Found key: ${keyPath}`);
      }
    }

    return isValid;
  } catch (error) {
    console.error(`❌ JSON parse error in ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔍 Validating locale files...\n');

  let allValid = true;

  for (const filePath of LOCALE_FILES) {
    const isValid = validateLocaleFile(filePath);
    if (!isValid) {
      allValid = false;
    }
    console.log(''); // Empty line for readability
  }

  if (allValid) {
    console.log('✅ All locale files are valid!');
    process.exit(0);
  } else {
    console.log(
      '❌ Some locale files have issues. Please fix them before continuing.'
    );
    process.exit(1);
  }
}

main();
