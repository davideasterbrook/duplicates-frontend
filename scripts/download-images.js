const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const INPUT_DIR = path.join(__dirname, '..', 'fetched-nft-data');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'inspiration-nfts');
const COMBINED_FILE = path.join(INPUT_DIR, 'all-collections.json');

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Helper function to get file extension from URL
function getExtensionFromUrl(url) {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname.toLowerCase();
    
    for (const ext of SUPPORTED_FORMATS) {
      if (pathname.endsWith(ext)) {
        return ext;
      }
    }
    
    // Default to .jpg if no extension found
    return '.jpg';
  } catch (e) {
    return '.jpg';
  }
}

// Helper function to sanitize filename
function sanitizeFilename(filename) {
  return filename.replace(/[^a-z0-9.-]/gi, '_');
}

// Helper function to download file
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    if (!url) {
      reject(new Error('No URL provided'));
      return;
    }

    console.log(`  📥 Downloading: ${url}`);
    
    const protocol = url.startsWith('https:') ? https : http;
    
    const request = protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      },
      timeout: 30000
    }, (response) => {
      // Handle redirects
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        console.log(`  🔄 Redirecting to: ${response.headers.location}`);
        downloadFile(response.headers.location, outputPath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
        return;
      }
      
      const file = fs.createWriteStream(outputPath);
      let downloadedBytes = 0;
      const totalBytes = parseInt(response.headers['content-length']) || 0;
      
      response.on('data', (chunk) => {
        downloadedBytes += chunk.length;
        if (totalBytes > 0) {
          const percent = ((downloadedBytes / totalBytes) * 100).toFixed(1);
          process.stdout.write(`\r  📊 Progress: ${percent}%`);
        }
      });
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`\n  ✅ Downloaded: ${path.basename(outputPath)} (${downloadedBytes} bytes)`);
        resolve(outputPath);
      });
      
      file.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete incomplete file
        reject(err);
      });
    });
    
    request.on('timeout', () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
    
    request.on('error', (err) => {
      reject(err);
    });
  });
}

// Function to optimize image (placeholder for future implementation)
async function optimizeImage(imagePath) {
  // TODO: Add image optimization using sharp or similar
  // For now, just return the original path
  return imagePath;
}

// Function to download images for a single NFT
async function downloadNftImage(nft, collectionFolder) {
  if (!nft.image) {
    console.log(`  ⚠️  No image URL for ${nft.name}`);
    return null;
  }
  
  const extension = getExtensionFromUrl(nft.image);
  const filename = `${nft.tokenId}${extension}`;
  const outputPath = path.join(OUTPUT_DIR, collectionFolder, filename);
  
  // Skip if file already exists
  if (fs.existsSync(outputPath)) {
    console.log(`  ⏭️  Already exists: ${filename}`);
    return outputPath;
  }
  
  try {
    await downloadFile(nft.image, outputPath);
    await optimizeImage(outputPath);
    return outputPath;
  } catch (error) {
    console.log(`  ❌ Failed to download ${nft.name}: ${error.message}`);
    
    // Try alternative image URL if available
    if (nft.imageOriginal && nft.imageOriginal !== nft.image) {
      console.log(`  🔄 Trying original URL...`);
      try {
        await downloadFile(nft.imageOriginal, outputPath);
        await optimizeImage(outputPath);
        return outputPath;
      } catch (altError) {
        console.log(`  ❌ Alternative URL also failed: ${altError.message}`);
      }
    }
    
    return null;
  }
}

// Function to download images for a collection
async function downloadCollectionImages(collection) {
  console.log(`\n📦 Downloading images for ${collection.name}...`);
  
  const collectionFolder = collection.folder;
  const outputFolder = path.join(OUTPUT_DIR, collectionFolder);
  
  // Ensure collection folder exists
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }
  
  let successCount = 0;
  let failCount = 0;
  
  for (const nft of collection.nfts) {
    console.log(`\n  🎨 Processing: ${nft.name} (Token #${nft.tokenId})`);
    
    const imagePath = await downloadNftImage(nft, collectionFolder);
    
    if (imagePath) {
      successCount++;
    } else {
      failCount++;
    }
    
    // Rate limiting to be respectful to servers
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n📊 ${collection.name} Summary:`);
  console.log(`  ✅ Downloaded: ${successCount}`);
  console.log(`  ❌ Failed: ${failCount}`);
  
  return { successCount, failCount };
}

// Function to create backup of placeholder images
function backupPlaceholders() {
  const backupDir = path.join(OUTPUT_DIR, '_placeholder_backup');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
    
    console.log('📋 Backing up placeholder images...');
    
    // Find all .svg files (our placeholders)
    const collections = fs.readdirSync(OUTPUT_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('_'))
      .map(dirent => dirent.name);
    
    for (const collection of collections) {
      const collectionPath = path.join(OUTPUT_DIR, collection);
      const backupCollectionPath = path.join(backupDir, collection);
      
      if (!fs.existsSync(backupCollectionPath)) {
        fs.mkdirSync(backupCollectionPath, { recursive: true });
      }
      
      const files = fs.readdirSync(collectionPath);
      for (const file of files) {
        if (file.endsWith('.svg')) {
          const srcPath = path.join(collectionPath, file);
          const destPath = path.join(backupCollectionPath, file);
          fs.copyFileSync(srcPath, destPath);
        }
      }
    }
    
    console.log(`✅ Placeholder backup created at: ${backupDir}`);
  }
}

// Function to generate download report
function generateReport(results) {
  const report = {
    downloadedAt: new Date().toISOString(),
    totalCollections: results.length,
    totalSuccess: results.reduce((sum, r) => sum + r.successCount, 0),
    totalFailed: results.reduce((sum, r) => sum + r.failCount, 0),
    collections: results.map(r => ({
      name: r.collection.name,
      folder: r.collection.folder,
      successCount: r.successCount,
      failCount: r.failCount,
      successRate: `${((r.successCount / (r.successCount + r.failCount)) * 100).toFixed(1)}%`
    }))
  };
  
  const reportPath = path.join(INPUT_DIR, 'download-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`\n📊 Download Report:`);
  console.log(`  📁 Collections: ${report.totalCollections}`);
  console.log(`  ✅ Successful: ${report.totalSuccess}`);
  console.log(`  ❌ Failed: ${report.totalFailed}`);
  console.log(`  📈 Success Rate: ${((report.totalSuccess / (report.totalSuccess + report.totalFailed)) * 100).toFixed(1)}%`);
  console.log(`  💾 Report saved: ${reportPath}`);
  
  return report;
}

// Main function
async function main() {
  console.log('🖼️  Starting NFT image download...');
  
  // Check if metadata exists
  if (!fs.existsSync(COMBINED_FILE)) {
    console.error(`❌ Metadata file not found: ${COMBINED_FILE}`);
    console.log('Please run: node scripts/fetch-nft-metadata.js first');
    process.exit(1);
  }
  
  // Load metadata
  const data = JSON.parse(fs.readFileSync(COMBINED_FILE, 'utf8'));
  console.log(`📊 Found ${data.collections.length} collections with ${data.totalNfts} NFTs`);
  
  // Backup existing placeholders
  backupPlaceholders();
  
  // Download images for each collection
  const results = [];
  
  for (const collection of data.collections) {
    try {
      const result = await downloadCollectionImages(collection);
      results.push({
        collection,
        ...result
      });
    } catch (error) {
      console.error(`❌ Failed to process collection ${collection.name}:`, error.message);
      results.push({
        collection,
        successCount: 0,
        failCount: collection.nfts.length
      });
    }
  }
  
  // Generate report
  generateReport(results);
  
  console.log(`\n🎉 Image download complete!`);
  console.log(`\nNext steps:`);
  console.log(`1. Review downloaded images in: ${OUTPUT_DIR}`);
  console.log(`2. Run: node scripts/update-inspiration-with-real-data.js`);
  console.log(`\n💡 Tips:`);
  console.log(`- Placeholder backups are in: ${path.join(OUTPUT_DIR, '_placeholder_backup')}`);
  console.log(`- You can manually replace any failed downloads`);
  console.log(`- Consider optimizing images for web if they're large`);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  downloadCollectionImages,
  downloadNftImage
};