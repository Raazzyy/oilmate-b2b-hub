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
  } = product;

  // Формируем строку характеристик
  const getSpecsLine = () => {
    // Для смазок показываем вес вместо объема
    if (category === 'lubricants') {
      return `${oilType} · ${volume}`;
    }
    return `${oilType} · ${volume}`;
  };
  
  // Разделяем цену на рубли и копейки
  const rubles = Math.floor(price);
  const kopecks = Math.round((price - rubles) * 100) || 99;
  
  const oldRubles = oldPrice ? Math.floor(oldPrice) : null;
  const oldKopecks = oldPrice ? Math.round((oldPrice - Math.floor(oldPrice)) * 100) || 99 : null;

  // Рассчитываем процент скидки
  const discountPercent = oldPrice ? Math.round((1 - price / oldPrice) * 100) : null;

  // Handle image source
  const imageSrc = typeof image === 'string' ? image : image.src;

  return (
    <div className="group relative flex flex-col h-full transition-all duration-300">
      {/* Clickable area for product page */}
      <Link href={`/product/${documentId || id}`} className="block">
        {/* Image container */}
        <div className="relative mb-2">
          <div className="aspect-[4/4.5] overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/50 relative">
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover transition-transform"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>
          
          {/* Discount badge - Split style with original gradient */}
          {discountPercent && discountPercent > 0 && (
            <div className="absolute left-2 bottom-2 flex items-center overflow-hidden rounded-lg bg-card border border-border text-[10px] font-bold shadow-sm z-10">
              <div className="px-2 py-1 text-foreground">
                Распродажа
              </div>
            </div>
          )}
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
          <div className={`inline-flex items-baseline w-fit ${oldPrice ? 'bg-gradient-to-r from-primary/20 to-accent/20 px-1.5 py-0.5 rounded-md' : ''}`}>
            <span className={`text-base font-bold ${oldPrice ? 'text-primary' : 'text-foreground'}`}>
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
