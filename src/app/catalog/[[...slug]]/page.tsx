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
import CatalogSort from "@/components/CatalogSort";

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
  const { search, minPrice, maxPrice, sort, ...otherFilters } = searchParams;

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

  const sortParam = sort === "price_asc" ? "price:asc" : sort === "price_desc" ? "price:desc" : undefined;

  const response = await fetchStrapiProducts({ filters, sort: sortParam });
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

  const [products, categoryData, autoFilters, categories] = await Promise.all([
    isRootCatalog ? Promise.resolve([]) : getProducts(categorySlug, searchParams),
    categorySlug && categorySlug !== "all"
      ? getCategoryBySlug(categorySlug)
      : Promise.resolve(null),
    isRootCatalog ? Promise.resolve([]) : getCategoryFilterOptions(categorySlug),
    isRootCatalog ? getCategories() : Promise.resolve([]),
  ]);

  const categoryName = searchQuery 
    ? `Поиск: ${searchQuery}`
    : categoryData?.name || (categorySlug ? categoryNames[categorySlug] || "Каталог" : "Все товары");

  const hasActiveFilters = Boolean(
    searchParams.minPrice || 
    searchParams.maxPrice || 
    Object.keys(searchParams).some(k => k !== 'search' && k !== 'sort')
  );

  // Compute dynamic price range from actual Strapi products
  const priceRange = products.length > 0
    ? {
        min: Math.floor(Math.min(...products.map(p => p.price))),
        max: Math.ceil(Math.max(...products.map(p => p.price))),
      }
    : { min: 0, max: 30000 };

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
            <span className="text-foreground font-medium bg-muted px-3 py-1 rounded-full">{categoryName}</span>
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-3 gap-y-8">
            {categories.map((cat) => {
              const IconComponent = getCategoryIcon(cat.slug || '');
              const iconColor = getCategoryColor(cat.slug || '');
              return (
                <Link
                  key={cat.id}
                  href={`/catalog/${cat.slug}`}
                  className="group flex flex-col items-center text-center gap-3 transition-transform duration-200 hover:-translate-y-0.5"
                >
                  {/* Full-width square container — adapts to any column width */}
                  <div className="w-full aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center transition-all duration-200 group-hover:bg-gray-200 dark:group-hover:bg-gray-700 group-hover:shadow-md">
                    {cat.image?.url ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={getStrapiMedia(cat.image.url) as string}
                          alt={cat.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 45vw, (max-width: 768px) 30vw, (max-width: 1024px) 22vw, 18vw"
                        />
                      </div>
                    ) : (
                      <IconComponent
                        className={`h-10 w-10 md:h-14 md:w-14 transition-transform duration-300 group-hover:scale-110 ${iconColor}`}
                        strokeWidth={1.5}
                      />
                    )}
                  </div>
                  <span className="text-xs md:text-sm font-medium text-foreground leading-snug text-center px-1 group-hover:text-primary transition-colors">
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
            <CatalogFilters category={categoryData} categorySlugProp={categorySlug} autoFilters={autoFilters} priceRange={priceRange} />
          </aside>

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-1">
                  {categoryName}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Найдено товаров: {products.length}
                </p>
              </div>

              {/* Desktop Sort Dropdown */}
              <div className="hidden md:block">
                <CatalogSort />
              </div>
            </div>

            {/* Mobile Filters & Sort (hidden on md) */}
            <div className="md:hidden flex gap-2 mb-6">
              <CatalogSort isMobile />
              <MobileFilters category={categoryData} categorySlugProp={categorySlug} autoFilters={autoFilters} priceRange={priceRange} hasActiveFilters={hasActiveFilters} />
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
