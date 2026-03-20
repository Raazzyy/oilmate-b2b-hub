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

        {/* Price Block */}
        <div className="mt-3 mb-1.5 flex items-baseline gap-2 px-0.5">
          <span className={`text-[16px] xl:text-[18px] font-bold tracking-tight ${oldPrice ? 'bg-gradient-to-r from-[hsl(211,60%,95%)] to-[hsl(211,60%,90%)] text-foreground rounded-lg px-2.5 py-0.5' : 'text-foreground'}`}>
            {rubles.toLocaleString("ru-RU")} <span className="text-[14px]">₽</span>
          </span>
          {oldPrice && (
            <span className="text-[12px] text-muted-foreground line-through decoration-muted-foreground/50">
              {oldRubles?.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>

        {/* Name */}
        <h3 className="line-clamp-2 text-[13px] xl:text-[14px] font-medium text-foreground leading-snug mb-1 group-hover:text-primary transition-colors px-0.5">
          {name}
        </h3>
        
        {/* Specs */}
        <p className="text-[11px] xl:text-[12px] text-muted-foreground mb-1 line-clamp-1 px-0.5">
          {getSpecsLine()}
        </p>
      </Link>

      {/* Button */}
      <div className="mt-auto pb-2">
        <AddToCartButton 
          product={product} 
          className="" 
        />
      </div>
    </div>
  );
};

export default ProductCard;

