"use client";
 
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
 
export default function AllProductsCard({ imageUrl }: { imageUrl?: string }) {
  return (
    <Link
      href="/catalog"
      className="group flex flex-col items-center text-center shrink-0"
      style={{ minWidth: "80px" }}
    >
      <div className="mb-2 md:mb-3 relative h-32 w-32 md:h-[176px] md:w-[176px] flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm overflow-hidden">
        {/* Support custom image from Strapi or public folder */}
        <Image
          src={imageUrl || "/all-products.png"}
          alt="Все товары"
          fill
          unoptimized
          className="object-cover opacity-0 transition-opacity duration-300"
          onLoad={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.naturalWidth > 0) {
              img.classList.remove("opacity-0");
            }
          }}
          onError={(e) => {
               const target = e.target as HTMLImageElement;
               // If there was an error with custom image, try fallback once if allowed or just hide
               if (imageUrl && target.src !== window.location.origin + "/all-products.png") {
                 target.src = "/all-products.png";
               } else {
                 target.style.display = "none";
               }
          }}
        />
        <LayoutGrid
          className="h-8 w-8 md:h-12 md:w-12 text-foreground absolute"
          strokeWidth={1.5}
        />
      </div>
      <span className="text-xs md:text-sm font-medium text-foreground leading-tight text-center">
        Все товары
      </span>
    </Link>
  );
}
