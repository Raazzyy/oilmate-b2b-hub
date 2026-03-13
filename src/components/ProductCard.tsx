"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { ProductData } from "@/data/products";

import Image from "next/image";

interface ProductCardProps {
  product: ProductData;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const {
    id = 1,
    documentId,
    name,
    brand,
    volume,
    price,
    oldPrice,
    image,
    inStock,
    oilType,
    isUniversal = true,
    category,
    label,
  } = product;

  // Формируем строку характеристик
  const getSpecsLine = () => {
    return `${oilType} · ${volume}`;
  };
  
  // Разделяем цену
  const rubles = Math.floor(price);
  const oldRubles = oldPrice ? Math.floor(oldPrice) : null;

  // Рассчитываем процент скидки
  const discountPercent = oldPrice && oldPrice > price 
    ? Math.round((1 - price / oldPrice) * 100) 
    : null;

  // Handle image source
  const imageSrc = typeof image === 'string' ? image : image.src;

  return (
    <div className="group relative flex flex-col h-full transition-all duration-300">
      <Link href={`/product/${documentId || id}`} className="block">
        {/* Image container with 3:4 Aspect Ratio */}
        <div className="relative mb-2">
          <div className="aspect-[3/4] overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/50 relative">
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
          
          {/* Badges: Red for discount, Blue for custom label (Gradients from reference repo) */}
          {(discountPercent && discountPercent > 0) || label ? (
            <div className="absolute left-2 bottom-2 flex flex-col items-start gap-1.5 z-10">
              {discountPercent && discountPercent > 0 && (
                <div className="bg-gradient-to-r from-[hsl(0,80%,45%)] to-[hsl(0,90%,55%)] text-white rounded-full px-2.5 py-1 flex items-center justify-center shadow-sm">
                  <span className="text-[9px] font-bold leading-none">-{discountPercent}%</span>
                </div>
              )}
              {label && (
                <div className="bg-gradient-to-r from-[hsl(211,100%,30%)] to-[hsl(211,100%,50%)] text-white rounded-full px-3.5 py-1.5 flex items-center justify-center shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-wide leading-none">{label}</span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Name */}
        <h3 className="line-clamp-2 text-xs font-medium text-foreground leading-snug mb-1 h-8 group-hover:text-primary transition-colors pr-2">
          {name}
        </h3>
        
        {/* Specs */}
        <p className="text-[11px] text-muted-foreground mb-1 line-clamp-1 pr-2">
          {getSpecsLine()}
        </p>
      </Link>

      {/* Price & button */}
      <div className="mt-auto pb-2">
        <div className="mb-2 flex flex-wrap items-center gap-x-1.5 gap-y-1 pr-2">
          <div className={`inline-flex items-baseline w-fit ${oldPrice ? 'bg-gradient-to-r from-primary/10 to-accent/10 px-2 py-0.5 rounded-md' : ''}`}>
            <span className={`text-base font-bold ${oldPrice ? 'text-primary font-extrabold' : 'text-foreground'}`}>
              {rubles.toLocaleString("ru-RU")} ₽
            </span>
          </div>
          
          {oldPrice && (
            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50 whitespace-nowrap">
              {oldRubles?.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>

        {/* Add to cart */}
        <AddToCartButton product={product} />
      </div>
    </div>
  );
};

export default ProductCard;
