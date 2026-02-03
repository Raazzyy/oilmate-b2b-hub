import { Search, ShoppingCart, Phone, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Header = () => {
  const [cartCount] = useState(3);

  return (
    <header className="sticky top-0 z-50 w-full bg-card shadow-sm">
      {/* Top bar */}
      <div className="border-b border-border bg-primary">
        <div className="container flex items-center justify-between py-2 text-sm text-primary-foreground">
          <div className="flex items-center gap-6">
            <span>Оптовые поставки моторных масел по России</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="tel:+78001234567" className="flex items-center gap-2 hover:text-accent transition-colors">
              <Phone className="h-4 w-4" />
              8 (800) 123-45-67
            </a>
            <span className="text-primary-foreground/70">Бесплатно по России</span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container py-4">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
              <span className="text-2xl font-bold text-accent-foreground">М</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-foreground">МаслоОпт</div>
              <div className="text-xs text-muted-foreground">B2B снабжение</div>
            </div>
          </a>

          {/* Catalog button */}
          <Button className="hidden md:flex gap-2 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-6">
            <Menu className="h-5 w-5" />
            Каталог
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Input
                placeholder="Поиск масла по названию, бренду или артикулу..."
                className="h-12 pl-4 pr-12 rounded-lg border-2 border-border focus:border-accent bg-background"
              />
              <Button
                size="icon"
                className="absolute right-1 top-1 h-10 w-10 bg-accent hover:bg-accent/90"
              >
                <Search className="h-5 w-5 text-accent-foreground" />
              </Button>
            </div>
          </div>

          {/* Cart */}
          <Button variant="outline" className="relative h-12 gap-2 px-6 border-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="hidden sm:inline font-medium">Корзина</span>
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-t border-border bg-card">
        <div className="container">
          <ul className="flex items-center gap-1 overflow-x-auto py-2 text-sm">
            {[
              "Моторные масла",
              "Трансмиссионные",
              "Гидравлические",
              "Индустриальные",
              "Антифризы",
              "Смазки",
              "Присадки",
              "Акции",
            ].map((item, index) => (
              <li key={item}>
                <a
                  href="#"
                  className={`whitespace-nowrap rounded-md px-4 py-2 font-medium transition-colors hover:bg-muted ${
                    index === 7 ? "text-accent" : "text-foreground"
                  }`}
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
