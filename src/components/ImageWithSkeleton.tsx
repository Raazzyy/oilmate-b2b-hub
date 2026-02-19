"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageWithSkeletonProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: "square" | "video" | "wide" | "product";
}

const ImageWithSkeleton = ({ src, alt, className, aspectRatio = "square" }: ImageWithSkeletonProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    wide: "aspect-[21/9]",
    product: "aspect-[3/4]",
  }[aspectRatio];

  // For localhost, we often need unoptimized if using absolute URLs from Strapi
  const isLocal = src.includes("localhost") || src.startsWith("/");

  return (
    <div className={cn("relative overflow-hidden bg-muted", aspectRatioClass, className)}>
      {isLoading && !hasError && (
        <div className="absolute inset-0 animate-pulse bg-muted-foreground/10 z-10" />
      )}
      
      <Image
        src={hasError ? "/oil-product.png" : src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={cn(
          "object-cover transition-all duration-500",
          isLoading ? "scale-105 blur-sm grayscale" : "scale-100 blur-0 grayscale-0"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        unoptimized={isLocal}
      />
    </div>
  );
};

export default ImageWithSkeleton;
