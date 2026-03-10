"use client";

import { Home, LayoutGrid, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

const BottomNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { getTotalItems, setIsCartOpen, isClient, setClient } = useCartStore();

  useEffect(() => {
    setClient();
  }, [setClient]);

  const cartCount = isClient ? getTotalItems() : 0;

  const items = [
    {
      label: "Главная",
      icon: Home,
      action: () => router.push("/"),
      active: pathname === "/",
    },
    {
      label: "Каталог",
      icon: LayoutGrid,
      action: () => router.push("/catalog"),
      active: pathname.startsWith("/catalog"),
    },
    {
      label: "Корзина",
      icon: ShoppingCart,
      action: () => setIsCartOpen(true),
      active: false,
      badge: cartCount,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-card/95 backdrop-blur-lg rounded-t-3xl shadow-[0_-2px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around h-[4.25rem] pb-safe">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              onClick={item.action}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                item.active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-all",
                    item.active && "stroke-[2.5]"
                  )}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -right-2.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[11px]",
                  item.active ? "font-semibold" : "font-medium"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
