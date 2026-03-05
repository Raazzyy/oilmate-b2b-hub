"use client";

import React, { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

interface CatalogFiltersProps {
  category?: StrapiCategory | null;
  categorySlugProp?: string;
  autoFilters?: StrapiFilter[];
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

const CatalogFilters = ({ category, categorySlugProp, autoFilters = [] }: CatalogFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCatSlug = categorySlugProp || pathname?.split("/").filter(Boolean).pop() || "";

  // Helper to update URL params
  const updateFilters = (newFilters: Record<string, string[]>, min?: string, max?: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    
    // Clear existing dynamic filters (exclude 'search' and 'sort')
    const currentKeys = Array.from(params.keys());
    currentKeys.forEach(key => {
      if (key !== 'search' && key !== 'sort') {
        params.delete(key);
      }
    });

    // Add active chips
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });

    // Add price range
    if (min) params.set('minPrice', min);
    else params.delete('minPrice');
    
    if (max) params.set('maxPrice', max);
    else params.delete('maxPrice');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleChip = (filterSlug: string, option: string) => {
    const currentValues = searchParams?.get(filterSlug)?.split(',') || [];
    let newValues: string[];
    
    if (currentValues.includes(option)) {
      newValues = currentValues.filter((v) => v !== option);
    } else {
      newValues = [...currentValues, option];
    }

    const allFilters: Record<string, string[]> = {};
    // Collect all current filters from searchParams
    searchParams?.forEach((value, key) => {
      if (key !== 'search' && key !== 'sort' && key !== 'minPrice' && key !== 'maxPrice') {
        allFilters[key] = value.split(',');
      }
    });
    
    allFilters[filterSlug] = newValues;
    updateFilters(allFilters, searchParams?.get('minPrice') || "", searchParams?.get('maxPrice') || "");
  };

  const handleReset = () => {
    router.push(pathname || "/catalog", { scroll: false });
  };

  const priceMin = searchParams?.get('minPrice') || "";
  const priceMax = searchParams?.get('maxPrice') || "";

  // Determine which filters to show:
  // 1. If Strapi returned filters setup specifically for this category → use them (allows manual override)
  // 2. Else use autoFilters (generated dynamically from products)
  const strapiFilters = category?.filters;
  const filters: StrapiFilter[] =
    strapiFilters && strapiFilters.length > 0
      ? strapiFilters
      : autoFilters;

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
                  onChange={(e) => {
                    const allFilters: Record<string, string[]> = {};
                    searchParams?.forEach((value, key) => {
                      if (key !== 'search' && key !== 'sort' && key !== 'minPrice' && key !== 'maxPrice') {
                        allFilters[key] = value.split(',');
                      }
                    });
                    updateFilters(allFilters, e.target.value, priceMax);
                  }}
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
                  onChange={(e) => {
                    const allFilters: Record<string, string[]> = {};
                    searchParams?.forEach((value, key) => {
                      if (key !== 'search' && key !== 'sort' && key !== 'minPrice' && key !== 'maxPrice') {
                        allFilters[key] = value.split(',');
                      }
                    });
                    updateFilters(allFilters, priceMin, e.target.value);
                  }}
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
                      active={searchParams?.get(filter.slug)?.split(',').filter(Boolean).includes(opt) || false}
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
        <Button className="w-full h-10 rounded-xl" variant="default" onClick={() => {
           // This button can now just close mobile menu or similar if needed, 
           // but since we are pushing to URL on every click, it's already active.
           // Let's keep it for visual consistency but maybe it's not strictly needed for logic anymore.
        }}>
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
