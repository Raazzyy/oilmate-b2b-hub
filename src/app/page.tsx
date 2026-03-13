
import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import Promotions from "@/components/Promotions";
import ProductsSection from "@/components/ProductsSection";

import { getHeroSlides, getHomepageProducts, getStrapiMedia, getPromotions, StrapiProduct, mapStrapiProduct } from "@/lib/strapi";
import { ProductData } from "@/data/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const slides = await getHeroSlides();
  const promotions = await getPromotions();

  const popularProducts = await getHomepageProducts();

  return (
    <main>
      <HeroBanner slides={slides} />
      <Categories />
      <ProductsSection products={popularProducts} />
      <Promotions promotions={promotions} />
    </main>
  );
}
