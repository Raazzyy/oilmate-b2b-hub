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
    viscosity,
  } = product;

  const rubles = Math.floor(price);
  const oldRubles = oldPrice ? Math.floor(oldPrice) : null;

  // Показываем скидку только если oldPrice > price
  const discountPercent =
    oldPrice && oldPrice > price
      ? Math.round((1 - price / oldPrice) * 100)
      : null;

  // Handle image source (string or object with .src)
  const imageSrc = typeof image === "string" ? image : (image as { src: string })?.src;

  // Строка характеристик: вязкость · тип масла (на мобиле), + объём (на десктопе)
  const specsLeft = [viscosity, oilType].filter(Boolean).join(" · ");

  return (
    <div className="group relative flex flex-col h-full">
      <Link href={`/product/${documentId || id}`} className="flex flex-col flex-1">
        {/* ── Image ── */}
        <div className="relative mb-2.5 overflow-hidden rounded-2xl bg-muted">
          <div className="aspect-[3/4] relative">
            <Image
              src={imageSrc}
              alt={name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          </div>

          {/* Бейджи: красный % скидки (если есть oldPrice) + синий label из Strapi */}
          {(discountPercent || label) && (
            <div className="absolute left-2 bottom-2 flex flex-col items-start gap-1.5 z-10">
              {discountPercent && discountPercent > 0 && (
                <div className="bg-gradient-to-r from-[hsl(0,80%,45%)] to-[hsl(0,90%,55%)] text-white rounded-full px-2.5 py-1 flex items-center justify-center shadow-sm">
                  <span className="text-[9px] font-bold leading-none">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              {label && (
                <div className="bg-gradient-to-r from-[hsl(211,100%,30%)] to-[hsl(211,100%,50%)] text-white rounded-full px-3.5 py-1.5 flex items-center justify-center shadow-sm">
                  <span className="text-[9px] font-bold uppercase tracking-wide leading-none">
                    {label}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Price (сверху, как в референсе) ── */}
        <div className="flex items-baseline gap-2 mb-1 px-0.5">
          <span
            className={`text-lg font-bold ${
              oldPrice
                ? "bg-gradient-to-r from-[hsl(211,60%,95%)] to-[hsl(211,60%,90%)] text-foreground rounded-full px-3 py-0.5"
                : "text-foreground"
            }`}
          >
            {rubles.toLocaleString("ru-RU")} ₽
          </span>
          {oldRubles && (
            <span className="text-xs text-muted-foreground line-through whitespace-nowrap">
              {oldRubles.toLocaleString("ru-RU")} ₽
            </span>
          )}
        </div>

        {/* ── Name ── */}
        <p className="text-sm text-foreground line-clamp-2 leading-snug mb-1.5 px-0.5 group-hover:text-primary transition-colors">
          {name}
        </p>

        {/* ── Specs ── */}
        <p className="text-xs text-muted-foreground px-0.5 mb-2">
          <span>{specsLeft}</span>
          <span className="hidden md:inline"> · {volume}</span>
        </p>
      </Link>

      {/* ── Add to cart ── */}
      <AddToCartButton product={product} />
    </div>
  );
};

export default ProductCard;
