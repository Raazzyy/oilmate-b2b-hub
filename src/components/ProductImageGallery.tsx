"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import Image, { StaticImageData } from "next/image";

interface ProductImageGalleryProps {
  image: string | StaticImageData;
  images?: string[];
  name: string;
}

const ProductImageGallery = ({ image, images, name }: ProductImageGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const mainImageUrl = typeof image === "string" ? image : image.src;

  // Build the full gallery: if multiple images from Strapi → use them; otherwise just the main image
  const gallery: string[] =
    images && images.length > 0
      ? images
      : [mainImageUrl];

  const currentImage = gallery[selectedIndex] || mainImageUrl;

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      {/* Main large image */}
      <div className="relative aspect-square bg-white rounded-2xl border border-border p-8 flex items-center justify-center overflow-hidden">
        <Image
          key={currentImage}
          src={currentImage}
          alt={name}
          fill
          priority
          className={cn(
            "object-contain transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
          sizes="(max-width: 768px) 100vw, 40vw"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>

      {/* Thumbnails — only show if more than 1 image */}
      {gallery.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {gallery.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setIsLoading(true);
                setSelectedIndex(index);
              }}
              className={cn(
                "relative h-20 w-20 rounded-xl border-2 bg-white p-2 flex-shrink-0 transition-all overflow-hidden",
                selectedIndex === index
                  ? "border-primary shadow-sm"
                  : "border-transparent hover:border-gray-200"
              )}
            >
              <Image
                src={img}
                alt={`${name} — фото ${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
