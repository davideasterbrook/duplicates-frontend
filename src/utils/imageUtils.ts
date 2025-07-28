/**
 * Image utilities for rotating example images and handling image loading
 */

import { getConfiguredImages } from './imageConfig';

export interface ExampleImage {
  src: string;
  alt: string;
  name: string;
  filename?: string;
  description?: string;
}

/**
 * Get example images from simple configuration
 * Much simpler than API - just update imageConfig.ts when you add new images!
 */
export function getExampleImages(): ExampleImage[] {
  try {
    const images = getConfiguredImages();
    
    if (images.length === 0) {
      // No example images configured, using fallback
      return getFallbackImages();
    }

    return images;

  } catch {
    // Failed to load configured images - using fallback
    return getFallbackImages();
  }
}

/**
 * Get fallback images when no images are configured
 */
function getFallbackImages(): ExampleImage[] {
  return [
    {
      src: 'https://picsum.photos/400/400?random=1',
      alt: 'Placeholder NFT 1',
      name: 'Placeholder 1'
    },
    {
      src: 'https://picsum.photos/400/400?random=2',
      alt: 'Placeholder NFT 2', 
      name: 'Placeholder 2'
    },
    {
      src: 'https://picsum.photos/400/400?random=3',
      alt: 'Placeholder NFT 3',
      name: 'Placeholder 3'
    }
  ];
} 