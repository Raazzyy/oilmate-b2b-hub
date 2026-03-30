"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { ProductData } from "@/data/products";

interface ProductsSectionProps {
  products: ProductData[];
  title?: string;
}

const ProductsSection = ({ products, title = "Популярные товары" }: ProductsSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <section className="py-2.5 md:py-4 bg-card">
      <div className="container">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {/* Desktop arrows always visible in header */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-border hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-default"
              aria-label="Назад"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex items-center justify-center w-8 h-8 rounded-full border border-border hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-default"
              aria-label="Вперёд"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={ref}
          className="flex flex-nowrap gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
          onMouseDown={(e) => {
            isDown.current = true;
            startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
            scrollLeft.current = ref.current?.scrollLeft ?? 0;
            if (ref.current) ref.current.style.userSelect = "none";
          }}
          onMouseMove={(e) => {
            if (!isDown.current || !ref.current) return;
            const x = e.pageX - ref.current.offsetLeft;
            ref.current.scrollLeft = scrollLeft.current - (x - startX.current);
          }}
          onMouseUp={() => { isDown.current = false; if (ref.current) ref.current.style.userSelect = ""; }}
          onMouseLeave={() => { isDown.current = false; if (ref.current) ref.current.style.userSelect = ""; }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="shrink-0 basis-[75%] sm:basis-[48%] md:basis-[32%] lg:basis-[24%] xl:basis-[20%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
