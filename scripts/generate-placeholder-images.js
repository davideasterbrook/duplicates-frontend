const fs = require('fs');
const path = require('path');

// Collection configurations
const collections = {
  'bayc': {
    name: 'BAYC',
    color: '#2D1B69',
    tokens: ['1', '2087', '8817', '232', '5809']
  },
  'pudgy-penguins': {
    name: 'Pudgy Penguin',
    color: '#87CEEB',
    tokens: ['6873', '1', '8888', '1234', '5555']
  },
  'doodles': {
    name: 'Doodle',
    color: '#FFB6C1',
    tokens: ['6914', '1', '5000', '2468', '7777']
  },
  'cryptopunks': {
    name: 'CryptoPunk',
    color: '#000000',
    tokens: ['7523', '5822', '1', '8348', '4156']
  },
  'lilpudgys': {
    name: 'Lil Pudgy',
    color: '#ff69b4',
    tokens: ['1', '2500', '5000', '7500', '10000']
  },
  'opepen-edition': {
    name: 'Opepen',
    color: '#4a90e2',
    tokens: ['1', '100', '500', '1000', '1500']
  },
  'cool-cats': {
    name: 'Cool Cat',
    color: '#ff6f61',
    tokens: ['1', '1000', '2000', '5000', '9000']
  },
  'azuki': {
    name: 'Azuki',
    color: '#ff6b35',
    tokens: ['40', '1', '3000', '5678', '8888']
  },
  'clonex': {
    name: 'CloneX',
    color: '#00d2ff',
    tokens: ['1', '3739', '10000', '15555', '19999']
  },
  'art-blocks': {
    name: 'Art Block',
    color: '#9c27b0',
    tokens: ['13000', '78000', '125000', '56000', '189000']
  },
  'otherdeeds': {
    name: 'Otherdeed',
    color: '#2e7d32',
    tokens: ['1', '100000', '42069', '50000', '77777']
  },
  'world-of-women': {
    name: 'WoW',
    color: '#e91e63',
    tokens: ['1', '7777', '5000', '2468', '9876']
  }
};

// Generate SVG placeholder
function generateSVG(collectionName, tokenId, color) {
  const displayName = `${collectionName} #${tokenId}`;
  
  return `<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${adjustBrightness(color, -20)};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="400" height="400" fill="url(#grad)"/>
  <rect x="50" y="50" width="300" height="300" rx="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
  <circle cx="200" cy="180" r="60" fill="rgba(255,255,255,0.2)"/>
  <circle cx="175" cy="160" r="8" fill="rgba(255,255,255,0.8)"/>
  <circle cx="225" cy="160" r="8" fill="rgba(255,255,255,0.8)"/>
  <path d="M 175 200 Q 200 220 225 200" stroke="rgba(255,255,255,0.8)" stroke-width="3" fill="none"/>
  <text x="200" y="280" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="18" font-weight="bold">${displayName}</text>
  <text x="200" y="310" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-family="Arial, sans-serif" font-size="12">Placeholder Image</text>
  <text x="200" y="330" text-anchor="middle" fill="rgba(255,255,255,0.5)" font-family="Arial, sans-serif" font-size="10">Replace with real NFT image</text>
</svg>`;
}

// Helper function to adjust color brightness
function adjustBrightness(color, amount) {
  const usePound = color[0] === '#';
  const col = usePound ? color.slice(1) : color;
  const num = parseInt(col, 16);
  let r = (num >> 16) + amount;
  let g = (num >> 8 & 0x00FF) + amount;
  let b = (num & 0x0000FF) + amount;
  r = r > 255 ? 255 : r < 0 ? 0 : r;
  g = g > 255 ? 255 : g < 0 ? 0 : g;
  b = b > 255 ? 255 : b < 0 ? 0 : b;
  return (usePound ? '#' : '') + (r << 16 | g << 8 | b).toString(16).padStart(6, '0');
}

// Generate all placeholder images
const baseDir = path.join(__dirname, '..', 'public', 'inspiration-nfts');

Object.entries(collections).forEach(([collectionKey, config]) => {
  const collectionDir = path.join(baseDir, collectionKey);
  
  // Ensure directory exists
  if (!fs.existsSync(collectionDir)) {
    fs.mkdirSync(collectionDir, { recursive: true });
  }
  
  config.tokens.forEach(tokenId => {
    const svgContent = generateSVG(config.name, tokenId, config.color);
    const filePath = path.join(collectionDir, `${tokenId}.svg`);
    
    // Only create if file doesn't exist (don't overwrite existing images)
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, svgContent);
      console.log(`Generated: ${collectionKey}/${tokenId}.svg`);
    } else {
      console.log(`Skipped: ${collectionKey}/${tokenId}.svg (already exists)`);
    }
  });
});

console.log('Placeholder image generation complete!');