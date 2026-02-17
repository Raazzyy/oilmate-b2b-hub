
import { allProducts, categoryNames } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingCart, Check, ChevronRight, Star, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/ProductImageGallery"; // We'll create this small client component
import AddToCartButton from "@/components/AddToCartButton"; // We'll create this to handle client-side cart logic

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

async function getProduct(id: string) {
  // Simulate network delay
  // await new Promise(resolve => setTimeout(resolve, 500));
  return allProducts.find(p => p.id.toString() === id);
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

  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) 
    : 0;

  return (
    <div className="container py-6 md:py-10">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
        <Link href="/" className="hover:text-primary transition-colors">Главная</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href={`/catalog/${product.category}`} className="hover:text-primary transition-colors">
          {categoryNames[product.category]}
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Images */}
        <div>
           <ProductImageGallery image={product.image} name={product.name} />
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
               {product.inStock ? (
                 <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                   В наличии
                 </span>
               ) : (
                 <span className="text-xs font-medium px-2 py-1 bg-muted text-muted-foreground rounded-full">
                   Нет в наличии
                 </span>
               )}
               <span className="text-xs text-muted-foreground">Артикул: {product.id.toString().padStart(6, '0')}</span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2 mb-4">
               <div className="flex">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <Star 
                     key={star} 
                     className={`h-4 w-4 ${star <= (product.rating || 5) ? "fill-orange-400 text-orange-400" : "fill-muted text-muted"}`} 
                   />
                 ))}
               </div>
               <Link href="#reviews" className="text-sm text-primary hover:underline">
                 Смотреть отзывы
               </Link>
            </div>
          </div>

          <div className="p-6 bg-card border rounded-2xl shadow-sm mb-6">
             <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-primary">
                  {product.price.toLocaleString()} ₽
                </span>
                {product.oldPrice && (
                  <div className="flex flex-col mb-1">
                    <span className="text-sm text-muted-foreground line-through">
                      {product.oldPrice.toLocaleString()} ₽
                    </span>
                    <span className="text-xs text-destructive font-bold">
                       Скидка {discount}%
                    </span>
                  </div>
                )}
             </div>

             <div className="flex flex-col gap-3">
                 <AddToCartButton product={product} />
                 
                 <p className="text-xs text-muted-foreground text-center mt-2">
                   Минимальная сумма заказа для бесплатной доставки — 15 000 ₽
                 </p>
             </div>
          </div>

          {/* Characteristics */}
          <div className="mb-8">
            <h3 className="font-semibold text-lg mb-4">Характеристики</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
               <div className="flex justify-between py-2 border-b border-border/50">
                 <span className="text-muted-foreground">Бренд</span>
                 <span className="font-medium">{product.brand}</span>
               </div>
               <div className="flex justify-between py-2 border-b border-border/50">
                 <span className="text-muted-foreground">Тип масла</span>
                 <span className="font-medium">{product.oilType}</span>
               </div>
               <div className="flex justify-between py-2 border-b border-border/50">
                 <span className="text-muted-foreground">Объем</span>
                 <span className="font-medium">{product.volume}</span>
               </div>
               {product.viscosity && (
                 <div className="flex justify-between py-2 border-b border-border/50">
                   <span className="text-muted-foreground">Вязкость (SAE)</span>
                   <span className="font-medium">{product.viscosity}</span>
                 </div>
               )}
               {product.specification && (
                 <div className="flex justify-between py-2 border-b border-border/50">
                   <span className="text-muted-foreground">Спецификация</span>
                   <span className="font-medium">{product.specification}</span>
                 </div>
               )}
               {product.approvals && (
                 <div className="flex justify-between py-2 border-b border-border/50">
                   <span className="text-muted-foreground">Допуски</span>
                   <span className="font-medium text-right">{product.approvals}</span>
                 </div>
               )}
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                <Truck className="h-6 w-6 text-primary shrink-0" />
                <div>
                   <h4 className="font-semibold text-sm mb-1">Быстрая доставка</h4>
                   <p className="text-xs text-muted-foreground">По всей России от 2 дней</p>
                </div>
             </div>
             <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
                <div>
                   <h4 className="font-semibold text-sm mb-1">Гарантия качества</h4>
                   <p className="text-xs text-muted-foreground">Сертифицированная продукция</p>
                </div>
             </div>
             <div className="flex items-start gap-3 p-4 bg-muted/30 rounded-xl">
                <RefreshCw className="h-6 w-6 text-primary shrink-0" />
                <div>
                   <h4 className="font-semibold text-sm mb-1">Возврат и обмен</h4>
                   <p className="text-xs text-muted-foreground">В течение 14 дней</p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
