import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal } from "lucide-react";
import { useParams } from "react-router-dom";
import oilProductImage from "@/assets/oil-product.png";
import { useState } from "react";

interface ProductData {
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock: boolean;
  oilType: string;
  isUniversal?: boolean;
  category: string;
  viscosity?: string;
  approvals?: string;
  specification?: string;
  viscosityClass?: string;
  application?: string;
  standard?: string;
  color?: string;
  type?: string;
}

const allProducts: ProductData[] = [
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
    viscosity: "5W-40",
    approvals: "MB 229.5",
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
    viscosity: "5W-30",
    approvals: "ACEA C3",
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
    viscosity: "5W-30",
    approvals: "BMW LL-04",
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
    viscosity: "5W-40",
    approvals: "API SN",
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
    viscosity: "5W-30",
    approvals: "ACEA C3",
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
    viscosity: "75W-90",
    specification: "GL-5",
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
    viscosity: "75W-90",
    specification: "GL-5",
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
    viscosity: "75W-90",
    specification: "GL-4",
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
    viscosityClass: "HLP 46",
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
    application: "Компрессорное",
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
    type: "Готовый",
    standard: "G12+",
    color: "Красный",
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
    type: "Готовый",
    standard: "G11",
    color: "Зеленый",
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

const filterCategories = [
  { id: "motor", name: "Моторные" },
  { id: "transmission", name: "Трансмиссионные" },
  { id: "hydraulic", name: "Гидравлические" },
  { id: "industrial", name: "Индустриальные" },
  { id: "antifreeze", name: "Антифризы" },
];

const brands = ["Shell", "Mobil", "Castrol", "Лукойл", "Total", "Mannol", "Liqui Moly", "Felix", "Sintec", "Fuchs"];
const volumes = ["1 л", "4 л", "5 л", "20 л"];

// Специфичные фильтры для каждой категории
const categorySpecificFilters: Record<string, { label: string; options: string[] }[]> = {
  motor: [
    { label: "Тип масла", options: ["Синтетическое", "Полусинтетика", "Минеральное"] },
    { label: "Вязкость", options: ["0W-20", "0W-30", "5W-30", "5W-40", "10W-40", "15W-40"] },
    { label: "Допуски", options: ["API SN", "API SP", "ACEA C3", "MB 229.5", "VW 502/505", "BMW LL-04"] },
  ],
  transmission: [
    { label: "Тип масла", options: ["Синтетическое", "Полусинтетика", "Минеральное"] },
    { label: "Вязкость", options: ["75W-80", "75W-90", "80W-90"] },
    { label: "Спецификация", options: ["GL-4", "GL-5", "ATF"] },
  ],
  hydraulic: [
    { label: "Тип масла", options: ["Синтетическое", "Минеральное"] },
    { label: "Класс вязкости", options: ["HLP 32", "HLP 46", "HLP 68", "HVLP 46"] },
  ],
  industrial: [
    { label: "Тип масла", options: ["Синтетическое", "Минеральное"] },
    { label: "Применение", options: ["Компрессорное", "Редукторное", "Турбинное", "Цепное"] },
  ],
  antifreeze: [
    { label: "Тип", options: ["Готовый", "Концентрат"] },
    { label: "Стандарт", options: ["G11", "G12", "G12+", "G12++", "G13"] },
    { label: "Цвет", options: ["Красный", "Зеленый", "Синий", "Желтый"] },
  ],
};

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
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              selected.includes(item)
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted-foreground/20"
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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, string[]>>({});
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

  const selectCategory = (catId: string) => {
    if (selectedCategory === catId) {
      setSelectedCategory(null);
      setCategoryFilters({});
    } else {
      setSelectedCategory(catId);
      setCategoryFilters({});
    }
  };

  const toggleCategoryFilter = (filterLabel: string, value: string) => {
    setCategoryFilters(prev => {
      const current = prev[filterLabel] || [];
      if (current.includes(value)) {
        return { ...prev, [filterLabel]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [filterLabel]: [...current, value] };
      }
    });
  };

  // Определяем активную категорию для показа специфичных фильтров
  const activeCategory = selectedCategory 
    || (category && category !== "all" && category !== "promo" && category !== "new" ? category : null);

  const filteredProducts = allProducts.filter((product) => {
    // Фильтр по URL категории (если не выбрана категория в фильтрах)
    if (category && category !== "all" && category !== "promo" && category !== "new") {
      if (!selectedCategory && product.category !== category) return false;
    }
    
    // Фильтр по выбранной категории
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
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
    setSelectedCategory(null);
    setCategoryFilters({});
    setSelectedVolumes([]);
    setPriceFrom("");
    setPriceTo("");
  };

  const hasActiveFilters = selectedBrands.length > 0 || selectedCategory || Object.keys(categoryFilters).some(k => categoryFilters[k].length > 0) || selectedVolumes.length > 0 || priceFrom || priceTo;

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

                {/* Category filter */}
                <div className="mb-6">
                  <span className="text-sm text-muted-foreground mb-3 block">Категория</span>
                  <div className="flex flex-wrap gap-2">
                    {filterCategories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => selectCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          selectedCategory === cat.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground hover:bg-muted-foreground/20"
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
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

                {/* Category-specific filters */}
                {activeCategory && categorySpecificFilters[activeCategory] && (
                  <div className="mb-4">
                    <div className="text-xs text-primary font-medium mb-3 uppercase tracking-wide">
                      {categoryNames[activeCategory]}
                    </div>
                    {categorySpecificFilters[activeCategory].map(filter => (
                      <div key={filter.label} className="mb-4">
                        <span className="text-sm text-muted-foreground mb-2 block">{filter.label}</span>
                        <ChipFilter
                          items={filter.options}
                          selected={categoryFilters[`${activeCategory}_${filter.label}`] || []}
                          onToggle={(item) => toggleCategoryFilter(`${activeCategory}_${filter.label}`, item)}
                          visibleCount={4}
                        />
                      </div>
                    ))}
                  </div>
                )}

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
