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
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
  },
  {
    name: "Mobil 1 ESP Formula 5W-30 синтетическое",
    brand: "Mobil",
    volume: "4 л",
    price: 4150,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
  },
  {
    name: "Castrol EDGE 5W-30 LL синтетическое",
    brand: "Castrol",
    volume: "4 л",
    price: 3850,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: false,
  },
  {
    name: "Лукойл Genesis Armortech 5W-40",
    brand: "Лукойл",
    volume: "4 л",
    price: 1890,
    image: oilProductImage,
    inStock: true,
    oilType: "Полусинтетика",
    isUniversal: true,
  },
  {
    name: "Total Quartz INEO ECS 5W-30",
    brand: "Total",
    volume: "5 л",
    price: 4299,
    oldPrice: 4799,
    image: oilProductImage,
    inStock: false,
    oilType: "Синтетическое",
    isUniversal: true,
  },
];

const ProductsSection = () => {
  return (
    <section className="py-8 bg-card">
      <div className="container">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground italic">
            Что интересного
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full border border-border h-10 w-10">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full border border-border h-10 w-10">
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
