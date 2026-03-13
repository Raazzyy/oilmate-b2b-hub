import { cn } from "@/lib/utils";
import { categoryNames, allProducts, ProductData } from "@/data/products";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductDetailControls from "@/components/ProductDetailControls";
import { getProductById, getStrapiMedia, getProducts as fetchStrapiProducts, mapStrapiProduct, StrapiProduct } from "@/lib/strapi";
import ProductsSection from "@/components/ProductsSection";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string): Promise<ProductData | null> {
  // Try Strapi first
  try {
    const item = await getProductById(id);
    if (item) {
      return mapStrapiProduct(item);
    }
  } catch {
    // Strapi unavailable, fall through to local data
  }

  // Fallback: look up in local static data by id or documentId
  const parsed = parseInt(id, 10);
  const localProduct = allProducts.find(
    (p) => p.id === parsed || p.id === id || p.documentId === id
  );
  return localProduct || null;
}


export async function generateMetadata(props: ProductPageProps) {
  const params = await props.params;
  const product = await getProduct(params.id);
  
  if (!product) {
    return {
      title: "Товар не найден | OilMate",
    };
  }

  // Get SEO data or fallbacks
  // Note: We need to cast product to any to access the 'seo' field we just added to StrapiProduct
  // but passed through getProduct which returns ProductData. 
  // Let's rely on getProduct returning the raw strapi data mixed in or fetch fresh for metadata?
  // Ideally getProduct should return the SEO info. 
  // For now, let's fetch strictly for metadata to be safe and clean, or update ProductData interface.
  // Actually, updating getProduct/ProductData is better.
  // But for speed, let's re-fetch or assume getProduct was updated?
  // Let's update getProduct to return seo data as well.
  
  // WAIT: getProduct transforms StrapiProduct -> ProductData.
  // ProductData doesn't have 'seo'.
  // We should fetch the raw Strapi Product here for full SEO context.
  // Try to get Strapi SEO data, but gracefully fallback if Strapi is offline
  let strapiProduct = null;
  try {
    strapiProduct = await getProductById(params.id);
  } catch {
    // Strapi unavailable — use basic metadata from local product data
  }

  // If no Strapi product, return basic metadata from local data
  if (!strapiProduct) {
    return {
      title: `${product.name} | OilMate`,
      description: `Купить ${product.name} оптом. Бренд: ${product.brand}. Объем: ${product.volume}.`,
    };
  }

  const seo = strapiProduct.seo || {};
  
  const title = (seo.metaTitle as string) || `${product.name} | OilMate`;
  const description = (seo.metaDescription as string) || `Купить ${product.name} оптом. Бренд: ${product.brand}. Объем: ${product.volume}. Выгодные цены для бизнеса.`;
  const images = [];

  if (seo.metaImage?.url) {
    const media = getStrapiMedia(seo.metaImage.url);
    if (media) images.push(media);
  } else if (product.image) {
     images.push(product.image);
  }

  const canonical = (seo.canonicalURL as string) || `https://oilmate-b2b-hub.vercel.app/product/${product.documentId}`;
  
  const ogImages = images.filter(Boolean).map(url => ({
    url: url as string,
    width: 800,
    height: 600,
    alt: title,
  }));

  return {
    title,
    description,
    keywords: seo.keywords,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'OilMate B2B',
      images: ogImages,
      locale: 'ru_RU',
      type: 'website',
    },
    alternates: {
      canonical: canonical,
    },
  };
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  // Fetch related products
  const relatedResponse = await fetchStrapiProducts({
    filters: {
      category: { slug: { $eq: product.category } },
      documentId: { $ne: product.documentId }
    },
    pagination: { limit: 10 }
  });

  const relatedProducts: ProductData[] = (relatedResponse.data as StrapiProduct[]).map(mapStrapiProduct);

  const rubles = Math.floor(product.price);
  const kopecks = Math.round((product.price - rubles) * 100) || 0;
  
  const oldRubles = product.oldPrice ? Math.floor(product.oldPrice) : null;
  const oldKopecks = product.oldPrice ? Math.round((product.oldPrice - Math.floor(product.oldPrice)) * 100) || 0 : null;

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-4 md:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
          <Link href="/" className="hover:text-primary transition-colors bg-muted/60 hover:bg-muted px-3 py-1 rounded-full">
            Главная
          </Link>
          <span className="opacity-40 text-xs">/</span>
          <Link href="/catalog" className="hover:text-primary transition-colors bg-muted/60 hover:bg-muted px-3 py-1 rounded-full">
            Каталог
          </Link>
          {product.category && categoryNames[product.category] && (
            <>
              <span className="opacity-40 text-xs">/</span>
              <Link href={`/catalog/${product.category}`} className="hover:text-primary transition-colors bg-muted/60 hover:bg-muted px-3 py-1 rounded-full">
                {categoryNames[product.category]}
              </Link>
            </>
          )}
          <span className="opacity-40 text-xs">/</span>
          <span className="text-foreground font-medium bg-muted px-3 py-1 rounded-full">{product.name}</span>
        </nav>

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.name,
              image: product.image,
              description: `Моторное масло ${product.name} ${product.volume} ${product.brand}`,
              brand: {
                "@type": "Brand",
                name: product.brand
              },
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "RUB",
                lowPrice: product.price, // B2B often has ranges, for now efficient low/high logic or just single price
                highPrice: product.oldPrice || product.price, 
                offerCount: 1,
                availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                audience: {
                  "@type": "BusinessAudience",
                  audienceType: "B2B"
                }
              }
            })
          }}
        />

        <div className="grid md:grid-cols-12 gap-8 lg:gap-16">
          {/* Left: Images */}
          <div className="md:col-span-6 lg:col-span-5">
            <ProductImageGallery image={product.image} images={product.images} name={product.name} />
          </div>

          {/* Right: Info */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
              {product.name}
            </h1>
            
            {/* SKU */}
            {product.sku && (
              <p className="text-sm text-muted-foreground mb-2">
                Артикул: {product.sku}
              </p>
            )}
            
            {/* Stock indicator */}
            {(product.stock ?? 0) > 0 ? (
              <p className={cn("text-sm text-green-600 dark:text-green-400 font-medium flex items-center gap-1.5", product.sku ? "mb-4" : "mb-4")}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                В наличии — {product.stock} шт.
              </p>
            ) : (
              <p className={cn("text-sm text-red-500 font-medium", product.sku ? "mb-4" : "mb-4")}>
                Нет в наличии
              </p>

            )}

            {/* Price Block */}
            <div className="flex flex-col mb-6">
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/50 mb-1 ml-1">
                  {oldRubles}₽
                </span>
              )}
              <div className={`inline-flex items-baseline w-fit px-6 py-2 rounded-xl dark:bg-muted/30 border border-transparent ${product.oldPrice ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/5' : 'bg-[#f2f4f7]'}`}>
                <span className="text-4xl font-black text-foreground tracking-tighter">
                  {rubles.toLocaleString("ru-RU")}
                </span>
                <span className="ml-1.5 text-2xl font-bold text-foreground">₽</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 ml-1">
                Цена указана с НДС 20%
              </p>
            </div>

            {/* Controls — quantity + cart */}
            <div className="mb-5">
              <ProductDetailControls product={product} />
            </div>

            {/* Official Supplier Block */}
            {product.supplierName && (
              <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl bg-muted/60 mb-5 border border-border/50">
                {product.supplierLogo ? (
                  <div className="w-12 h-12 flex-shrink-0 relative rounded-xl overflow-hidden bg-white border border-border">
                    <img 
                      src={typeof product.supplierLogo === 'string' ? product.supplierLogo : (product.supplierLogo as { src: string })?.src || ''} 
                      alt={product.supplierName}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-white border border-border flex items-center justify-center font-bold text-lg text-foreground">
                    {product.supplierName.charAt(0)}
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-foreground">
                    {product.supplierName}
                  </span>
                  {product.supplierDescription && (
                    <span className="text-xs text-muted-foreground mt-0.5">
                      {product.supplierDescription}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Characteristics */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Характеристики</h3>
              <div className="space-y-0 text-sm">
                {(() => {
                  const labels: Record<string, string> = {
                    viscosity: "Вязкость",
                    oilType: "Тип масла",
                    volume: "Объем",
                    brand: "Производитель",
                    country: "Страна",
                    approvals: "Допуски",
                    specification: "Спецификация",
                    viscosityClass: "Класс вязкости",
                    standard: "Стандарт",
                    color: "Цвет",
                    application: "Применение",
                    type: "Тип",
                  };

                  return Object.entries(labels)
                    .map(([key, label]) => ({
                      label,
                      value: product[key as keyof ProductData] as string
                    }))
                    .filter(s => s.value && typeof s.value === 'string' && s.value.trim() !== "")
                    .map((spec, i) => (
                      <div key={i} className="flex justify-between py-3 border-b border-border/40 hover:bg-muted/5 transition-colors px-1">
                        <span className="text-muted-foreground">{spec.label}</span>
                        <span className="font-semibold text-right">{spec.value}</span>
                      </div>
                    ));
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section — only shown if set in Strapi */}
        {product.description && (
          <div className="mt-12 md:mt-16">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Описание</h2>
            <div className="text-muted-foreground leading-relaxed space-y-4 text-base">
              {product.description.split('\n').filter(Boolean).map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Similar Products — outside inner container so it doesn't have double padding */}
      {relatedProducts.length > 0 && (
        <div className="">
          <ProductsSection title="Смотрите также" products={relatedProducts} />
        </div>
      )}
    </div>
  );
}
