import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { searchProducts, categoryNames } from "@/data/products";

const Header = () => {
  const [cartCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const searchResults = searchProducts(searchQuery);
  const showResults = isSearchFocused && searchQuery.trim().length > 0;

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProductClick = (productId: number) => {
    setSearchQuery("");
    setIsSearchFocused(false);
    navigate(`/product/${productId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-card">
      {/* Top navigation */}
      <div>
        <div className="container">
          <nav className="flex items-center gap-6 py-2 text-sm">
            {["Новости", "Акции", "Оптовикам", "Доставка", "О компании", "Контакты"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center gap-4">
          {/* Catalog button */}
          <Button 
            className="hidden md:flex gap-2 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold px-6 h-12 rounded-full shrink-0 transition-all"
            onClick={() => navigate("/catalog")}
          >
            <Menu className="h-5 w-5" />
            Каталог
          </Button>

          {/* Search - takes all available space */}
          <div className="flex-1 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Input
                  placeholder="Поиск товаров..."
                  className="h-12 pl-4 pr-12 rounded-full border-2 border-border focus:border-primary bg-background w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                />
                {searchQuery && (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-11 top-1 h-10 w-10 rounded-full hover:bg-muted"
                    onClick={clearSearch}
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </Button>
                )}
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="absolute right-1 top-1 h-10 w-10 rounded-full hover:bg-muted"
                >
                  <Search className="h-5 w-5 text-muted-foreground" />
                </Button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card rounded-2xl shadow-lg border border-border overflow-hidden z-50">
                {searchResults.length > 0 ? (
                  <>
                    <div className="p-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          className="w-full flex items-center gap-3 p-3 hover:bg-muted rounded-xl transition-colors text-left"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 object-contain bg-muted rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {categoryNames[product.category]} • {product.volume}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-primary">{product.price.toLocaleString()} ₽</p>
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
                          navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
                        }}
                      >
                        Показать все результаты
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    По запросу «{searchQuery}» ничего не найдено
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Button variant="ghost" size="icon" className="relative h-12 w-12 shrink-0">
            <ShoppingCart className="h-6 w-6" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
