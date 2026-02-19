"use client";

import ProductCard from "./ProductCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { ProductData } from "@/data/products";

interface ProductsSectionProps {
  products: ProductData[];
}

const ProductsSection = ({ products }: ProductsSectionProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  useEffect(() => {
    if (!api) return;

    const updateScrollState = () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollState();
    api.on("select", updateScrollState);
    api.on("reInit", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
      api.off("reInit", updateScrollState);
    };
  }, [api]);

  return (
    <section className="py-8 bg-card">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-foreground">
            Популярные товары
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-lg bg-muted hover:bg-muted-foreground/20 h-10 w-10 disabled:opacity-50"
              onClick={() => api?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-lg bg-muted hover:bg-muted-foreground/20 h-10 w-10 disabled:opacity-50"
              onClick={() => api?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem 
                key={product.id} 
                className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default ProductsSection;
