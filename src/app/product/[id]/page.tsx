import { categoryNames, allProducts, ProductData } from "@/data/products";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/ProductImageGallery";
import ProductDetailControls from "@/components/ProductDetailControls";
import { getProductById, getStrapiMedia, getProducts as fetchStrapiProducts, StrapiProduct } from "@/lib/strapi";
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
      return {
        id: item.id,
        documentId: item.documentId,
        name: item.name,
        brand: item.brand || "",
        volume: item.volume || "",
        price: item.price,
        oldPrice: item.oldPrice,
        image: getStrapiMedia(item.image?.url) || "/oil-product.png",
        inStock: item.inStock || false,
        oilType: item.oilType || "",
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
      };
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
      title: "Товар не найден",
    };
  }

  return {
    title: `${product.name} | OilMate`,
    description: `Купить ${product.name} оптом. ${product.brand} - ${product.volume}. Выгодные цены для бизнеса.`,
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

  const relatedProducts: ProductData[] = (relatedResponse.data as StrapiProduct[]).map((item) => ({
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
  }));

  const rubles = Math.floor(product.price);
  const kopecks = Math.round((product.price - rubles) * 100) || 0;
  
  const oldRubles = product.oldPrice ? Math.floor(product.oldPrice) : null;
  const oldKopecks = product.oldPrice ? Math.round((product.oldPrice - Math.floor(product.oldPrice)) * 100) || 0 : null;

  return (
    <div className="bg-background min-h-screen">
      <div className="container py-4 md:py-8">
        {/* Back Button */}
        <Link href="/catalog" className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-white bg-[#3b82f6] rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
          <ChevronLeft className="h-4 w-4" />
          Назад в каталог
        </Link>

        <div className="grid md:grid-cols-12 gap-8 lg:gap-16">
          {/* Left: Images */}
          <div className="md:col-span-6 lg:col-span-5">
            <ProductImageGallery image={product.image} name={product.name} />
          </div>

          {/* Right: Info */}
          <div className="md:col-span-6 lg:col-span-7 flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-3">
              {product.name}
            </h1>
            
            <p className="text-sm text-muted-foreground mb-6">
              {product.volume} - {product.oilType} - {product.brand} - {product.isUniversal ? "Универсальное" : "Специальное"}
            </p>

            {/* Price Block */}
            <div className="flex flex-col mb-8">
              {product.oldPrice && (
                <span className="text-lg text-muted-foreground line-through decoration-muted-foreground/50 mb-1 ml-1">
                  {oldRubles}<sup className="text-[10px]">{String(oldKopecks).padStart(2, '0')}</sup>₽
                </span>
              )}
              <div className={`inline-flex items-baseline w-fit px-6 py-2 rounded-xl dark:bg-muted/30 border border-transparent ${product.oldPrice ? 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/5' : 'bg-[#f2f4f7]'}`}>
                <span className="text-4xl font-black text-foreground tracking-tighter">
                  {rubles.toLocaleString("ru-RU")}
                </span>
                <sup className="ml-0.5 text-xl font-bold text-foreground">
                  {kopecks.toString().padStart(2, '0')}
                </sup>
                <span className="ml-1.5 text-2xl font-bold text-foreground">₽</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 ml-1">
                Цена указана с НДС 20%
              </p>
            </div>

            {/* Controls — quantity + cart */}
            <ProductDetailControls product={product} />

            {/* Characteristics */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">Характеристики</h3>
              <div className="space-y-0 text-sm">
                {[
                  { label: "Вязкость", value: product.viscosity },
                  { label: "Тип", value: product.oilType },
                  { label: "Объем", value: product.volume },
                  { label: "Производитель", value: product.brand },
                  { label: "Страна", value: "Германия" }, // Placeholder as per design
                  { label: "Допуски", value: product.approvals },
                  { label: "Применение", value: product.application || "Бензиновые и дизельные двигатели" }
                ].filter(s => s.value).map((spec, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-border/40 hover:bg-muted/5 transition-colors px-1">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-semibold text-right">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-16">
           <h2 className="text-2xl font-bold mb-6">Описание</h2>
           <div className="text-muted-foreground leading-relaxed space-y-4 text-base">
             <p>
               {product.name} — полностью синтетическое моторное масло, разработанное для обеспечения максимальной защиты двигателя и его чистоты. 
               Создано с применением инновационных технологий, которые превращают базовые компоненты в высококачественный продукт для современных автомобилей.
             </p>
           </div>
        </div>

        {/* Similar Products */}
        <div className="mt-20">
           <ProductsSection title="Смотрите также" products={relatedProducts} />
        </div>
      </div>
    </div>
  );
}
