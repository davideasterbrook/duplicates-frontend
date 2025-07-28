/**
 * LRU Cache implementation for efficient memory management
 */

interface CacheItem<T> {
  value: T;
  timestamp: number;
  accessTime: number;
}

export class LRUCache<T> {
  private cache = new Map<string, CacheItem<T>>();
  private maxSize: number;
  private ttl: number;

  constructor(maxSize = 100, ttl = 10 * 60 * 1000) { // Default: 100 items, 10 min TTL
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  set(key: string, value: T): void {
    const now = Date.now();
    
    // If key exists, update it
    if (this.cache.has(key)) {
      this.cache.set(key, { value, timestamp: now, accessTime: now });
      return;
    }

    // If at capacity, remove least recently used item
    if (this.cache.size >= this.maxSize) {
      this.evictLRU();
    }
    
    this.cache.set(key, { value, timestamp: now, accessTime: now });
  }

  get(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    const now = Date.now();
    
    // Check if expired
    if (now - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    // Update access time for LRU tracking
    item.accessTime = now;
    this.cache.set(key, item);
    
    return item.value;
  }

  has(key: string): boolean {
    const item = this.cache.get(key);
    if (!item) return false;
    
    // Check if expired
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }

  private evictLRU(): void {
    let oldestKey: string | null = null;
    let oldestTime = Date.now();
    
    for (const [key, item] of this.cache.entries()) {
      if (item.accessTime < oldestTime) {
        oldestTime = item.accessTime;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  // Get cache statistics for debugging
  getStats() {
    const now = Date.now();
    let expired = 0;
    
    for (const item of this.cache.values()) {
      if (now - item.timestamp > this.ttl) {
        expired++;
      }
    }
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      expired,
      ttl: this.ttl
    };
  }
}

// Create singleton instances for different cache types
export const metadataCache = new LRUCache<Record<string, unknown>>(200, 10 * 60 * 1000); // 200 items, 10 min
export const failedRequestsCache = new LRUCache<{ error: string }>(100, 5 * 60 * 1000); // 100 items, 5 min
export const imageCache = new LRUCache<string>(500, 30 * 60 * 1000); // 500 items, 30 min