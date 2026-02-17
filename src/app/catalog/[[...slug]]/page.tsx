
import { ProductData, allProducts, categoryNames } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button"; // Assuming we might need buttons
import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Mock function to simulate fetching data (replace with Strapi later)
async function getProducts(category?: string, searchQuery?: string): Promise<ProductData[]> {
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 500)); 

  let filtered = allProducts;

  if (category && category !== 'all') {
     filtered = filtered.filter(p => p.category === category);
  }

  if (searchQuery) {
    const lowerQuery = searchQuery.toLowerCase();
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(lowerQuery) ||
      product.brand.toLowerCase().includes(lowerQuery)
    );
  }

  return filtered;
}

interface CatalogPageProps {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: Promise<{
    search?: string;
  }>;
}

export const dynamic = 'force-dynamic'; // For searchParams handling if needed, or use suspense

export default async function CatalogPage(props: CatalogPageProps) {
  // Await params and searchParams before using them to satisfy Next.js 15+ requirements
  const params = await props.params;
  const searchParams = await props.searchParams;

  const categorySlug = params.slug?.[0];
  const searchQuery = searchParams.search;
  
  const categoryName = categorySlug ? categoryNames[categorySlug] || "Каталог" : "Все товары";
  const products = await getProducts(categorySlug, searchQuery);

  return (
    <div className="container py-6 md:py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
        <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
        {categorySlug && (
          <>
             <ChevronRight className="h-4 w-4 mx-2" />
             <span className="text-foreground font-medium">{categoryName}</span>
          </>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters (Placeholder for now) */}
        <div className="w-full md:w-64 shrink-0 hidden md:block">
           <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Категории</h3>
                <div className="space-y-2">
                  {Object.entries(categoryNames).map(([slug, name]) => {
                    if (slug === 'all' || slug === 'promo' || slug === 'new') return null;
                    const isActive = categorySlug === slug;
                    return (
                      <Link 
                        key={slug} 
                        href={`/catalog/${slug}`}
                        className={`block text-sm transition-colors ${isActive ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                      >
                        {name}
                      </Link>
                    )
                  })}
                  <Link 
                    href="/catalog"
                    className={`block text-sm transition-colors pt-2 ${!categorySlug ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    Все товары
                  </Link>
                </div>
              </div>
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              {searchQuery ? `Поиск: "${searchQuery}"` : categoryName}
            </h1>
            <p className="text-muted-foreground">
              Найдено товаров: {products.length}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
