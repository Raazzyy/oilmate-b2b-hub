
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";

interface ProductImageGalleryProps {
  image: string | StaticImageData;
  name: string;
}

const ProductImageGallery = ({ image, name }: ProductImageGalleryProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, we might have multiple images
  const createImageUrl = (img: string | StaticImageData) => {
    return typeof img === 'string' ? img : img.src;
  };

  const imageUrl = createImageUrl(image);
  const images = [imageUrl, imageUrl, imageUrl]; 
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="flex flex-col gap-4 sticky top-24">
      <div className="relative aspect-square bg-white rounded-2xl border border-border p-8 flex items-center justify-center overflow-hidden">
        <img
          src={images[selectedImage]}
          alt={name}
          className={cn(
            "w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => setIsLoading(false)}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        )}
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2">
         {images.map((img, index) => (
           <button
             key={index}
             onClick={() => setSelectedImage(index)}
             className={cn(
               "relative h-20 w-20 rounded-xl border-2 bg-white p-2 flex-shrink-0 transition-all overflow-hidden",
               selectedImage === index ? "border-primary" : "border-transparent hover:border-gray-200"
             )}
           >
             <img 
               src={img} 
               alt={`${name} preview ${index}`} 
               className="w-full h-full object-contain"
             />
           </button>
         ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
