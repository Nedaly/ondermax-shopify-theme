#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const FONTS = {
  Heebo:
    'https://fonts.googleapis.com/css2?family=Heebo:wght@400;600&display=swap',
  'IBM Plex Sans Arabic':
    'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600&display=swap',
};

const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const REPORT_DIR = path.join(__dirname, '..', 'report');

// Ensure directories exist
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });
if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });

function fetchURL(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      response.on('data', (chunk) => (data += chunk));
      response.on('end', () => resolve(data));
    });
    request.on('error', reject);
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path.join(ASSETS_DIR, filename));
    const request = https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    });
    request.on('error', (err) => {
      fs.unlink(path.join(ASSETS_DIR, filename), () => {});
      reject(err);
    });
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

function parseCSS(css, familyName) {
  const urls = {};
  const lines = css.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Look for font-weight declarations
    if (line.includes('font-weight: 400') || line.includes('font-weight:400')) {
      // Find the next src: line
      for (let j = i + 1; j < lines.length; j++) {
        const srcLine = lines[j].trim();
        if (srcLine.includes('src:')) {
          const woff2Match = srcLine.match(/url\(([^)]*\.woff2[^)]*)\)/);
          if (woff2Match) {
            urls['400'] = woff2Match[1];
            break;
          }
        }
      }
    }

    if (line.includes('font-weight: 600') || line.includes('font-weight:600')) {
      for (let j = i + 1; j < lines.length; j++) {
        const srcLine = lines[j].trim();
        if (srcLine.includes('src:')) {
          const woff2Match = srcLine.match(/url\(([^)]*\.woff2[^)]*)\)/);
          if (woff2Match) {
            urls['600'] = woff2Match[1];
            break;
          }
        }
      }
    }
  }

  return urls;
}

async function main() {
  console.log('🔍 Fetching Google Fonts CSS...');

  const manifest = {};
  let hasErrors = false;

  for (const [familyName, cssUrl] of Object.entries(FONTS)) {
    try {
      console.log(`📥 Fetching ${familyName}...`);
      const css = await fetchURL(cssUrl);
      const urls = parseCSS(css, familyName);

      manifest[familyName] = {};

      for (const [weight, url] of Object.entries(urls)) {
        if (url) {
          const filename = path.basename(url);
          console.log(`⬇️  Downloading ${familyName} ${weight}...`);
          try {
            await downloadFile(url, filename);
            manifest[familyName][weight] = filename;
            console.log(`✅ Downloaded: ${filename}`);
          } catch (err) {
            console.log(`❌ Failed to download ${filename}: ${err.message}`);
            hasErrors = true;
          }
        }
      }

      if (Object.keys(manifest[familyName]).length === 0) {
        console.log(`⚠️  No WOFF2 URLs found for ${familyName}`);
        hasErrors = true;
      }
    } catch (err) {
      console.log(`❌ Failed to fetch ${familyName}: ${err.message}`);
      hasErrors = true;
    }
  }

  // Write manifest
  const manifestPath = path.join(REPORT_DIR, 'fonts-manifest.json');
  if (hasErrors || Object.keys(manifest).length === 0) {
    const errorManifest = {
      status: 'manual_required',
      css_urls: {
        Heebo: FONTS['Heebo'],
        'IBM Plex Sans Arabic': FONTS['IBM Plex Sans Arabic'],
      },
    };
    fs.writeFileSync(manifestPath, JSON.stringify(errorManifest, null, 2));
    console.log('\n❌ Auto-download failed. Manual download required.');
    console.log('📝 Check report/fonts-manifest.json for CSS URLs.');
    process.exit(0);
  } else {
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('\n✅ All fonts downloaded successfully!');
    console.log('📝 Manifest saved to report/fonts-manifest.json');
  }
}

main().catch((err) => {
  console.error('💥 Script error:', err.message);
  process.exit(1);
});
