"use client";

import Image from 'next/image';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  fallbackSrc = '/sem-foto.svg',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setShowFallback(true);
    setIsLoading(false);
    onError?.();
  };

  // Gerar blur data URL se não fornecido
  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=';

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        </div>
      )}
      
      {!showFallback ? (
        <Image
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          className={cn(
            'transition-opacity duration-300 object-cover w-full h-full',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : 'lazy'}
        />
      ) : (
        <img 
          src={fallbackSrc} 
          alt="Sem foto disponível"
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

// Componente específico para fotos de pessoas
interface PersonPhotoProps {
  src: string;
  alt: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  priority?: boolean;
}

export function PersonPhoto({ 
  src, 
  alt, 
  className, 
  size = 'md',
  priority = false 
}: PersonPhotoProps) {
  const sizeConfig = {
    sm: { width: 150, height: 150, sizes: '150px' },
    md: { width: 200, height: 200, sizes: '200px' },
    lg: { width: 300, height: 300, sizes: '300px' },
    xl: { width: 400, height: 400, sizes: '400px' },
  };

  const config = sizeConfig[size];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={config.width}
      height={config.height}
      sizes={config.sizes}
      priority={priority}
      className={cn('rounded-lg object-cover w-full h-full', className)}
      fallbackSrc="/sem-foto.svg"
    />
  );
}

// Componente para imagens em grid
interface GridImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'photo';
}

export function GridImage({ 
  src, 
  alt, 
  className,
  aspectRatio = 'square'
}: GridImageProps) {
  const aspectConfig = {
    square: { width: 300, height: 300, sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' },
    video: { width: 400, height: 225, sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' },
    photo: { width: 300, height: 200, sizes: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw' },
  };

  const config = aspectConfig[aspectRatio];

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={config.width}
      height={config.height}
      sizes={config.sizes}
      className={cn('rounded-lg', className)}
      fallbackSrc="/sem-foto.svg"
    />
  );
}
