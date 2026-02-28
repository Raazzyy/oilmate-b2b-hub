"use client";

import ProductCard from "./ProductCard";
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

        {/* Native horizontal scroll container */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -ml-4 pl-4">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="shrink-0 basis-[70%] sm:basis-[45%] md:basis-[30%] lg:basis-[22%] xl:basis-[18%]"
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
