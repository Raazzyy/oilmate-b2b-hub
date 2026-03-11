import { ProductData, categoryNames } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Car, Cog, Droplets, Factory, Snowflake, Wrench, LayoutGrid, HelpCircle } from "lucide-react";
import {
  getProducts as fetchStrapiProducts,
  StrapiProduct,
  mapStrapiProduct,
  getCategoryBySlug,
  getCategoryFilterOptions,
  getCategories,
  getStrapiMedia,
} from "@/lib/strapi";
import CatalogFilters from "@/components/CatalogFilters";
import MobileFilters from "@/components/MobileFilters";

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

// Data fetching from Strapi
async function getProducts(
  categorySlug?: string,
  searchParams: Record<string, string | string[] | undefined> = {}
): Promise<ProductData[]> {
  const filters: Record<string, unknown> = {};
  const { search, minPrice, maxPrice, ...otherFilters } = searchParams;

  if (categorySlug && categorySlug !== "all") {
    filters.category = { slug: { $eq: categorySlug } };
  }

  // Price filtering
  if (minPrice || maxPrice) {
    const priceFilter: Record<string, unknown> = {};
    if (minPrice) priceFilter.$gte = minPrice;
    if (maxPrice) priceFilter.$lte = maxPrice;
    filters.price = priceFilter;
  }

  // Search filtering
  if (search && typeof search === 'string') {
    const lowerQuery = search.toLowerCase();
    const capitalizedQuery = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase();
    
    filters.$or = [
      { name: { $containsi: search } },
      { name: { $containsi: lowerQuery } },
      { name: { $containsi: capitalizedQuery } },
      { brand: { $containsi: search } },
      { brand: { $containsi: lowerQuery } },
      { brand: { $containsi: capitalizedQuery } },
    ];
  }

  // Dynamic filters from chips
  Object.entries(otherFilters).forEach(([key, value]) => {
    if (value && typeof value === 'string') {
      const options = value.split(',');
      if (options.length > 0) {
        filters[key] = { $in: options };
      }
    }
  });

  const response = await fetchStrapiProducts({ filters });
  return (response.data as StrapiProduct[]).map(mapStrapiProduct);
}

interface CatalogPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const dynamic = "force-dynamic";

export default async function CatalogPage(props: CatalogPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const categorySlug = params.slug?.[0];
  const searchQuery = typeof searchParams.search === 'string' ? searchParams.search : undefined;

  const isRootCatalog = !categorySlug && !searchQuery;

  const categoryName = categorySlug
    ? categoryNames[categorySlug] || "Каталог"
    : "Все товары";

  const [products, category, autoFilters, categories] = await Promise.all([
    isRootCatalog ? Promise.resolve([]) : getProducts(categorySlug, searchParams),
    categorySlug && categorySlug !== "all"
      ? getCategoryBySlug(categorySlug)
      : Promise.resolve(null),
    isRootCatalog ? Promise.resolve([]) : getCategoryFilterOptions(categorySlug),
    isRootCatalog ? getCategories() : Promise.resolve([]),
  ]);

  return (
    <div className="container py-6 md:py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 gap-1">
        <Link href="/" className="hover:text-primary transition-colors bg-muted/60 hover:bg-muted px-3 py-1 rounded-full">
          Главная
        </Link>
        <span className="opacity-40 text-xs">/</span>
        {(categorySlug || searchQuery) ? (
          <>
            <Link href="/catalog" className="hover:text-primary transition-colors bg-muted/60 hover:bg-muted px-3 py-1 rounded-full">
              Каталог
            </Link>
            <span className="opacity-40 text-xs">/</span>
            <span className="text-foreground font-medium bg-muted px-3 py-1 rounded-full">{categorySlug ? categoryName : `Поиск: ${searchQuery}`}</span>
          </>
        ) : (
          <span className="text-foreground font-medium bg-muted px-3 py-1 rounded-full">Каталог</span>
        )}
      </div>

      {isRootCatalog ? (
        // Root catalog grid
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight mb-1">
              Категории товаров
            </h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.slug || '');
              const iconColor = getCategoryColor(cat.slug || '');
              return (
                <Link
                  key={cat.id}
                  href={`/catalog/${cat.slug}`}
                  className="group flex flex-col items-center text-center p-4 md:p-6 border border-border rounded-styled bg-card hover:bg-muted/50 transition-colors shadow-sm hover:shadow-md"
                >
                  <div className="mb-3 relative h-20 w-20 md:h-28 md:w-28 rounded-2xl bg-muted/30 overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105">
                    {cat.image?.url ? (
                      <Image
                        src={getStrapiMedia(cat.image.url) as string}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 80px, 112px"
                      />
                    ) : (
                      <IconComponent className={`h-8 w-8 md:h-12 md:w-12 ${iconColor}`} strokeWidth={1.5} />
                    )}
                  </div>
                  <span className="text-sm md:text-base font-semibold text-foreground leading-tight text-center group-hover:text-primary transition-colors">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        // Regular catalog with sidebar and products
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* ── Sidebar – sticky, self-contained scroll ── */}
          <aside className="w-full md:w-60 shrink-0 hidden md:block sticky top-4 self-start">
            <CatalogFilters category={category} categorySlugProp={categorySlug} autoFilters={autoFilters} />
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight mb-1">
                {searchQuery ? `Поиск: "${searchQuery}"` : categoryName}
              </h1>
              <p className="text-sm text-muted-foreground">
                Найдено товаров: {products.length}
              </p>
            </div>

            {/* Mobile Filters Trigger (hidden on md) */}
            <div className="md:hidden mb-6">
              <MobileFilters category={category} categorySlugProp={categorySlug} autoFilters={autoFilters} />
            </div>

            {products.length > 0 ? (
              /* 3 columns on md+ (with sidebar: effectively desktop), 2 on mobile */
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {products.map((product) => (
                  <div key={product.id} className="h-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 md:py-20 border rounded-2xl bg-muted/20">
                <h3 className="text-lg font-medium mb-2">Товары не найдены</h3>
                <p className="text-muted-foreground mb-6">
                  Попробуйте изменить параметры поиска или выбрать другую категорию
                </p>
                <Button asChild>
                  <Link href="/catalog">Перейти в каталог</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
