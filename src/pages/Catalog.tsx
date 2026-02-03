import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, X } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { allProducts, categoryNames, type ProductData } from "@/data/products";

// Filters configuration is now local, products data is imported from @/data/products

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
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryFilters, setCategoryFilters] = useState<Record<string, string[]>>({});
  const [selectedVolumes, setSelectedVolumes] = useState<string[]>([]);
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const clearSearch = () => {
    searchParams.delete("search");
    setSearchParams(searchParams);
  };

  const categoryTitle = searchQuery 
    ? `Результаты поиска: «${searchQuery}»`
    : category 
      ? categoryNames[category] || "Каталог" 
      : "Все товары";

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
    // Фильтр по поисковому запросу
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      const matchesSearch = 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.brand.toLowerCase().includes(lowerQuery) ||
        product.oilType.toLowerCase().includes(lowerQuery) ||
        (product.viscosity && product.viscosity.toLowerCase().includes(lowerQuery)) ||
        (product.approvals && product.approvals.toLowerCase().includes(lowerQuery));
      
      if (!matchesSearch) return false;
    }
    
    // Фильтр по URL категории (если не выбрана категория в фильтрах и нет поиска)
    if (!searchQuery && category && category !== "all" && category !== "promo" && category !== "new") {
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
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-foreground">{categoryTitle}</h1>
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Сбросить поиск
                </button>
              )}
            </div>
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
