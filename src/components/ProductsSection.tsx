import ProductCard from "./ProductCard";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import oilProductImage from "@/assets/oil-product.png";

const products = [
  {
    name: "Shell Helix Ultra 5W-40 синтетическое",
    brand: "Shell",
    volume: "4 л",
    price: 3299,
    oldPrice: 3899,
    rating: 4.87,
    image: oilProductImage,
    inStock: true,
    discount: 15,
  },
  {
    name: "Mobil 1 ESP Formula 5W-30 синтетическое",
    brand: "Mobil",
    volume: "4 л",
    price: 4150,
    rating: 4.93,
    image: oilProductImage,
    inStock: true,
  },
  {
    name: "Castrol EDGE 5W-30 LL синтетическое",
    brand: "Castrol",
    volume: "4 л",
    price: 3850,
    rating: 4.86,
    image: oilProductImage,
    inStock: true,
  },
  {
    name: "Лукойл Genesis Armortech 5W-40",
    brand: "Лукойл",
    volume: "4 л",
    price: 1890,
    rating: 4.88,
    image: oilProductImage,
    inStock: true,
  },
  {
    name: "Total Quartz INEO ECS 5W-30",
    brand: "Total",
    volume: "5 л",
    price: 4299,
    oldPrice: 4799,
    rating: 4.86,
    image: oilProductImage,
    inStock: false,
    discount: 10,
  },
];

const ProductsSection = () => {
  return (
    <section className="py-8">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground italic">
            Что интересного
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full border border-border">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full border border-border">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
