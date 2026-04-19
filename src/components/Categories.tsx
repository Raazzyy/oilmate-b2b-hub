import Image from "next/image";
import Link from "next/link";
import { Car, Cog, Droplets, Factory, Snowflake, Wrench, LayoutGrid, HelpCircle } from "lucide-react";
import { getHomepageCategories, getStrapiMedia } from "@/lib/strapi";
import CategoriesScroll from "@/components/CategoriesScroll";

import AllProductsCard from "@/components/AllProductsCard";
 
const getCategoryIcon = (slug: string) => {
  if (!slug) return HelpCircle;
  if (slug.includes('motor')) return Car;
  if (slug.includes('trans')) return Cog;
  if (slug.includes('gidrav') || slug.includes('hydraul')) return Droplets;
  if (slug.includes('indust')) return Factory;
  if (slug.includes('smaz') || slug.includes('lubric')) return Wrench;
  if (slug.includes('anti')) return Snowflake;
  return HelpCircle;
};

const getCategoryColor = (slug: string) => {
  if (!slug) return "text-foreground";
  if (slug.includes('anti')) return "text-blue-500 dark:text-blue-400";
  return "text-foreground";
};

export default async function Categories() {
  const { categories: strapiCategories, allProductsImage } = await getHomepageCategories();

  return (
    <section className="py-2.5 md:py-4">
      <div className="container">
        {/* Horizontal scroll with drag support on all screen sizes */}
        <CategoriesScroll>
          {strapiCategories.map((category: any) => {
            const attrs = category.attributes || category;
            const slug = attrs.slug || '';
            const name = attrs.name || '';
            const IconComponent = getCategoryIcon(slug);
            const iconColor = getCategoryColor(slug);
            const imageUrl = attrs.image?.data?.attributes?.url || attrs.image?.url;
            
            return (
              <Link
                key={category.id}
                href={`/catalog/${slug}`}
                className="group flex flex-col items-center text-center shrink-0"
                style={{ minWidth: '80px' }}
              >
                {/* Square container 176x176 on desktop, 128x128 on mobile */}
                <div className="mb-2 md:mb-3 relative h-32 w-32 md:h-[176px] md:w-[176px] rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-sm flex items-center justify-center">
                  {imageUrl ? (
                    <Image
                      src={getStrapiMedia(imageUrl) as string}
                      alt={name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 128px, 176px"
                    />
                  ) : (
                    <IconComponent className={`h-8 w-8 md:h-12 md:w-12 ${iconColor}`} strokeWidth={1.5} />
                  )}
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground leading-tight text-center">
                  {name}
                </span>
              </Link>
            );
          })}
 
          {/* All Products button (Client Component) */}
          <AllProductsCard imageUrl={allProductsImage} />
        </CategoriesScroll>
      </div>
    </section>
  );
}
