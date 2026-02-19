"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";
import { ProductData } from "@/data/products";

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
    <div className="group relative flex flex-col h-full p-3 transition-all duration-300">
      {/* Clickable area for product page */}
      <Link href={`/product/${documentId || id}`} className="block">
        {/* Image container */}
        <div className="relative mb-3">
          <div className="aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-muted to-muted/50">
            <img
              src={imageSrc}
              alt={name}
              className="h-full w-full object-contain p-5 transition-transform group-hover:scale-105"
            />
          </div>
          
          {/* Discount badge - Split style with original gradient */}
          {discountPercent && discountPercent > 0 && (
            <div className="absolute left-2 bottom-2 flex items-center overflow-hidden rounded-lg bg-black/10 backdrop-blur-md border border-white/10 text-[10px] font-bold shadow-sm">
              <div className="bg-gradient-to-r from-primary to-accent px-2 py-1 text-white">
                -{discountPercent}%
              </div>
              <div className="px-2 py-1 text-foreground dark:text-white opacity-90">
                Распродажа
              </div>
            </div>
          )}
        </div>

        {/* Name - fixed height for alignment */}
        <h3 className="line-clamp-2 text-sm font-medium text-foreground leading-snug mb-2 h-10 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        {/* Volume and parameters inline - fixed height */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {getSpecsLine()}
        </p>
      </Link>

      {/* Spacer to push price and button to bottom */}
      <div className="mt-auto">
        {/* Price Row (Single line) */}
        <div className="mb-4 flex items-center gap-3">
          <div className={`inline-flex items-baseline w-fit ${oldPrice ? 'bg-gradient-to-r from-primary/20 to-accent/20 px-2 py-1 rounded-md' : ''}`}>
            <span className={`text-xl font-bold ${oldPrice ? 'text-primary' : 'text-foreground'}`}>
              {rubles.toLocaleString("ru-RU")}
            </span>
            <sup className={`text-[10px] font-bold ml-px ${oldPrice ? 'text-primary' : 'text-foreground'}`}>
              {kopecks.toString().padStart(2, '0')}
            </sup>
            <span className={`text-base font-bold ml-0.5 ${oldPrice ? 'text-primary' : 'text-foreground'}`}>₽</span>
          </div>
          
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through decoration-muted-foreground/50">
              {oldRubles}<sup className="text-[8px]">{String(oldKopecks).padStart(2, '0')}</sup>₽
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
