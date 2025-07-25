import { useState, useEffect } from 'react';
import { ExampleImage, getExampleImages } from '@/utils/imageUtils';

/**
 * Hook for rotating through example images with dynamic loading
 */
export function useImageRotation(intervalMs: number = 3000, fallbackImages: ExampleImage[] = []) {
  const [images, setImages] = useState<ExampleImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load images on mount
  useEffect(() => {
    async function loadImages() {
      try {
        setIsLoadingImages(true);
        setError(null);
        
        const fetchedImages = await getExampleImages();
        
        if (fetchedImages.length === 0) {
          if (fallbackImages.length > 0) {
            setImages(fallbackImages);
            setIsLoaded(new Array(fallbackImages.length).fill(false));
            setCurrentIndex(0);
          } else {
            setError('No example images available');
          }
          return;
        }
        
        setImages(fetchedImages);
        setIsLoaded(new Array(fetchedImages.length).fill(false));
        setCurrentIndex(0);
        
      } catch (err) {
        console.error('Failed to load example images:', err);
        
        if (fallbackImages.length > 0) {
          setImages(fallbackImages);
          setIsLoaded(new Array(fallbackImages.length).fill(false));
          setCurrentIndex(0);
          setError(null);
        } else {
          setError('Failed to load example images');
          setImages([]);
          setIsLoaded([]);
        }
        
      } finally {
        setIsLoadingImages(false);
      }
    }
    
    loadImages();
  }, []);
  
  // Rotate images
  useEffect(() => {
    if (images.length === 0 || isLoadingImages) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, intervalMs);
    
    return () => clearInterval(interval);
  }, [images.length, intervalMs, isLoadingImages]);
  
  // Preload images
  useEffect(() => {
    if (images.length === 0) return;
    
    images.forEach((image, index) => {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(prev => {
          const newLoaded = [...prev];
          newLoaded[index] = true;
          return newLoaded;
        });
      };
      img.onerror = () => {
        console.warn(`Failed to load example image: ${image.src}`);
        setIsLoaded(prev => {
          const newLoaded = [...prev];
          newLoaded[index] = false;
          return newLoaded;
        });
      };
      img.src = image.src;
    });
  }, [images]);
  
  return {
    images,
    currentImage: images[currentIndex] || null,
    currentIndex,
    isLoaded: isLoaded[currentIndex] || false,
    allImagesLoaded: isLoaded.every(loaded => loaded),
    isLoadingImages,
    error,
    hasImages: images.length > 0
  };
} 