const fs = require('fs');
const path = require('path');
const https = require('https');

// Collections to fetch (excluding CryptoPunks due to non-standard contract)
const collections = [
  {
    name: "Bored Ape Yacht Club",
    contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
    slug: "boredapeyachtclub",
    tokens: ["1", "2087", "8817", "232", "5809"],
    folder: "bayc"
  },
  {
    name: "Pudgy Penguins",
    contractAddress: "0xBd3531dA5CF5857e7CfAA92426877b022e612cf8",
    slug: "pudgypenguins",
    tokens: ["6873", "3950", "6570", "5678", "484"],
    folder: "pudgy-penguins"
  },
  {
    name: "Doodles",
    contractAddress: "0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e",
    slug: "doodles-official",
    tokens: ["6914", "316", "1099", "9243", "2238"],
    folder: "doodles"
  },
  {
    name: "LilPudgys",
    contractAddress: "0x524cab2ec69124574082676e6f654a18df49a048",
    slug: "lilpudgys",
    tokens: ["16343", "21396", "5447", "10369", "19779"],
    folder: "lilpudgys"
  },
  {
    name: "Opepen Edition",
    contractAddress: "0x6339e5e072086621540d0362c4e3cea0d643e114",
    slug: "opepen-edition",
    tokens: ["14468", "8625", "151", "12292", "3634"],
    folder: "opepen-edition"
  },
  {
    name: "Cool Cats",
    contractAddress: "0x1a92f7381b9f03921564a437210bb9396471050c",
    slug: "cool-cats-nft",
    tokens: ["500", "6972", "1490", "4695", "2288"],
    folder: "cool-cats"
  },
  {
    name: "Azuki",
    contractAddress: "0xED5AF388653567Af2F388E6224dC7C4b3241C544",
    slug: "azuki",
    tokens: ["40", "7301", "9605", "2174", "4666"],
    folder: "azuki"
  },
  {
    name: "CloneX",
    contractAddress: "0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B",
    slug: "clonex",
    tokens: ["18276", "16775", "1", "17036", "3"],
    folder: "clonex"
  },
  {
    name: "Otherdeeds for Otherside",
    contractAddress: "0x34d85c9CDeB23FA97cb08333b511ac86E1C4E258",
    slug: "otherdeeds-for-otherside",
    tokens: ["1890", "54421", "55171", "134", "60401"],
    folder: "otherdeeds"
  },
  {
    name: "World of Women",
    contractAddress: "0xe785E82358879F061BC3dcAC6f0444462D4b5330",
    slug: "world-of-women-nft",
    tokens: ["1460", "6025", "5672", "977", "2701"],
    folder: "world-of-women"
  }
];

// Configuration
const RPC_URL = process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY';
const OPENSEA_API_KEY = process.env.OPENSEA_API_KEY || '';
const OUTPUT_DIR = path.join(__dirname, '..', 'fetched-nft-data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Helper function to make HTTP requests
function fetchJson(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'NFT-Fetcher/1.0',
        ...headers
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse JSON from ${url}: ${e.message}`));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to convert IPFS URL to HTTP gateway URL
function convertIpfsUrl(ipfsUrl) {
  if (!ipfsUrl) return null;
  
  if (ipfsUrl.startsWith('ipfs://')) {
    return ipfsUrl.replace('ipfs://', 'https://ipfs.io/ipfs/');
  }
  
  if (ipfsUrl.includes('/ipfs/')) {
    return `https://ipfs.io/ipfs/${ipfsUrl.split('/ipfs/')[1]}`;
  }
  
  return ipfsUrl;
}

// Function to fetch NFT metadata using OpenSea API
async function fetchNftFromOpenSea(contractAddress, tokenId) {
  const url = `https://api.opensea.io/api/v2/chain/ethereum/contract/${contractAddress}/nfts/${tokenId}`;
  const headers = OPENSEA_API_KEY ? { 'X-API-KEY': OPENSEA_API_KEY } : {};
  
  console.log(`Fetching from OpenSea: ${contractAddress}/${tokenId}`);
  
  try {
    const data = await fetchJson(url, headers);
    const nft = data.nft || data; // Handle both v1 and v2 response formats
    
    return {
      name: nft.name,
      description: nft.description,
      image: convertIpfsUrl(nft.image_url || nft.image),
      imageOriginal: nft.image_url || nft.image,
      attributes: nft.traits?.map(trait => ({
        trait_type: trait.trait_type,
        value: trait.value
      })) || [],
      tokenId: tokenId,
      contractAddress: contractAddress,
      permalink: nft.permalink
    };
  } catch (error) {
    console.error(`Failed to fetch from OpenSea ${contractAddress}/${tokenId}:`, error.message);
    return null;
  }
}

// Function to fetch metadata directly from tokenURI
async function fetchNftFromContract(contractAddress, tokenId) {
  console.log(`Fetching from contract: ${contractAddress}/${tokenId}`);
  
  try {
    // This would require web3 integration to call the contract
    // For now, we'll use a mock implementation that tries common metadata patterns
    
    // Many contracts use predictable tokenURI patterns
    const commonPatterns = [
      `https://api.opensea.io/api/v1/metadata/${contractAddress}/${tokenId}`,
      `https://${contractAddress.slice(2)}.api.token.com/${tokenId}`,
      `ipfs://QmYQC5aGZu2PTH77XUC9fYhfk1jGBEXnENj7b9eMj1RtLz/${tokenId}`
    ];
    
    for (const pattern of commonPatterns) {
      try {
        const data = await fetchJson(convertIpfsUrl(pattern));
        return {
          name: data.name,
          description: data.description,
          image: convertIpfsUrl(data.image),
          imageOriginal: data.image,
          attributes: data.attributes || [],
          tokenId: tokenId,
          contractAddress: contractAddress
        };
      } catch (e) {
        // Try next pattern
        continue;
      }
    }
    
    throw new Error('No working metadata patterns found');
  } catch (error) {
    console.error(`Failed to fetch from contract ${contractAddress}/${tokenId}:`, error.message);
    return null;
  }
}

// Function to fetch all NFTs for a collection
async function fetchCollectionNfts(collection) {
  console.log(`\n📦 Fetching ${collection.name}...`);
  
  const nfts = [];
  
  for (const tokenId of collection.tokens) {
    console.log(`  Fetching token ${tokenId}...`);
    
    // Try OpenSea first, then contract
    let nftData = await fetchNftFromOpenSea(collection.contractAddress, tokenId);
    
    if (!nftData) {
      nftData = await fetchNftFromContract(collection.contractAddress, tokenId);
    }
    
    if (nftData) {
      nfts.push(nftData);
      console.log(`  ✅ Successfully fetched ${nftData.name}`);
    } else {
      console.log(`  ❌ Failed to fetch token ${tokenId}`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Save collection data
  const collectionData = {
    ...collection,
    nfts: nfts,
    fetchedAt: new Date().toISOString()
  };
  
  const filename = path.join(OUTPUT_DIR, `${collection.folder}.json`);
  fs.writeFileSync(filename, JSON.stringify(collectionData, null, 2));
  console.log(`💾 Saved ${nfts.length} NFTs to ${filename}`);
  
  return collectionData;
}

// Main function
async function main() {
  console.log('🚀 Starting NFT metadata fetch...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  
  if (!OPENSEA_API_KEY) {
    console.log('⚠️  No OpenSea API key provided. Some requests may be rate limited.');
    console.log('   Set OPENSEA_API_KEY environment variable for better results.');
  }
  
  const allCollections = [];
  
  for (const collection of collections) {
    try {
      const collectionData = await fetchCollectionNfts(collection);
      allCollections.push(collectionData);
    } catch (error) {
      console.error(`❌ Failed to fetch collection ${collection.name}:`, error.message);
    }
  }
  
  // Save combined data
  const combinedData = {
    collections: allCollections,
    fetchedAt: new Date().toISOString(),
    totalNfts: allCollections.reduce((sum, col) => sum + col.nfts.length, 0)
  };
  
  const combinedFilename = path.join(OUTPUT_DIR, 'all-collections.json');
  fs.writeFileSync(combinedFilename, JSON.stringify(combinedData, null, 2));
  
  console.log(`\n🎉 Fetch complete!`);
  console.log(`📊 Fetched ${combinedData.totalNfts} NFTs from ${allCollections.length} collections`);
  console.log(`💾 Data saved to: ${combinedFilename}`);
  console.log(`\nNext steps:`);
  console.log(`1. Run: node scripts/download-images.js`);
  console.log(`2. Run: node scripts/update-inspiration-with-real-data.js`);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  fetchCollectionNfts,
  collections
};