import { Search, ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const [cartCount] = useState(3);

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
          <Button className="hidden md:flex gap-2 gradient-primary hover:gradient-primary-hover text-primary-foreground font-semibold px-6 h-12 rounded-full shrink-0 shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
            <Menu className="h-5 w-5" />
            Каталог
          </Button>

          {/* Search - takes all available space */}
          <div className="flex-1">
            <div className="relative">
              <Input
                placeholder="Поиск"
                className="h-12 pl-4 pr-12 rounded-full border-2 border-border focus:border-primary bg-background w-full"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-1 top-1 h-10 w-10 rounded-full hover:bg-muted"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
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
