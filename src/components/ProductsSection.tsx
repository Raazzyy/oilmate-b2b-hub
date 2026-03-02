"use client";

import ProductCard from "./ProductCard";
import { ProductData } from "@/data/products";

interface ProductsSectionProps {
  products: ProductData[];
  title?: string;
}

const ProductsSection = ({ products, title = "Популярные товары" }: ProductsSectionProps) => {
  return (
    <section className="py-6 md:py-10 bg-card">
      <div className="container">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground">
            {title}
          </h2>
        </div>

        <div className="flex flex-nowrap gap-3 overflow-x-auto pb-4 scrollbar-hide">
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
