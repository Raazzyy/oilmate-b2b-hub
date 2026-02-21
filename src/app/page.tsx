
import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import Promotions from "@/components/Promotions";
import ProductsSection from "@/components/ProductsSection";

import { getHeroSlides, getProducts as fetchStrapiProducts, getStrapiMedia, getPromotions, StrapiProduct, mapStrapiProduct } from "@/lib/strapi";
import { ProductData } from "@/data/products";

export default async function Home() {
  const slides = await getHeroSlides();
  const promotions = await getPromotions();

  // Fetch popular products for the carousel (hits)
  let productsResponse = await fetchStrapiProducts({ 
    pagination: { limit: 10 },
    filters: { isHit: { $eq: true } }
  });

  // Fallback: if no "hits" are found, just fetch the latest products
  if (!productsResponse?.data || productsResponse.data.length === 0) {
    productsResponse = await fetchStrapiProducts({ 
      pagination: { limit: 10 },
      sort: ['createdAt:desc']
    });
  }

  const popularProducts: ProductData[] = (productsResponse.data as StrapiProduct[]).map(mapStrapiProduct);

  return (
    <main>
      <HeroBanner slides={slides} />
      <Categories />
      <ProductsSection products={popularProducts} />
      <Promotions promotions={promotions} />
    </main>
  );
}
