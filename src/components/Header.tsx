"use client";

import { Search, ShoppingCart, Menu, X, ChevronRight, Droplet, Cog, Droplets, Factory, Snowflake, Wrench, Loader2, LayoutGrid, HelpCircle, MapPin, ChevronDown, Check, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { categoryNames, ProductData } from "@/data/products";
import { cities } from "@/data/cities";
import { useCartStore } from "@/store/cart";
import { getProducts, mapStrapiProduct, getStrapiMedia, StrapiCategory, StrapiNavigationItem } from "@/lib/strapi";

const getCategoryIcon = (slug: string) => {
  if (!slug) return HelpCircle;
  if (slug.includes('motor')) return Droplet;
  if (slug.includes('trans')) return Cog;
  if (slug.includes('gidrav') || slug.includes('hydraul')) return Droplets;
  if (slug.includes('indust')) return Factory;
  if (slug.includes('smaz') || slug.includes('lubric')) return Wrench;
  if (slug.includes('anti')) return Snowflake;
  return Droplet;
};

const getCategoryColor = (slug: string) => {
  if (!slug) return "text-foreground";
  if (slug.includes('anti')) return "text-blue-500 dark:text-blue-400";
  return "text-foreground";
};



const Header = ({ 
  categories = [], 
  navigation = [], 
  allProductsImage 
}: { 
  categories?: StrapiCategory[], 
  navigation?: StrapiNavigationItem[],
  allProductsImage?: string
}) => {
  const { getTotalItems, setIsCartOpen, isClient, setClient, selectedCity, setSelectedCity } = useCartStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCityOpen, setIsCityOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setClient();
  }, [setClient]);

  // Track scroll for sticky mobile search
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = isClient ? getTotalItems() : 0;
  const showResults = isSearchFocused && searchQuery.trim().length > 0;

  // Search logic with Strapi
  const fetchSearchResults = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const lowerQuery = query.toLowerCase();
      const capitalizedQuery = query.charAt(0).toUpperCase() + query.slice(1).toLowerCase();
      
      const response = await getProducts({
        filters: {
          $or: [
            { name: { $containsi: query } },
            { name: { $containsi: lowerQuery } },
            { name: { $containsi: capitalizedQuery } },
            { brand: { $containsi: query } },
            { brand: { $containsi: lowerQuery } },
            { brand: { $containsi: capitalizedQuery } }
          ]
        },
        pagination: { limit: 6 }
      });

      const mappedProducts = response.data.map(mapStrapiProduct);
      setSearchResults(mappedProducts);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchSearchResults(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchSearchResults]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (catalogRef.current && !catalogRef.current.contains(event.target as Node)) {
        setIsCatalogOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleProductClick = (productId: number | string) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    setIsMobileMenuOpen(false);
    router.push(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setIsMobileMenuOpen(false);
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCategoryClick = (categoryId: string) => {
    setIsCatalogOpen(false);
    setIsMobileMenuOpen(false);
    router.push(`/catalog/${categoryId}`);
  };

  const handleCitySelect = (cityId: string) => {
    setSelectedCity(cityId);
    setIsCityOpen(false);
  };

  const currentCityName = cities.find(c => c.id === selectedCity)?.name || "Владивосток";

  return (
    <>
      {/* Sticky mobile search on scroll */}
      <div className={`fixed top-0 left-0 right-0 z-40 md:hidden bg-card/95 backdrop-blur-lg px-3 py-2 rounded-b-3xl transition-all duration-300 ${
        isScrolled ? "translate-y-0 opacity-100 shadow-[0_2px_20px_rgba(0,0,0,0.06)]" : "-translate-y-full opacity-0 pointer-events-none"
      }`}>
        <form onSubmit={handleSearchSubmit} className="relative">
          <Input
            placeholder="Поиск..."
            className="h-10 pl-4 pr-10 rounded-full border-2 border-border focus:border-border focus-visible:ring-0 focus-visible:ring-offset-0 bg-background w-full text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
          />
          {searchQuery && (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="absolute right-9 top-0.5 h-9 w-9 rounded-full hover:bg-muted"
              onClick={() => { setSearchQuery(""); }}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
          <Button
            type="submit"
            size="icon"
            variant="ghost"
            className="absolute right-0.5 top-0.5 h-9 w-9 rounded-full hover:bg-muted"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
          </Button>
        </form>
      </div>

      <header className="w-full bg-card">
        {/* Top navigation - hidden on mobile */}
        <div className="hidden md:block">
          <div className="container">
            <nav className="flex items-center justify-between pt-5 pb-0 text-sm">
              <div className="flex items-center gap-6">
                {navigation.length > 0 ? (
                  navigation.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  ["Новости", "Акции", "Оптовикам", "Доставка", "О компании", "Контакты"].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  ))
                )}
              </div>

              {/* Desktop City Selector */}
              <button
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group"
                onClick={() => setIsCityOpen(true)}
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-medium">
                  {currentCityName}
                </span>
                <ChevronDown className="h-3.5 w-3.5 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile City Selector */}
        <div className="md:hidden container pt-2 pb-0">
          <button
            className="flex items-center gap-1 text-sm text-muted-foreground"
            onClick={() => setIsCityOpen(true)}
          >
            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
            <span className="font-medium">
              {currentCityName}
            </span>
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Main header */}
        <div className="container py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-12 w-12 shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-7 w-7" />
            </Button>
            

            {/* Catalog button with dropdown - desktop only */}
            <div className="relative hidden md:block" ref={catalogRef}>
              <Button 
                className="flex gap-2 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold px-6 h-12 rounded-full shrink-0 transition-all font-bold"
                onClick={() => setIsCatalogOpen(!isCatalogOpen)}
              >
                {isCatalogOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                Каталог
              </Button>

                   {/* Catalog Dropdown */}
               {isCatalogOpen && (
                 <div className="absolute top-full left-0 mt-2 w-80 bg-card rounded-2xl overflow-hidden z-50 shadow-lg border border-border">
                   <div className="p-2">
                     {categories.map((category) => {
                       const IconComponent = getCategoryIcon(category.slug || '');
                       const iconColor = getCategoryColor(category.slug || '');
                       return (
                         <button
                           key={category.id}
                           className="w-full flex items-center gap-4 p-3 hover:bg-muted rounded-xl transition-colors text-left group"
                           onClick={() => handleCategoryClick(category.slug)}
                         >
                           <div className="w-10 h-10 rounded-sm bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
                             {category.image?.url ? (
                               <Image 
                                 src={getStrapiMedia(category.image.url) as string} 
                                 alt={category.name} 
                                 fill 
                                 className="object-cover" 
                               />
                             ) : (
                               <IconComponent className={`h-5 w-5 ${iconColor}`} />
                             )}
                           </div>
                           <p className="font-medium text-foreground flex-1">{category.name}</p>
                           <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                         </button>
                       );
                     })}
                   </div>
                   <div className="p-2 border-t border-border">
                     <Button
                       variant="ghost"
                       className="w-full justify-center text-primary hover:text-primary hover:bg-primary/10 flex items-center gap-2"
                       onClick={() => {
                         setIsCatalogOpen(false);
                         router.push("/catalog");
                       }}
                     >
                       Все товары
                     </Button>
                   </div>
                 </div>
               )}
            </div>

            {/* Search - takes all available space */}
            <div className="flex-1 relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <Input
                    placeholder="Поиск..."
                    className="h-10 md:h-12 pl-4 md:pl-6 pr-10 md:pr-12 rounded-full border-2 border-border focus:border-border focus-visible:ring-0 focus-visible:ring-offset-0 bg-background w-full text-sm md:text-base"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="absolute right-9 md:right-11 top-0.5 md:top-1 h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-muted"
                      onClick={clearSearch}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                  <Button
                    type="submit"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0.5 md:right-1 top-0.5 md:top-1 h-9 w-9 md:h-10 md:w-10 rounded-full hover:bg-muted"
                  >
                    {isSearching ? <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" /> : <Search className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl overflow-hidden z-50 shadow-lg border border-border max-h-[70vh] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <>
                      <div className="p-2">
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
                            onClick={() => handleProductClick(product.documentId || product.id)}
                          >
                            <div className="relative w-10 h-10 md:w-12 md:h-12 bg-muted rounded-lg overflow-hidden shrink-0">
                                <Image 
                                  src={typeof product.image === 'string' ? product.image : (product.image as StaticImageData).src} 
                                  alt={product.name}
                                  fill
                                  className="object-contain p-1"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {categoryNames[product.category]}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="font-bold text-primary text-sm">{product.price.toLocaleString()} ₽</p>
                              {product.oldPrice && (
                                <p className="text-xs text-muted-foreground line-through">
                                  {product.oldPrice.toLocaleString()} ₽
                                </p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-border p-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-center text-primary hover:text-primary hover:bg-primary/10"
                          onClick={() => {
                            setIsSearchFocused(false);
                            router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`);
                          }}
                        >
                          Показать все результаты
                        </Button>
                      </div>
                    </>
                  ) : !isSearching ? (
                    <div className="p-6 text-center text-muted-foreground">
                      По запросу «{searchQuery}» ничего не найдено
                    </div>
                  ) : (
                    <div className="p-6 text-center text-muted-foreground flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Поиск...
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-12 w-12 shrink-0"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6 md:h-7 md:w-7" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[70] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute left-0 top-0 bottom-0 w-[85%] max-w-sm bg-card overflow-y-auto shadow-2xl">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-lg">Меню</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Categories */}
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-3">Каталог</p>
              <div className="space-y-1">
                {categories.map((category) => {
                  const IconComponent = getCategoryIcon(category.slug || '');
                  const iconColor = getCategoryColor(category.slug || '');
                  return (
                    <button
                      key={category.id}
                      className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
                      onClick={() => handleCategoryClick(category.slug)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
                        {category.image?.url ? (
                          <Image src={getStrapiMedia(category.image.url) as string} alt={category.name} fill className="object-cover" />
                        ) : (
                          <IconComponent className={`h-5 w-5 ${iconColor}`} />
                        )}
                      </div>
                      <span className="font-medium">{category.name}</span>
                    </button>
                  );
                })}
                <button
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left text-primary"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    router.push("/catalog");
                  }}
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden relative">
                    {allProductsImage ? (
                      <Image src={allProductsImage} alt="Все товары" fill className="object-cover" />
                    ) : (
                      {allProductsImage ? (
                      <Image src={allProductsImage} alt="Все товары" fill className="object-cover" />
                    ) : (
                      <LayoutGrid className="h-5 w-5 text-foreground" />
                    )}
                    )}
                  </div>
                  <span className="font-medium">Все товары</span>
                </button>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="p-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Информация</p>
              <div className="space-y-1">
                {navigation.length > 0 ? (
                  navigation.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="block p-3 text-foreground hover:bg-muted rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))
                ) : (
                  ["Новости", "Акции", "Оптовикам", "Доставка", "О компании", "Контакты"].map((item) => (
                    <Link
                      key={item}
                      href="#"
                      className="block p-3 text-foreground hover:bg-muted rounded-xl transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item}
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* City Selection Modal */}
      {isCityOpen && (
        <div className="fixed inset-0 z-[80]">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsCityOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-md md:rounded-2xl bg-card rounded-t-2xl md:rounded-2xl overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-xl font-bold">Выберите город</h2>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 hover:bg-muted"
                onClick={() => setIsCityOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-3 space-y-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all text-left group ${
                    selectedCity === city.id
                      ? "bg-primary/10 border-primary/20 border"
                      : "hover:bg-muted border border-transparent"
                  }`}
                  onClick={() => handleCitySelect(city.id)}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    selectedCity === city.id ? "bg-primary/20" : "bg-muted group-hover:bg-primary/10"
                  }`}>
                    <MapPin className={`h-6 w-6 ${selectedCity === city.id ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-base font-bold ${selectedCity === city.id ? "text-primary" : "text-foreground"}`}>
                        {city.name}
                      </span>
                      {selectedCity === city.id && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    
                    <div className="flex flex-col gap-1.5 mt-2">
                      {city.id === "vladivostok" ? (
                        <>
                          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Package className="h-3.5 w-3.5 opacity-70" />
                            Пункт выдачи
                          </span>
                          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Truck className="h-3.5 w-3.5 opacity-70" />
                            Доставка по городу и Приморскому краю
                          </span>
                          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Truck className="h-3.5 w-3.5 opacity-70" />
                            Доставка до ТК
                          </span>
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-sm text-muted-foreground font-medium">
                          <Truck className="h-4 w-4 opacity-70" />
                          Доставка через транспортную компанию
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="p-5 bg-muted/30 border-t border-border mt-1">
              <p className="text-xs text-muted-foreground text-center">
                Выбор города влияет на доступные способы доставки при оформлении заказа
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
