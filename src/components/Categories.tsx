import Image from "next/image";
import Link from "next/link";
import { Car, Cog, Droplets, Factory, Snowflake, Wrench, LayoutGrid, HelpCircle } from "lucide-react";
import { getHomepageCategories, getStrapiMedia } from "@/lib/strapi";

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
  const strapiCategories = await getHomepageCategories();

  return (
    <section className="py-6 md:py-10">
      <div className="container">
        {/* Horizontal scroll on all screen sizes */}
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {strapiCategories.map((category) => {
            const IconComponent = getCategoryIcon(category.slug || '');
            const iconColor = getCategoryColor(category.slug || '');
            return (
              <Link
                key={category.id}
                href={`/catalog/${category.slug}`}
                className="group flex flex-col items-center text-center shrink-0"
                style={{ minWidth: '80px' }}
              >
                {/* Rectangular container */}
                <div className="mb-2 md:mb-3 flex h-24 w-32 md:h-[120px] md:w-[180px] items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                  {category.image?.url ? (
                    <div className="relative h-12 w-12 md:h-16 md:w-16">
                      <Image
                        src={getStrapiMedia(category.image.url) as string}
                        alt={category.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <IconComponent className={`h-8 w-8 md:h-12 md:w-12 ${iconColor}`} strokeWidth={1.5} />
                  )}
                </div>
                <span className="text-xs md:text-sm font-medium text-foreground leading-tight text-center">
                  {category.name}
                </span>
              </Link>
            );
          })}

          {/* All Products button */}
          <Link
            href="/catalog"
            className="group flex flex-col items-center text-center shrink-0"
            style={{ minWidth: '80px' }}
          >
            <div className="mb-2 md:mb-3 flex h-24 w-32 md:h-[120px] md:w-[180px] items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
              <LayoutGrid className="h-8 w-8 md:h-12 md:w-12 text-foreground" strokeWidth={1.5} />
            </div>
            <span className="text-xs md:text-sm font-medium text-foreground leading-tight text-center">
              Все товары
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}