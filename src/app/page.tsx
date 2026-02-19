
import HeroBanner from "@/components/HeroBanner";
import Categories from "@/components/Categories";
import Promotions from "@/components/Promotions";
import ProductsSection from "@/components/ProductsSection";

import { getHeroSlides, getProducts as fetchStrapiProducts, getStrapiMedia, getPromotions, StrapiProduct } from "@/lib/strapi";
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

  const popularProducts: ProductData[] = (productsResponse.data as StrapiProduct[]).map((item) => ({
    id: item.id,
    documentId: item.documentId,
    name: item.name,
    brand: item.brand,
    volume: item.volume,
    price: item.price,
    oldPrice: item.oldPrice,
    image: getStrapiMedia(item.image?.url) || "/oil-product.png",
    inStock: item.inStock,
    oilType: item.oilType,
    isUniversal: item.isUniversal,
    category: item.category?.slug || "all",
    viscosity: item.viscosity as string,
    approvals: item.approvals as string,
    specification: item.specification as string,
    viscosityClass: item.viscosityClass as string,
    application: item.application as string,
    standard: item.standard as string,
    color: item.color as string,
    type: item.type as string,
    rating: item.rating as number,
    isNew: item.isNew as boolean,
    isHit: item.isHit as boolean,
  }));

  return (
    <main>
      <HeroBanner slides={slides} />
      <Categories />
      <ProductsSection products={popularProducts} />
      <Promotions promotions={promotions} />
    </main>
  );
}
