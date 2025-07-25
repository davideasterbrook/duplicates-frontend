import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  onError?: () => void;
  onLoad?: () => void;
  preserveAspectRatio?: boolean;
  lazy?: boolean;
  maxRetries?: number;
}

// Cache for known bad image URLs to prevent retrying
const badImageCache = new Set<string>();
const IMAGE_CACHE_SIZE = 500;

export function ImageWithFallback({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '',
  onError,
  onLoad,
  preserveAspectRatio = false,
  lazy = true,
  maxRetries = 1
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageKey, setImageKey] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  
  useEffect(() => {
    // Check if this image is known to be bad
    if (badImageCache.has(src)) {
      setHasError(true);
      setIsLoading(false);
      if (fallbackSrc && !badImageCache.has(fallbackSrc)) {
        setImgSrc(fallbackSrc);
      }
      return;
    }
    
    // Reset state and force img remount when src changes
    setImgSrc(src);
    setHasError(false);
    setIsLoading(true);
    setRetryCount(0);
    setImageKey(prev => prev + 1); // Force img element to remount
  }, [src, fallbackSrc]);
  
  const handleError = () => {
    // Add to bad image cache
    badImageCache.add(imgSrc);
    
    // Limit cache size
    if (badImageCache.size > IMAGE_CACHE_SIZE) {
      const firstItem = badImageCache.values().next().value;
      if (firstItem !== undefined) {
        badImageCache.delete(firstItem);
      }
    }
    
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback if available and not already tried
    if (fallbackSrc && imgSrc !== fallbackSrc && !badImageCache.has(fallbackSrc)) {
      setImgSrc(fallbackSrc);
      setImageKey(prev => prev + 1); // Force remount for fallback
      setRetryCount(0);
    } else {
      onError?.();
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };
  
  if (hasError && (!fallbackSrc || imgSrc === fallbackSrc)) {
    return (
      <div className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }
  
  return (
    <img
      key={imageKey}
      src={imgSrc}
      alt={alt}
      className={`${preserveAspectRatio ? 'max-w-full max-h-full object-contain' : 'w-full h-full object-cover'} transition-opacity duration-300 ${className}`}
      onError={handleError}
      onLoad={handleLoad}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
    />
  );
} 