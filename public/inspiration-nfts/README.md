# Inspiration NFT Images

This directory contains locally cached images for inspiration NFTs to improve loading performance and provide offline access.

## Directory Structure

```
inspiration-nfts/
├── bayc/
│   ├── 1.jpg
│   ├── 2087.jpg
│   ├── 8817.jpg
│   ├── 232.jpg
│   └── 5809.jpg
├── pudgy-penguins/
│   ├── 6873.jpg
│   ├── 1.jpg
│   ├── 8888.jpg
│   ├── 1234.jpg
│   └── 5555.jpg
├── doodles/
│   ├── 6914.jpg
│   ├── 1.jpg
│   ├── 5000.jpg
│   ├── 2468.jpg
│   └── 7777.jpg
├── cryptopunks/
│   ├── 7523.png
│   ├── 5822.png
│   ├── 1.png
│   ├── 8348.png
│   └── 4156.png
├── moonbirds/
│   ├── 1.jpg
│   ├── 2642.jpg
│   ├── 5000.jpg
│   ├── 7654.jpg
│   └── 9999.jpg
├── azuki/
│   ├── 40.jpg
│   ├── 1.jpg
│   ├── 3000.jpg
│   ├── 5678.jpg
│   └── 8888.jpg
├── clonex/
│   ├── 1.jpg
│   ├── 3739.jpg
│   ├── 10000.jpg
│   ├── 15555.jpg
│   └── 19999.jpg
├── art-blocks/
│   ├── 13000.jpg
│   ├── 78000.jpg
│   ├── 125000.jpg
│   ├── 56000.jpg
│   └── 189000.jpg
├── otherdeeds/
│   ├── 1.jpg
│   ├── 100000.jpg
│   ├── 42069.jpg
│   ├── 50000.jpg
│   └── 77777.jpg
└── world-of-women/
    ├── 1.jpg
    ├── 7777.jpg
    ├── 5000.jpg
    ├── 2468.jpg
    └── 9876.jpg
```

## How to Add Real Images

1. Download the actual NFT images from their IPFS/metadata URLs
2. Save them in the appropriate collection folder with the token ID as filename
3. Update the `inspirationNfts.ts` file to use the local paths
4. Supported formats: JPG, PNG, GIF, WebP, SVG

## Image Optimization

- Images should be optimized for web (compressed but high quality)
- Recommended size: 400x400px to 800x800px
- Use WebP format when possible for better compression

## Fallback System

If local images are missing, the system will fall back to the original IPFS URLs, but this requires internet connectivity and may be slower.