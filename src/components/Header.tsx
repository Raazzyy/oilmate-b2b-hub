import { Search, ShoppingCart, MapPin, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const [cartCount] = useState(3);

  return (
    <header className="sticky top-0 z-50 w-full bg-card">
      {/* Top navigation */}
      <div className="border-b border-border">
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
        <div className="flex items-center gap-6">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <span className="text-2xl font-bold text-primary-foreground">М</span>
            </div>
          </a>

          {/* Catalog button */}
          <Button className="hidden md:flex gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 h-12 rounded-full">
            <Menu className="h-5 w-5" />
            Каталог
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                placeholder="Поиск"
                className="h-12 pl-4 pr-12 rounded-full border-2 border-border focus:border-primary bg-background"
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

          {/* Address */}
          <Button variant="ghost" className="hidden lg:flex gap-2 text-muted-foreground hover:text-primary">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Укажите адрес доставки</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* User & Cart */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon" className="relative h-10 w-10">
              <ShoppingCart className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
