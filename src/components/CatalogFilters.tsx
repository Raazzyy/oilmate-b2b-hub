"use client";

import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Cog, Droplets, Factory, Snowflake, Wrench, LayoutGrid } from "lucide-react";
import { StrapiCategory, StrapiFilter } from "@/lib/strapi";

// Default categories list (fallback if Strapi doesn't provide them)
const sidebarCategories = [
  { slug: "motor", name: "Моторные масла", icon: Car },
  { slug: "transmission", name: "Трансмиссионные масла", icon: Cog },
  { slug: "hydraulic", name: "Гидравлические масла", icon: Droplets },
  { slug: "industrial", name: "Индустриальные масла", icon: Factory },
  { slug: "lubricants", name: "Смазки", icon: Wrench },
  { slug: "antifreeze", name: "Антифризы", icon: Snowflake },
  { slug: "marine", name: "Судовые масла", icon: Car },
];

// Fallback filter sets per known category (shown when Strapi has no filters configured)
const fallbackFilters: Record<string, StrapiFilter[]> = {
  motor: [
    { id: 1, name: "Бренд", slug: "brand", type: "chips", options: ["Castrol", "Mobil", "Shell", "Total", "Лукойл"] },
    { id: 2, name: "Объем", slug: "volume", type: "chips", options: ["4 л", "5 л"] },
    { id: 3, name: "Тип масла", slug: "oilType", type: "chips", options: ["Синтетическое", "Полусинтетика"] },
    { id: 4, name: "Вязкость", slug: "viscosity", type: "chips", options: ["5W-40", "5W-30"] },
    { id: 5, name: "Допуски", slug: "approvals", type: "chips", options: ["MB 229.5", "ACEA C3", "BMW LL-04", "API SN"] },
  ],
  transmission: [
    { id: 1, name: "Бренд", slug: "brand", type: "chips", options: ["Castrol", "Mobil", "Shell", "Total"] },
    { id: 2, name: "Объем", slug: "volume", type: "chips", options: ["1 л", "4 л", "20 л"] },
    { id: 3, name: "Вязкость", slug: "viscosity", type: "chips", options: ["75W-90", "80W-90", "85W-140"] },
  ],
  lubricants: [
    { id: 1, name: "Бренд", slug: "brand", type: "chips", options: ["Castrol", "Shell", "Mobil"] },
    { id: 2, name: "Класс консистенции", slug: "consistency", type: "chips", options: ["NLGI 0", "NLGI 1", "NLGI 2", "NLGI 3"] },
    { id: 3, name: "Тип смазки", slug: "greaseType", type: "chips", options: ["Литиевая", "Молибденовая", "Кальциевая"] },
  ],
  antifreeze: [
    { id: 1, name: "Бренд", slug: "brand", type: "chips", options: ["Sintec", "Glysantin", "Felix"] },
    { id: 2, name: "Объем", slug: "volume", type: "chips", options: ["1 л", "5 л", "10 л", "20 л"] },
    { id: 3, name: "Тип", slug: "type", type: "chips", options: ["G11", "G12", "G12+", "G13"] },
  ],
  hydraulic: [
    { id: 1, name: "Бренд", slug: "brand", type: "chips", options: ["Castrol", "Mobil", "Shell"] },
    { id: 2, name: "Объем", slug: "volume", type: "chips", options: ["5 л", "20 л", "60 л", "208 л"] },
    { id: 3, name: "Класс вязкости", slug: "viscosity", type: "chips", options: ["HLP 32", "HLP 46", "HLP 68"] },
  ],
};

// Generic fallback used when category slug not recognized
const genericFallback: StrapiFilter[] = [
  { id: 1, name: "Бренд", slug: "brand", type: "chips", options: ["Castrol", "Mobil", "Shell", "Total"] },
  { id: 2, name: "Объем", slug: "volume", type: "chips", options: ["1 л", "4 л", "5 л", "20 л"] },
];

interface CatalogFiltersProps {
  category?: StrapiCategory | null;
  categorySlugProp?: string;
}

const ChipButton = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150 border whitespace-nowrap ${
      active
        ? "bg-primary/10 text-primary border-primary/30 shadow-sm"
        : "bg-muted/60 border-transparent hover:bg-muted text-foreground"
    }`}
  >
    {label}
  </button>
);

const CatalogFilters = ({ category, categorySlugProp }: CatalogFiltersProps) => {
  const pathname = usePathname();
  const currentCatSlug = categorySlugProp || pathname?.split("/").filter(Boolean).pop() || "";

  const [activeChips, setActiveChips] = useState<Record<string, string[]>>({});
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const toggleChip = (filterSlug: string, option: string) => {
    setActiveChips((prev) => {
      const cur = prev[filterSlug] || [];
      if (cur.includes(option)) {
        return { ...prev, [filterSlug]: cur.filter((c) => c !== option) };
      }
      return { ...prev, [filterSlug]: [...cur, option] };
    });
  };

  const handleReset = () => {
    setActiveChips({});
    setPriceMin("");
    setPriceMax("");
  };

  // Determine which filters to show:
  // 1. If Strapi returned filters for this category → use them
  // 2. Else use per-category fallback
  // 3. Else use generic fallback
  const strapiFilters = category?.filters;
  const filters: StrapiFilter[] =
    strapiFilters && strapiFilters.length > 0
      ? strapiFilters
      : fallbackFilters[currentCatSlug] || genericFallback;

  const defaultOpen = ["categories", "price", ...filters.map((f) => f.slug)];

  return (
    <div
      className="w-full flex flex-col [&::-webkit-scrollbar]:hidden"
      style={{ maxHeight: "calc(100vh - 5rem)", overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
    >
      <Accordion type="multiple" defaultValue={defaultOpen} className="w-full flex-1">

        {/* ── Categories ── */}
        <AccordionItem value="categories" className="border rounded-2xl mb-3 overflow-hidden bg-card">
          <AccordionTrigger className="font-bold px-4 py-3 hover:no-underline text-base">
            Категории
          </AccordionTrigger>
          <AccordionContent className="px-2 pb-3">
            <div className="space-y-0.5">
              <Link
                href="/catalog"
                className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-colors text-sm ${
                  pathname === "/catalog" ? "bg-muted font-medium text-primary" : "hover:bg-muted/50 text-foreground"
                }`}
              >
                <LayoutGrid className="h-4 w-4 shrink-0" />
                Все товары
              </Link>
              {sidebarCategories.map((c) => {
                const isActive = currentCatSlug === c.slug;
                const Icon = c.icon;
                return (
                  <Link
                    key={c.slug}
                    href={`/catalog/${c.slug}`}
                    className={`flex items-center gap-3 px-2 py-2 rounded-xl transition-colors text-sm ${
                      isActive ? "bg-muted font-medium text-primary" : "hover:bg-muted/50 text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {c.name}
                  </Link>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ── Price ── */}
        <p className="font-bold text-base px-1 mt-4 mb-2">Фильтры</p>

        <AccordionItem value="price" className="border rounded-2xl mb-3 overflow-hidden bg-card">
          <AccordionTrigger className="font-semibold px-4 py-3 hover:no-underline text-sm">
            Цена
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  от
                </span>
                <Input
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  className="pl-7 pr-6 h-9 rounded-lg bg-muted/50 border-transparent text-sm"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  ₽
                </span>
              </div>
              <div className="relative flex-1">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  до
                </span>
                <Input
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  className="pl-7 pr-6 h-9 rounded-lg bg-muted/50 border-transparent text-sm"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">
                  ₽
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ── Dynamic filter groups ── */}
        {filters.map((filter) => (
          <AccordionItem
            key={filter.slug}
            value={filter.slug}
            className="border rounded-2xl mb-3 overflow-hidden bg-card"
          >
            <AccordionTrigger className="font-semibold px-4 py-3 hover:no-underline text-sm">
              {filter.name}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              {filter.type === "chips" && Array.isArray(filter.options) && (
                <div className="flex flex-wrap gap-1.5">
                  {filter.options.map((opt) => (
                    <ChipButton
                      key={opt}
                      label={opt}
                      active={!!activeChips[filter.slug]?.includes(opt)}
                      onClick={() => toggleChip(filter.slug, opt)}
                    />
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* ── Actions (sticky to bottom of sidebar) ── */}
      <div className="pt-4 pb-2 bg-background/80 backdrop-blur-sm flex flex-col gap-2 sticky bottom-0">
        <Button className="w-full h-10 rounded-xl" variant="default">
          Применить
        </Button>
        <Button className="w-full h-10 rounded-xl" variant="ghost" onClick={handleReset}>
          Сбросить
        </Button>
      </div>
    </div>
  );
};

export default CatalogFilters;
