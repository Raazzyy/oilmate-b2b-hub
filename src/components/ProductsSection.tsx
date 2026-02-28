"use client";

import ProductCard from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductData } from "@/data/products";

interface ProductsSectionProps {
  products: ProductData[];
  title?: string;
}

const ProductsSection = ({ products, title = "Популярные товары" }: ProductsSectionProps) => {
  return (
    <section className="py-8 bg-card">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {title}
          </h2>
        </div>


        <Carousel
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
