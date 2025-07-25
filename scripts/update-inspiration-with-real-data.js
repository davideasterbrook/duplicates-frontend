const fs = require('fs');
const path = require('path');

// Configuration
const INPUT_DIR = path.join(__dirname, '..', 'fetched-nft-data');
const COMBINED_FILE = path.join(INPUT_DIR, 'all-collections.json');
const OUTPUT_FILE = path.join(__dirname, '..', 'src', 'data', 'inspirationNfts.ts');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'inspiration-nfts');

// Helper function to find downloaded image for a token
function findImageForToken(collectionFolder, tokenId) {
  const collectionPath = path.join(IMAGES_DIR, collectionFolder);
  
  if (!fs.existsSync(collectionPath)) {
    return `/inspiration-nfts/${collectionFolder}/${tokenId}.svg`; // Fallback to placeholder
  }
  
  const files = fs.readdirSync(collectionPath);
  const imageFile = files.find(file => 
    file.startsWith(tokenId + '.') && 
    (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || 
     file.endsWith('.gif') || file.endsWith('.webp') || file.endsWith('.svg'))
  );
  
  return imageFile 
    ? `/inspiration-nfts/${collectionFolder}/${imageFile}`
    : `/inspiration-nfts/${collectionFolder}/${tokenId}.svg`; // Fallback to placeholder
}

// Helper function to sanitize description for TypeScript
function sanitizeDescription(description) {
  if (!description) return '';
  
  return description
    .replace(/\\/g, '\\\\') // Escape backslashes first
    .replace(/'/g, "\\'") // Escape single quotes
    .replace(/"/g, '\\"') // Escape double quotes
    .replace(/\n/g, ' ') // Replace actual newlines with spaces
    .replace(/\r/g, ' ') // Replace carriage returns with spaces
    .replace(/\\n/g, ' ') // Replace escaped newlines with spaces
    .replace(/\\r/g, ' ') // Replace escaped carriage returns
    .replace(/\t/g, ' ') // Replace tabs with spaces
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim()
    .substring(0, 200); // Limit length to prevent overly long descriptions
}

// Helper function to format attributes
function formatAttributes(attributes) {
  if (!attributes || !Array.isArray(attributes)) return [];
  
  return attributes
    .filter(attr => attr.trait_type && attr.value !== null && attr.value !== undefined)
    .map(attr => ({
      trait_type: sanitizeDescription(attr.trait_type),
      value: sanitizeDescription(String(attr.value))
    }))
    .slice(0, 8); // Limit to 8 attributes to keep it manageable
}

// Function to convert fetched NFT data to inspiration format
function convertToInspirationFormat(fetchedCollections) {
  return fetchedCollections.map(collection => {
    const nfts = collection.nfts.map(nft => {
      const imagePath = findImageForToken(collection.folder, nft.tokenId);
      
      return {
        tokenId: nft.tokenId,
        name: sanitizeDescription(nft.name || `${collection.name} #${nft.tokenId}`),
        image: imagePath,
        rarity: "Rare", // Default rarity - could be enhanced with rarity data
        staticMetadata: {
          description: sanitizeDescription(nft.description || `A unique NFT from the ${collection.name} collection.`),
          attributes: formatAttributes(nft.attributes)
        }
      };
    });
    
    return {
      name: collection.name,
      description: sanitizeDescription(collection.description || `A premier NFT collection on Ethereum.`),
      contractAddress: collection.contractAddress,
      totalSupply: collection.totalSupply || "10,000",
      chain: "ethereum",
      nfts
    };
  });
}

// Function to generate TypeScript file content
function generateTypescriptContent(inspirationData) {
  const collectionsCode = inspirationData.map(collection => {
    const nftsCode = collection.nfts.map(nft => `    {
      tokenId: "${nft.tokenId}",
      name: "${nft.name}",
      image: "${nft.image}",
      rarity: "${nft.rarity}",
      staticMetadata: {
        description: "${nft.staticMetadata.description}",
        attributes: [${nft.staticMetadata.attributes.map(attr => 
          `\n          { trait_type: "${attr.trait_type}", value: "${attr.value}" }`
        ).join(',')}
        ]
      }
    }`).join(',\n');
    
    return `  {
    name: "${collection.name}",
    description: "${collection.description}",
    contractAddress: "${collection.contractAddress}",
    totalSupply: "${collection.totalSupply}",
    chain: "${collection.chain}",
    nfts: [
${nftsCode}
    ]
  }`;
  }).join(',\n');

  return `export interface InspirationNft {
  tokenId: string;
  name: string;
  image: string;
  description?: string;
  rarity?: string;
  lastSale?: string;
  // Static metadata (always available)
  staticMetadata: {
    description: string;
    attributes?: Array<{
      trait_type: string;
      value: string | number;
    }>;
  };
}

export interface InspirationCollection {
  name: string;
  description: string;
  contractAddress: string;
  // Static data (always available)
  totalSupply: string;
  chain: 'ethereum' | 'polygon' | 'base';
  // Dynamic data (fetched when wallet connected)
  floorPrice?: string;
  nfts: InspirationNft[];
}

export const inspirationCollections: InspirationCollection[] = [
${collectionsCode}
];

// Helper function to get all NFTs for use in examples
export const getAllInspirationNfts = (): InspirationNft[] => {
  return inspirationCollections.flatMap(collection => 
    collection.nfts.map(nft => ({
      ...nft,
      // Add collection context
      description: nft.staticMetadata.description,
    }))
  );
};

// Helper function to get NFTs by collection
export const getNftsByCollection = (contractAddress: string): InspirationNft[] => {
  const collection = inspirationCollections.find(
    c => c.contractAddress.toLowerCase() === contractAddress.toLowerCase()
  );
  return collection?.nfts || [];
};

// Helper function to get collection info
export const getCollectionInfo = (contractAddress: string): InspirationCollection | undefined => {
  return inspirationCollections.find(
    c => c.contractAddress.toLowerCase() === contractAddress.toLowerCase()
  );
};`;
}

// Function to remove CryptoPunks from existing data (since it's not ERC-721 compatible)
function removeCryptoPunks() {
  const cryptoPunksDir = path.join(IMAGES_DIR, 'cryptopunks');
  if (fs.existsSync(cryptoPunksDir)) {
    console.log('🗑️  Removing CryptoPunks directory (non-ERC721 compatible)...');
    fs.rmSync(cryptoPunksDir, { recursive: true, force: true });
  }
}

// Function to create backup of existing file
function backupExistingFile() {
  if (fs.existsSync(OUTPUT_FILE)) {
    const backupFile = OUTPUT_FILE.replace('.ts', '_backup.ts');
    fs.copyFileSync(OUTPUT_FILE, backupFile);
    console.log(`📋 Backed up existing file to: ${backupFile}`);
  }
}

// Function to validate generated data
function validateData(inspirationData) {
  console.log('🔍 Validating generated data...');
  
  let totalNfts = 0;
  let errors = [];
  
  for (const collection of inspirationData) {
    if (!collection.name) errors.push(`Collection missing name: ${collection.contractAddress}`);
    if (!collection.contractAddress) errors.push(`Collection missing contract address`);
    if (!collection.nfts || collection.nfts.length === 0) {
      errors.push(`Collection ${collection.name} has no NFTs`);
    }
    
    for (const nft of collection.nfts || []) {
      if (!nft.tokenId) errors.push(`NFT missing tokenId in ${collection.name}`);
      if (!nft.name) errors.push(`NFT missing name: ${collection.name}#${nft.tokenId}`);
      if (!nft.image) errors.push(`NFT missing image: ${collection.name}#${nft.tokenId}`);
      if (!nft.staticMetadata?.description) {
        errors.push(`NFT missing description: ${collection.name}#${nft.tokenId}`);
      }
      totalNfts++;
    }
  }
  
  console.log(`📊 Validation Results:`);
  console.log(`  Collections: ${inspirationData.length}`);
  console.log(`  Total NFTs: ${totalNfts}`);
  console.log(`  Errors: ${errors.length}`);
  
  if (errors.length > 0) {
    console.log(`\n⚠️  Validation Errors:`);
    errors.forEach(error => console.log(`  - ${error}`));
  }
  
  return errors.length === 0;
}

// Main function
async function main() {
  console.log('🔄 Updating inspiration data with real NFT data...');
  
  // Check if fetched data exists
  if (!fs.existsSync(COMBINED_FILE)) {
    console.error(`❌ Fetched data not found: ${COMBINED_FILE}`);
    console.log('Please run: node scripts/fetch-nft-metadata.js first');
    process.exit(1);
  }
  
  // Load fetched data
  const fetchedData = JSON.parse(fs.readFileSync(COMBINED_FILE, 'utf8'));
  console.log(`📊 Loaded ${fetchedData.collections.length} collections with ${fetchedData.totalNfts} NFTs`);
  
  // Remove CryptoPunks
  removeCryptoPunks();
  
  // Convert to inspiration format
  const inspirationData = convertToInspirationFormat(fetchedData.collections);
  
  // Validate data
  if (!validateData(inspirationData)) {
    console.error('❌ Data validation failed. Please check the errors above.');
    process.exit(1);
  }
  
  // Backup existing file
  backupExistingFile();
  
  // Generate TypeScript content
  const typescriptContent = generateTypescriptContent(inspirationData);
  
  // Write new file
  fs.writeFileSync(OUTPUT_FILE, typescriptContent);
  console.log(`✅ Updated inspiration data: ${OUTPUT_FILE}`);
  
  // Generate summary
  const summary = {
    updatedAt: new Date().toISOString(),
    collections: inspirationData.length,
    totalNfts: inspirationData.reduce((sum, col) => sum + col.nfts.length, 0),
    collectionsUpdated: inspirationData.map(col => ({
      name: col.name,
      contract: col.contractAddress,
      nfts: col.nfts.length,
      hasRealImages: col.nfts.some(nft => !nft.image.endsWith('.svg'))
    }))
  };
  
  const summaryFile = path.join(INPUT_DIR, 'update-summary.json');
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2));
  
  console.log(`\n📊 Update Summary:`);
  console.log(`  📁 Collections: ${summary.collections}`);
  console.log(`  🖼️  Total NFTs: ${summary.totalNfts}`);
  console.log(`  🎨 Real Images: ${summary.collectionsUpdated.filter(c => c.hasRealImages).length} collections`);
  console.log(`  💾 Summary saved: ${summaryFile}`);
  
  console.log(`\n🎉 Inspiration data update complete!`);
  console.log(`\nNext steps:`);
  console.log(`1. Test the application: pnpm run dev`);
  console.log(`2. Check that images load correctly`);
  console.log(`3. Verify metadata displays properly`);
  console.log(`\n💡 Note: CryptoPunks was removed due to non-standard ERC721 implementation`);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  convertToInspirationFormat,
  generateTypescriptContent
};