
import { ProductData, categoryNames } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  getProducts as fetchStrapiProducts,
  StrapiProduct,
  mapStrapiProduct,
  getCategoryBySlug,
} from "@/lib/strapi";
import CatalogFilters from "@/components/CatalogFilters";

// Data fetching from Strapi
async function getProducts(
  categorySlug?: string,
  searchQuery?: string
): Promise<ProductData[]> {
  const filters: Record<string, unknown> = {};

  if (categorySlug && categorySlug !== "all") {
    filters.category = { slug: { $eq: categorySlug } };
  }

  if (searchQuery) {
    filters.name = { $containsi: searchQuery };
  }

  const response = await fetchStrapiProducts({ filters });
  return (response.data as StrapiProduct[]).map(mapStrapiProduct);
}

interface CatalogPageProps {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<{ search?: string }>;
}

export const dynamic = "force-dynamic";

export default async function CatalogPage(props: CatalogPageProps) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const categorySlug = params.slug?.[0];
  const searchQuery = searchParams.search;

  const categoryName = categorySlug
    ? categoryNames[categorySlug] || "Каталог"
    : "Все товары";

  const [products, category] = await Promise.all([
    getProducts(categorySlug, searchQuery),
    categorySlug && categorySlug !== "all"
      ? getCategoryBySlug(categorySlug)
      : Promise.resolve(null),
  ]);

  return (
    <div className="container py-6 md:py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 gap-1">
        <Link href="/" className="hover:text-primary transition-colors bg-muted/60 hover:bg-muted px-3 py-1 rounded-full">
          Главная
        </Link>
        <span className="opacity-40 text-xs">/</span>
        <Link href="/catalog" className="hover:text-primary transition-colors bg-muted/60 hover:bg-muted px-3 py-1 rounded-full">
          Каталог
        </Link>
        {categorySlug && (
          <>
            <span className="opacity-40 text-xs">/</span>
            <span className="text-foreground font-medium bg-muted px-3 py-1 rounded-full">{categoryName}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* ── Sidebar – sticky, self-contained scroll ── */}
        <aside className="w-full md:w-60 shrink-0 hidden md:block sticky top-4 self-start">
          <CatalogFilters category={category} categorySlugProp={categorySlug} />
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

          {products.length > 0 ? (
            /* 3 columns on md+ (with sidebar: effectively desktop), 2 on mobile */
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
    </div>
  );
}
