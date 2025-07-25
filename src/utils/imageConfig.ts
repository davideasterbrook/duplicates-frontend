/**
 * Image configuration - simply add your image filenames here when you add new images
 */

export const imageConfig = [
  'example1.jpg',
  'example2.jpg',
  // Add more image filenames as you drag them into public/example-nft-images/
  // 'my-cool-nft.png',
  // 'another-image.gif',
];

export function getConfiguredImages() {
  return imageConfig.map((filename, index) => ({
    src: `/example-nft-images/${filename}`,
    alt: `Example NFT ${index + 1}`,
    name: filename.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '), // Remove extension and clean name
    filename
  }));
} 