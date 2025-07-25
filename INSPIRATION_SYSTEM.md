# Optimized Inspiration System

The inspiration system has been optimized to provide a fast, offline-capable experience with optional live market data when users connect their wallets.

## Key Features

### ✅ **Static-First Design**
- **Hardcoded images**: All NFT images are stored locally in `/public/inspiration-nfts/`
- **Hardcoded metadata**: Static NFT data (name, description, attributes) stored in `src/data/inspirationNfts.ts`
- **No wallet required**: Users can browse inspiration without connecting a wallet
- **Fast loading**: Images and metadata load instantly from local files

### ✅ **Dynamic Data Enhancement**
- **Live market data**: Floor prices, 24h volume, owner counts fetched when wallet connected
- **Mock data service**: Ready-to-replace service for real API integration
- **Progressive enhancement**: Shows static data first, enhances with live data when available

### ✅ **Performance Optimized**
- **Lazy loading**: Market data only fetched when needed
- **Caching**: Market data cached to avoid excessive API calls
- **Fallback system**: Local images with IPFS fallbacks if needed

## Directory Structure

```
public/inspiration-nfts/
├── README.md
├── bayc/
│   ├── 1.svg
│   ├── 2087.svg
│   ├── 8817.svg
│   ├── 232.svg
│   └── 5809.svg
├── pudgy-penguins/
├── doodles/
├── cryptopunks/
├── moonbirds/
├── azuki/
├── clonex/
├── art-blocks/
├── otherdeeds/
└── world-of-women/
```

## Components

### Data Layer
- **`src/data/inspirationNfts.ts`**: Static NFT data with local image paths
- **`src/services/nftMarketData.ts`**: Dynamic market data service (mock + production ready)
- **`src/hooks/useMarketData.ts`**: React hooks for managing market data state

### UI Components
- **`src/components/Inspiration.tsx`**: Main inspiration component with static/dynamic data
- **`src/components/MintingForm.tsx`**: Enhanced to accept prefilled inspiration data

## User Experience

### Without Wallet Connection
- Browse 10 collections with 50 featured NFTs
- View static metadata, descriptions, and attributes
- See placeholder market data
- Preview and select NFTs for copying
- Notice encouraging wallet connection for live data

### With Wallet Connection
- All static features plus:
- Live floor prices
- Real-time 24h volume
- Current owner counts
- Updated market statistics
- Enhanced collection information

## How to Replace Placeholder Images

1. **Download real NFT images** from IPFS or metadata URLs
2. **Optimize images** (recommend 400x400px, WebP format)
3. **Save with correct naming**: `{tokenId}.{extension}` in collection folder
4. **Images auto-load** - no code changes needed

Example:
```bash
# Replace placeholder with real image
cp downloaded-bayc-1.png public/inspiration-nfts/bayc/1.png
```

## How to Integrate Real Market Data

### Option 1: OpenSea API
```typescript
// Replace mock data in src/services/nftMarketData.ts
export async function fetchOpenSeaCollectionStats(slug: string) {
  const response = await fetch(\`https://api.opensea.io/api/v1/collection/\${slug}/stats\`, {
    headers: { 'X-API-KEY': process.env.OPENSEA_API_KEY }
  });
  // ... implement response handling
}
```

### Option 2: Reservoir API
```typescript
export async function fetchReservoirCollectionStats(contractAddress: string) {
  const response = await fetch(\`https://api.reservoir.tools/collections/v5?id=\${contractAddress}\`);
  // ... implement response handling
}
```

### Option 3: Custom API
Replace the mock data functions in `nftMarketData.ts` with your preferred API integration.

## Environment Variables

```bash
# .env.local
OPENSEA_API_KEY=your_opensea_api_key
RESERVOIR_API_KEY=your_reservoir_api_key
# Add other API keys as needed
```

## Performance Benefits

### Before Optimization
- ❌ Required internet connection for all images
- ❌ Slow loading from IPFS
- ❌ API calls for basic browsing
- ❌ No offline functionality

### After Optimization
- ✅ Instant loading from local files
- ✅ Works completely offline
- ✅ Smart API usage (only when wallet connected)
- ✅ Faster initial page load
- ✅ Better user experience

## Collections Included

1. **Bored Ape Yacht Club** - 5 featured apes
2. **Pudgy Penguins** - 5 featured penguins
3. **Doodles** - 5 featured doodles
4. **CryptoPunks** - 5 featured punks
5. **Moonbirds** - 5 featured birds
6. **Azuki** - 5 featured characters
7. **CloneX** - 5 featured clones
8. **Art Blocks Curated** - 5 featured generative pieces
9. **Otherdeeds for Otherside** - 5 featured lands
10. **World of Women** - 5 featured portraits

Total: **50 curated NFTs** from top collections

## Future Enhancements

- [ ] Add more collections
- [ ] Implement real API integrations
- [ ] Add price history charts
- [ ] Include trait rarity scores
- [ ] Add collection analytics
- [ ] Support multiple blockchains

## Development Commands

```bash
# Generate new placeholder images
node scripts/generate-placeholder-images.js

# Update inspiration data structure
node scripts/update-inspiration-data.js

# Test the system
pnpm run dev
```

The inspiration system now provides a premium experience that works offline and enhances with live data when appropriate!