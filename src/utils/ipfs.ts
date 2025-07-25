/**
 * IPFS utility functions for handling NFT metadata and images
 */

// Cache for failed requests to prevent retrying
const failedRequestsCache = new Map<string, { timestamp: number; error: string }>();
const FAILED_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Cache for successful metadata to reduce redundant requests
const metadataCache = new Map<string, { data: any; timestamp: number }>();
const METADATA_CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/'
];

/**
 * Convert IPFS URL to HTTP URL using gateway
 */
export function ipfsToHttp(ipfsUrl: string, gatewayIndex: number = 0): string {
  if (!ipfsUrl) return '';
  
  // Already an HTTP URL
  if (ipfsUrl.startsWith('http')) {
    return ipfsUrl;
  }
  
  // Handle ipfs:// protocol
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `${IPFS_GATEWAYS[gatewayIndex]}${hash}`;
  }
  
  // Handle raw IPFS hash
  if (ipfsUrl.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/)) {
    return `${IPFS_GATEWAYS[gatewayIndex]}${ipfsUrl}`;
  }
  
  return ipfsUrl;
}

/**
 * Clear expired cache entries
 */
function clearExpiredCache() {
  const now = Date.now();
  
  // Clear expired failed requests
  for (const [key, value] of failedRequestsCache.entries()) {
    if (now - value.timestamp > FAILED_CACHE_TTL) {
      failedRequestsCache.delete(key);
    }
  }
  
  // Clear expired metadata
  for (const [key, value] of metadataCache.entries()) {
    if (now - value.timestamp > METADATA_CACHE_TTL) {
      metadataCache.delete(key);
    }
  }
}

/**
 * Fetch data from IPFS with fallback gateways and caching
 */
export async function fetchFromIpfs(ipfsUrl: string): Promise<any> {
  if (!ipfsUrl) {
    throw new Error('No IPFS URL provided');
  }

  // Clean expired cache entries occasionally
  if (Math.random() < 0.1) {
    clearExpiredCache();
  }

  // Check if this URL recently failed
  const cachedFailure = failedRequestsCache.get(ipfsUrl);
  if (cachedFailure && Date.now() - cachedFailure.timestamp < FAILED_CACHE_TTL) {
    throw new Error(`Cached failure: ${cachedFailure.error}`);
  }

  // Check if we have cached metadata
  const cachedMetadata = metadataCache.get(ipfsUrl);
  if (cachedMetadata && Date.now() - cachedMetadata.timestamp < METADATA_CACHE_TTL) {
    return cachedMetadata.data;
  }

  let lastError: Error | null = null;

  // Try each gateway
  for (let i = 0; i < IPFS_GATEWAYS.length; i++) {
    try {
      const httpUrl = ipfsToHttp(ipfsUrl, i);
      const response = await fetch(httpUrl, {
        signal: AbortSignal.timeout(5000), // Reduced to 5 seconds for faster failure
        headers: {
          'Accept': 'application/json, text/plain, */*',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let data;
      
      // Handle JSON metadata
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else if (contentType?.includes('text/')) {
        // Handle text content
        data = await response.text();
      } else {
        // Default to JSON parsing
        data = await response.json();
      }
      
      // Cache successful result
      metadataCache.set(ipfsUrl, { data, timestamp: Date.now() });
      
      // Remove from failed cache if it was there
      failedRequestsCache.delete(ipfsUrl);
      
      return data;
      
    } catch (error) {
      lastError = error as Error;
      // Only log the first gateway failure to reduce noise
      if (i === 0) {
        console.warn(`Failed to fetch from IPFS URL: ${ipfsUrl}`, error);
      }
      continue;
    }
  }

  // Cache the failure to prevent retrying soon
  const errorMessage = lastError?.message || 'All IPFS gateways failed';
  failedRequestsCache.set(ipfsUrl, { 
    timestamp: Date.now(), 
    error: errorMessage 
  });

  throw lastError || new Error('All IPFS gateways failed');
}

/**
 * Extract image URL from NFT metadata
 */
export function extractImageFromMetadata(metadata: any): string {
  if (!metadata || typeof metadata !== 'object') {
    return '';
  }

  // Try common image field names
  const imageFields = ['image', 'image_url', 'imageUrl', 'animation_url'];
  
  for (const field of imageFields) {
    if (metadata[field]) {
      return metadata[field];
    }
  }

  return '';
}

/**
 * Check if string is base64 encoded image
 */
export function isBase64Image(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  
  const base64ImageRegex = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/;
  return base64ImageRegex.test(str);
}

/**
 * Validate and sanitize image URL
 */
export function sanitizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  // If it's base64, return as-is
  if (isBase64Image(url)) {
    return url;
  }
  
  // If it's IPFS, convert to HTTP
  if (url.startsWith('ipfs://') || url.match(/^Qm[1-9A-HJ-NP-Za-km-z]{44}$/)) {
    return ipfsToHttp(url);
  }
  
  // If it's already HTTP/HTTPS, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  return '';
} 