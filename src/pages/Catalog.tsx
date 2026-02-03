import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import { useParams } from "react-router-dom";
import oilProductImage from "@/assets/oil-product.png";
import { useState } from "react";

const allProducts = [
  {
    name: "Shell Helix Ultra 5W-40 синтетическое",
    brand: "Shell",
    volume: "4 л",
    price: 3299,
    oldPrice: 3899,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "motor",
  },
  {
    name: "Mobil 1 ESP Formula 5W-30 синтетическое",
    brand: "Mobil",
    volume: "4 л",
    price: 4150,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "motor",
  },
  {
    name: "Castrol EDGE 5W-30 LL синтетическое",
    brand: "Castrol",
    volume: "4 л",
    price: 3850,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: false,
    category: "motor",
  },
  {
    name: "Лукойл Genesis Armortech 5W-40",
    brand: "Лукойл",
    volume: "4 л",
    price: 1890,
    image: oilProductImage,
    inStock: true,
    oilType: "Полусинтетика",
    isUniversal: true,
    category: "motor",
  },
  {
    name: "Total Quartz INEO ECS 5W-30",
    brand: "Total",
    volume: "5 л",
    price: 4299,
    oldPrice: 4799,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "motor",
  },
  {
    name: "Mannol Extra Getriebeoel 75W-90",
    brand: "Mannol",
    volume: "1 л",
    price: 890,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "transmission",
  },
  {
    name: "Liqui Moly Hypoid GL5 75W-90",
    brand: "Liqui Moly",
    volume: "1 л",
    price: 1250,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "transmission",
  },
  {
    name: "Shell Spirax S6 AXME 75W-90",
    brand: "Shell",
    volume: "1 л",
    price: 1490,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: false,
    category: "transmission",
  },
  {
    name: "Mobil ATF 3309",
    brand: "Mobil",
    volume: "1 л",
    price: 780,
    image: oilProductImage,
    inStock: true,
    oilType: "Синтетическое",
    isUniversal: true,
    category: "hydraulic",
  },
  {
    name: "Fuchs Renolin B 46 HVI",
    brand: "Fuchs",
    volume: "20 л",
    price: 8900,
    image: oilProductImage,
    inStock: true,
    oilType: "Минеральное",
    isUniversal: true,
    category: "industrial",
  },
  {
    name: "Felix Prolonger G12+ красный",
    brand: "Felix",
    volume: "5 л",
    price: 690,
    image: oilProductImage,
    inStock: true,
    oilType: "Готовый",
    isUniversal: true,
    category: "antifreeze",
  },
  {
    name: "Sintec Antifreeze Ultra G11 зеленый",
    brand: "Sintec",
    volume: "5 л",
    price: 590,
    oldPrice: 750,
    image: oilProductImage,
    inStock: true,
    oilType: "Готовый",
    isUniversal: true,
    category: "antifreeze",
  },
];

const categoryNames: Record<string, string> = {
  motor: "Моторные масла",
  transmission: "Трансмиссионные масла",
  hydraulic: "Гидравлические масла",
  industrial: "Индустриальные масла",
  antifreeze: "Антифризы",
  all: "Все товары",
  promo: "Все акции",
  new: "Новинки",
};

const brands = ["Shell", "Mobil", "Castrol", "Лукойл", "Total", "Mannol", "Liqui Moly", "Felix", "Sintec", "Fuchs"];
const oilTypes = ["Синтетическое", "Полусинтетика", "Минеральное", "Готовый"];
const volumes = ["1 л", "4 л", "5 л", "20 л"];

const ChipFilter = ({ 
  items, 
  selected, 
  onToggle,
  visibleCount = 5 
}: {
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
  visibleCount?: number;
}) => {
  const [showAll, setShowAll] = useState(false);
  const visibleItems = showAll ? items : items.slice(0, visibleCount);
  const hiddenCount = items.length - visibleCount;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {visibleItems.map((item) => (
          <button
            key={item}
            onClick={() => onToggle(item)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              selected.includes(item)
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-foreground hover:border-primary/50"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {hiddenCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-primary text-sm mt-2 hover:underline"
        >
          Ещё {hiddenCount}
        </button>
      )}
      {showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(false)}
          className="text-primary text-sm mt-2 hover:underline"
        >
          Свернуть
        </button>
      )}
    </div>
  );
};

const Catalog = () => {
  const { category } = useParams();
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categoryTitle = category ? categoryNames[category] || "Каталог" : "Все товары";

  const toggleFilter = (value: string, selected: string[], setSelected: (v: string[]) => void) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  const filteredProducts = allProducts.filter((product) => {
    if (category && category !== "all" && category !== "promo" && category !== "new") {
      if (product.category !== category) return false;
    }
    
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
      return false;
    }
    
    if (selectedTypes.length > 0 && !selectedTypes.includes(product.oilType)) {
      return false;
    }
    
    if (selectedVolumes.length > 0 && !selectedVolumes.includes(product.volume)) {
      return false;
    }

    if (priceFrom && product.price < parseInt(priceFrom)) {
      return false;
    }

    if (priceTo && product.price > parseInt(priceTo)) {
      return false;
    }
    
    return true;
  });

  const resetFilters = () => {
    setSelectedBrands([]);
    setSelectedTypes([]);
    setSelectedVolumes([]);
    setPriceFrom("");
    setPriceTo("");
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedTypes.length > 0 || selectedVolumes.length > 0 || priceFrom || priceTo;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-6">
        <div className="container">
          {/* Breadcrumbs */}
          <nav className="mb-4 text-sm text-muted-foreground">
            <a href="/" className="hover:text-primary">Главная</a>
            <span className="mx-2">/</span>
            <span className="text-foreground">{categoryTitle}</span>
          </nav>

          {/* Title and filter toggle */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-foreground">{categoryTitle}</h1>
            <Button
              variant="outline"
              className="md:hidden gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
            </Button>
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar */}
            <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} md:block`}>
              <div className="sticky top-24 bg-card rounded-2xl p-5">
                <h3 className="font-semibold text-foreground mb-5">Фильтры</h3>
                
                {/* Price filter */}
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground mb-3 block">Цена</span>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="от"
                        value={priceFrom}
                        onChange={(e) => setPriceFrom(e.target.value)}
                        className="pr-6 rounded-xl"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₽</span>
                    </div>
                    <div className="relative flex-1">
                      <Input
                        type="number"
                        placeholder="до"
                        value={priceTo}
                        onChange={(e) => setPriceTo(e.target.value)}
                        className="pr-6 rounded-xl"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₽</span>
                    </div>
                  </div>
                </div>

                {/* Brand filter */}
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground mb-3 block">Бренд</span>
                  <ChipFilter
                    items={brands}
                    selected={selectedBrands}
                    onToggle={(item) => toggleFilter(item, selectedBrands, setSelectedBrands)}
                    visibleCount={5}
                  />
                </div>
                
                {/* Oil type filter */}
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground mb-3 block">Тип масла</span>
                  <ChipFilter
                    items={oilTypes}
                    selected={selectedTypes}
                    onToggle={(item) => toggleFilter(item, selectedTypes, setSelectedTypes)}
                    visibleCount={4}
                  />
                </div>
                
                {/* Volume filter */}
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground mb-3 block">Объем</span>
                  <ChipFilter
                    items={volumes}
                    selected={selectedVolumes}
                    onToggle={(item) => toggleFilter(item, selectedVolumes, setSelectedVolumes)}
                    visibleCount={4}
                  />
                </div>

                {/* Apply button */}
                <Button className="w-full rounded-xl gradient-primary text-primary-foreground">
                  Применить
                </Button>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    className="w-full text-primary mt-2"
                    onClick={resetFilters}
                  >
                    Сбросить фильтры
                  </Button>
                )}
              </div>
            </aside>

            {/* Products grid */}
            <div className="flex-1">
              <div className="mb-4 text-sm text-muted-foreground">
                Найдено: {filteredProducts.length} товаров
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={index} {...product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Товары не найдены</p>
                  <Button
                    variant="link"
                    className="text-primary mt-2"
                    onClick={resetFilters}
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Catalog;
