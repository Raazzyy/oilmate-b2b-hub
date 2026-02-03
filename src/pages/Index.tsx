import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import PromoBanner from "@/components/PromoBanner";
import Categories from "@/components/Categories";
import ProductsSection from "@/components/ProductsSection";
import Benefits from "@/components/Benefits";
import Brands from "@/components/Brands";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroBanner />
        <PromoBanner />
        <Categories />
        <ProductsSection />
        <Benefits />
        <Brands />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
