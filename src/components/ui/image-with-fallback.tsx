"use client";

import { useState } from 'react';
import { User } from 'lucide-react';

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  placeholder?: React.ReactNode;
  containerClassName?: string;
}

export function ImageWithFallback({
  src,
  alt,
  className = "",
  placeholder,
  containerClassName = ""
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Se não há src ou houve erro, mostrar placeholder
  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${containerClassName}`}>
        {placeholder || <User className="w-16 h-16 text-gray-400" />}
      </div>
    );
  }

  return (
    <div className={`relative ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
