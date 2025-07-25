# NFT Data Fetching Scripts

This directory contains scripts to fetch real NFT metadata and images to replace the placeholder data in the inspiration system.

## 🚀 Quick Start

```bash
# 1. Set up environment variables (optional but recommended)
export OPENSEA_API_KEY="your_opensea_api_key_here"
export ETHEREUM_RPC_URL="https://mainnet.infura.io/v3/your_infura_key"

# 2. Fetch NFT metadata
node scripts/fetch-nft-metadata.js

# 3. Download NFT images
node scripts/download-images.js

# 4. Update inspiration data with real data
node scripts/update-inspiration-with-real-data.js

# 5. Test the application
pnpm run dev
```

## 📋 Scripts Overview

### 1. `fetch-nft-metadata.js`
**Purpose**: Fetches NFT metadata from OpenSea API and contract calls
- Fetches metadata for 9 top ERC-721 collections (CryptoPunks excluded)
- Supports both OpenSea API and direct contract calls
- Saves data to `fetched-nft-data/` directory
- Includes rate limiting and error handling

**Collections Included**:
- Bored Ape Yacht Club
- Pudgy Penguins  
- Doodles
- LilPudgys
- Opepen Edition
- Cool Cats
- Azuki
- CloneX
- Art Blocks Curated
- Otherdeeds for Otherside
- World of Women

### 2. `download-images.js`
**Purpose**: Downloads NFT images from IPFS/HTTP URLs
- Downloads high-quality images for each NFT
- Supports multiple image formats (JPG, PNG, GIF, WebP, SVG)
- Creates backups of placeholder images
- Includes progress tracking and retry logic
- Generates download reports

### 3. `update-inspiration-with-real-data.js`
**Purpose**: Updates the TypeScript inspiration data with real metadata
- Converts fetched data to inspiration format
- Updates image paths to downloaded files
- Validates data integrity
- Creates backups of existing files
- Generates TypeScript with proper escaping

### 4. Helper Scripts
- `generate-placeholder-images.js` - Creates SVG placeholders
- `update-inspiration-data.js` - Updates data structure (legacy)

## 🔧 Configuration

### Environment Variables
```bash
# OpenSea API (recommended for better rate limits)
OPENSEA_API_KEY=your_api_key_here

# Ethereum RPC (for direct contract calls)
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your_key

# Alternative RPC providers
ETHEREUM_RPC_URL=https://eth-mainnet.alchemyapi.io/v2/your_key
```

### API Keys Setup
1. **OpenSea API**: Register at https://docs.opensea.io/reference/api-keys
2. **Infura**: Sign up at https://infura.io/
3. **Alchemy**: Sign up at https://www.alchemy.com/

## 📁 Directory Structure

```
scripts/
├── fetch-nft-metadata.js     # Fetch metadata from APIs
├── download-images.js         # Download NFT images  
├── update-inspiration-with-real-data.js  # Update TypeScript data
├── generate-placeholder-images.js        # Create SVG placeholders
└── README.md                  # This file

fetched-nft-data/             # Generated data (gitignored)
├── all-collections.json      # Combined metadata
├── bayc.json                 # Individual collection data
├── pudgy-penguins.json
├── download-report.json      # Download statistics
└── update-summary.json       # Update summary

public/inspiration-nfts/      # Final image directory
├── _placeholder_backup/      # Backup of SVG placeholders
├── bayc/                     # Real BAYC images
├── pudgy-penguins/           # Real Pudgy images
└── ...                       # Other collections
```

## ⚠️ Important Notes

### CryptoPunks Exclusion
CryptoPunks has been **excluded** from the fetching scripts because:
- Uses a pre-ERC721 custom contract
- No standard `tokenURI` function
- Different metadata structure (`punkImageSvg`, custom attributes)
- Would require special handling that's incompatible with your Duplicates contract

If you need CryptoPunks support:
1. Your Duplicates contract would need special handling for non-ERC721 contracts
2. Or implement a wrapper that provides ERC721-like interface

### Rate Limiting
- OpenSea API: 5 requests/second without key, 200/min with key
- IPFS gateways: Can be slow, includes retry logic
- Script includes 1-2 second delays between requests

### Error Handling
- Failed downloads fallback to placeholder images
- Metadata failures are logged and skipped
- Partial failures don't stop the entire process
- All errors are logged to console and reports

## 🛠️ Troubleshooting

### Common Issues

**1. "No OpenSea API key" warning**
```bash
# Solution: Set API key
export OPENSEA_API_KEY=your_key_here
```

**2. Image download timeouts**
```bash
# Solution: Run download script again - it skips existing files
node scripts/download-images.js
```

**3. IPFS URLs not loading**
```bash
# The script tries multiple IPFS gateways:
# - ipfs.io
# - gateway.pinata.cloud  
# - cloudflare-ipfs.com
```

**4. Metadata fetch failures**
```bash
# Check the generated reports:
cat fetched-nft-data/download-report.json
cat fetched-nft-data/update-summary.json
```

### Manual Fixes

**Replace failed images manually**:
```bash
# Download image manually
curl "https://ipfs.io/ipfs/QmYourImageHash" -o public/inspiration-nfts/bayc/1.jpg

# Or copy from backup
cp public/inspiration-nfts/_placeholder_backup/bayc/1.svg public/inspiration-nfts/bayc/1.svg
```

**Update specific collection**:
```javascript
// Edit fetch-nft-metadata.js and comment out collections you don't want to re-fetch
const collections = [
  // { name: "Bored Ape Yacht Club", ... }, // Skip this one
  { name: "Pudgy Penguins", ... }, // Only fetch this one
];
```

## 🚀 Advanced Usage

### Custom Collections
Add your own collections to `fetch-nft-metadata.js`:
```javascript
const collections = [
  // ... existing collections
  {
    name: "Your Custom Collection",
    contractAddress: "0xYourContractAddress",
    slug: "your-opensea-slug",
    tokens: ["1", "100", "500", "1000", "5000"],
    folder: "your-collection"
  }
];
```

### Image Optimization
The download script includes a placeholder for image optimization:
```javascript
// In download-images.js, enhance the optimizeImage function:
async function optimizeImage(imagePath) {
  // Add sharp integration for compression
  const sharp = require('sharp');
  await sharp(imagePath)
    .resize(400, 400, { fit: 'inside' })
    .jpeg({ quality: 85 })
    .toFile(imagePath.replace(/\.[^.]+$/, '.jpg'));
}
```

### Batch Processing
Process specific collections only:
```bash
# Edit the scripts to filter collections
node -e "
const script = require('./scripts/fetch-nft-metadata.js');
const bayc = script.collections.find(c => c.folder === 'bayc');
script.fetchCollectionNfts(bayc);
"
```

## 📊 Expected Results

After running all scripts successfully:
- **45+ real NFT images** downloaded (5 per collection × 9 collections)
- **Complete metadata** with descriptions and attributes
- **Backup system** preserving original placeholders
- **Updated TypeScript** with real data
- **Detailed reports** of what was fetched/downloaded

The inspiration system will then display real NFT images and metadata while maintaining the fast, offline-first experience!