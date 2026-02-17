
import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import Promotions from "@/components/Promotions";
import ProductsSection from "@/components/ProductsSection";

export default function Home() {
  return (
    <main>
      <HeroBanner />
      <Categories />
      <Promotions />
      <ProductsSection />
    </main>
  );
}
