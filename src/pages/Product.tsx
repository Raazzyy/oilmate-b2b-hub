import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Minus, Plus } from "lucide-react";
import oilProductImage from "@/assets/oil-product.png";
import { useState } from "react";

// Временные данные товаров (в реальном приложении будут из API)
const productsData: Record<string, {
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string;
  oilType: string;
  isUniversal: boolean;
  description: string;
  specifications: { label: string; value: string }[];
}> = {
  "1": {
    name: "Shell Helix Ultra 5W-40 синтетическое",
    brand: "Shell",
    volume: "4 л",
    price: 3299,
    oldPrice: 3899,
    image: oilProductImage,
    oilType: "Синтетическое",
    isUniversal: true,
    description: "Shell Helix Ultra 5W-40 — полностью синтетическое моторное масло, разработанное для обеспечения максимальной защиты двигателя и его чистоты. Создано с применением технологии Shell PurePlus, которая превращает природный газ в кристально чистое базовое масло.",
    specifications: [
      { label: "Вязкость", value: "5W-40" },
      { label: "Тип", value: "Синтетическое" },
      { label: "Объем", value: "4 л" },
      { label: "Производитель", value: "Shell" },
      { label: "Страна", value: "Германия" },
      { label: "Допуски", value: "API SN/CF, ACEA A3/B3, A3/B4" },
      { label: "Применение", value: "Бензиновые и дизельные двигатели" },
    ],
  },
  "2": {
    name: "Mobil 1 ESP Formula 5W-30 синтетическое",
    brand: "Mobil",
    volume: "4 л",
    price: 4150,
    image: oilProductImage,
    oilType: "Синтетическое",
    isUniversal: true,
    description: "Mobil 1 ESP Formula 5W-30 — синтетическое моторное масло с улучшенными эксплуатационными характеристиками, специально разработанное для продления срока службы и поддержания эффективности систем снижения токсичности выхлопных газов.",
    specifications: [
      { label: "Вязкость", value: "5W-30" },
      { label: "Тип", value: "Синтетическое" },
      { label: "Объем", value: "4 л" },
      { label: "Производитель", value: "Mobil" },
      { label: "Страна", value: "США" },
      { label: "Допуски", value: "API SN, ACEA C2/C3" },
      { label: "Применение", value: "Бензиновые и дизельные двигатели с сажевыми фильтрами" },
    ],
  },
};

const Product = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const product = id ? productsData[id] : null;

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12">
          <div className="container text-center">
            <h1 className="text-2xl font-bold mb-4">Товар не найден</h1>
            <Link to="/" className="text-primary hover:underline">
              Вернуться на главную
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const rubles = Math.floor(product.price);
  const kopecks = Math.round((product.price - rubles) * 100) || 99;
  const oldRubles = product.oldPrice ? Math.floor(product.oldPrice) : null;
  const oldKopecks = product.oldPrice ? Math.round((product.oldPrice - Math.floor(product.oldPrice)) * 100) || 99 : null;
  const discountPercent = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-6">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Главная</Link>
            <span>/</span>
            <Link to="/catalog/all" className="hover:text-primary">Каталог</Link>
            <span>/</span>
            <span className="text-foreground line-clamp-1">{product.name}</span>
          </nav>

          {/* Back button */}
          <Link 
            to="/catalog/all" 
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад в каталог
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Product image */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-3xl bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain p-8"
                />
              </div>
              
              {/* Discount badge */}
              {discountPercent && discountPercent > 0 && (
                <span className="absolute left-4 bottom-4 rounded-lg bg-warning px-3 py-1.5 text-sm font-bold text-warning-foreground">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Product info */}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-4">
                {product.name}
              </h1>

              {/* Parameters */}
              <p className="text-sm text-muted-foreground mb-6">
                {product.volume} · {product.oilType} · {product.brand}
                {product.isUniversal && " · Универсальное"}
              </p>

              {/* Price */}
              <div className="mb-6">
                {product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through block mb-1">
                    {oldRubles}<sup className="text-xs">{String(oldKopecks).padStart(2, '0')}</sup>₽
                  </span>
                )}
                <div className={`inline-flex items-baseline ${product.oldPrice ? 'bg-warning px-2 py-1 rounded-lg' : ''}`}>
                  <span className="text-3xl font-bold text-foreground">
                    {rubles.toLocaleString("ru-RU")}
                  </span>
                  <sup className="text-sm font-bold text-foreground ml-0.5">
                    {kopecks.toString().padStart(2, '0')}
                  </sup>
                  <span className="text-2xl font-bold text-foreground ml-1">₽</span>
                </div>
              </div>

              {/* Quantity and cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 border border-border rounded-full px-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Button className="flex-1 h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                  В корзину
                </Button>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-foreground mb-3">Описание</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Specifications */}
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-3">Характеристики</h2>
                <div className="space-y-2">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{spec.label}</span>
                      <span className="text-sm font-medium text-foreground">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Product;
