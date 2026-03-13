"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronDown, LayoutGrid } from "lucide-react";
import { allProducts, ProductData } from "@/data/products";

// Get available filter options from actual products
const getAvailableFilters = (products: ProductData[], category: string | null) => {
  const categoryProducts = category && category !== "all" 
    ? products.filter(p => p.category === category)
    : products;

  const brands = [...new Set(categoryProducts.map(p => p.brand))].sort();
  const volumes = [...new Set(categoryProducts.map(p => p.volume))].sort();
  
  // Category-specific filters based on actual product data
  const specificFilters: { label: string; key: keyof ProductData; options: string[] }[] = [];

  if (category === "motor") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const viscosities = [...new Set(categoryProducts.map(p => p.viscosity).filter(Boolean))];
    const approvals = [...new Set(categoryProducts.map(p => p.approvals).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (viscosities.length > 0) specificFilters.push({ label: "Вязкость", key: "viscosity", options: viscosities as string[] });
    if (approvals.length > 0) specificFilters.push({ label: "Допуски", key: "approvals", options: approvals as string[] });
  }

  if (category === "transmission") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const viscosities = [...new Set(categoryProducts.map(p => p.viscosity).filter(Boolean))];
    const specs = [...new Set(categoryProducts.map(p => p.specification).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (viscosities.length > 0) specificFilters.push({ label: "Вязкость", key: "viscosity", options: viscosities as string[] });
    if (specs.length > 0) specificFilters.push({ label: "Спецификация", key: "specification", options: specs as string[] });
  }

  if (category === "hydraulic") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const viscosityClasses = [...new Set(categoryProducts.map(p => p.viscosityClass).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (viscosityClasses.length > 0) specificFilters.push({ label: "Класс вязкости", key: "viscosityClass", options: viscosityClasses as string[] });
  }

  if (category === "industrial") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const applications = [...new Set(categoryProducts.map(p => p.application).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (applications.length > 0) specificFilters.push({ label: "Применение", key: "application", options: applications as string[] });
  }

  if (category === "lubricants") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const applications = [...new Set(categoryProducts.map(p => p.application).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип смазки", key: "oilType", options: oilTypes as string[] });
    if (applications.length > 0) specificFilters.push({ label: "Применение", key: "application", options: applications as string[] });
  }

  if (category === "antifreeze") {
    const types = [...new Set(categoryProducts.map(p => p.type).filter(Boolean))];
    const standards = [...new Set(categoryProducts.map(p => p.standard).filter(Boolean))];
    const colors = [...new Set(categoryProducts.map(p => p.color).filter(Boolean))];
    
    if (types.length > 0) specificFilters.push({ label: "Тип", key: "type", options: types as string[] });
    if (standards.length > 0) specificFilters.push({ label: "Стандарт", key: "standard", options: standards as string[] });
    if (colors.length > 0) specificFilters.push({ label: "Цвет", key: "color", options: colors as string[] });
  }

  if (category === "marine") {
    const oilTypes = [...new Set(categoryProducts.map(p => p.oilType).filter(Boolean))];
    const viscosities = [...new Set(categoryProducts.map(p => p.viscosity).filter(Boolean))];
    const applications = [...new Set(categoryProducts.map(p => p.application).filter(Boolean))];
    
    if (oilTypes.length > 0) specificFilters.push({ label: "Тип масла", key: "oilType", options: oilTypes as string[] });
    if (viscosities.length > 0) specificFilters.push({ label: "Вязкость", key: "viscosity", options: viscosities as string[] });
    if (applications.length > 0) specificFilters.push({ label: "Применение", key: "application", options: applications as string[] });
  }

  return { brands, volumes, specificFilters };
};

const CheckboxFilter = ({ 
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

  if (items.length === 0) return null;

  return (
    <div className="space-y-2.5">
      {visibleItems.map((item) => (
        <label
          key={item}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <Checkbox
            checked={selected.includes(item)}
            onCheckedChange={() => onToggle(item)}
            className="h-[18px] w-[18px] rounded border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          />
          <span className="text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
            {item}
          </span>
        </label>
      ))}
      {hiddenCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center gap-1 text-muted-foreground text-sm mt-2 hover:text-primary transition-colors"
        >
          Показать ещё {hiddenCount} из {items.length}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      )}
      {showAll && hiddenCount > 0 && (
        <button
          onClick={() => setShowAll(false)}
          className="flex items-center gap-1 text-muted-foreground text-sm mt-1 hover:text-primary transition-colors"
        >
          Свернуть
          <ChevronDown className="h-3.5 w-3.5 rotate-180" />
        </button>
      )}
    </div>
  );
};

interface CatalogFiltersProps {
  category?: { name: string; slug: string } | null;
  categorySlugProp?: string;
  autoFilters?: unknown;
}

const CatalogFilters = ({ category, categorySlugProp }: CatalogFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = categorySlugProp || pathname?.split("/").filter(Boolean).pop() || "";

  // Helper to update URL params
  const updateFilters = (newFilters: Record<string, string[]>, min?: string, max?: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    
    // Clear existing dynamic filters
    const currentKeys = Array.from(params.keys());
    currentKeys.forEach(key => {
      if (key !== 'search' && key !== 'sort') {
        params.delete(key);
      }
    });

    // Add active checks
    Object.entries(newFilters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });

    if (min && min !== "0") params.set('minPrice', min);
    else params.delete('minPrice');
    
    if (max && max !== "30000") params.set('maxPrice', max);
    else params.delete('maxPrice');

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleFilter = (filterSlug: string, option: string) => {
    const currentValues = searchParams?.get(filterSlug)?.split(',').filter(Boolean) || [];
    let newValues: string[];
    
    if (currentValues.includes(option)) {
      newValues = currentValues.filter((v) => v !== option);
    } else {
      newValues = [...currentValues, option];
    }

    const allFilters: Record<string, string[]> = {};
    searchParams?.forEach((value, key) => {
      if (key !== 'search' && key !== 'sort' && key !== 'minPrice' && key !== 'maxPrice') {
         allFilters[key] = value.split(',').filter(Boolean);
      }
    });
    
    allFilters[filterSlug] = newValues;
    updateFilters(allFilters, searchParams?.get('minPrice') || "", searchParams?.get('maxPrice') || "");
  };

  const priceMinRaw = searchParams?.get('minPrice') || "";
  const priceMaxRaw = searchParams?.get('maxPrice') || "";
  const [priceMin, setPriceMin] = useState(priceMinRaw);
  const [priceMax, setPriceMax] = useState(priceMaxRaw);

  const handlePriceApply = () => {
    const allFilters: Record<string, string[]> = {};
    searchParams?.forEach((value, key) => {
      if (key !== 'search' && key !== 'sort' && key !== 'minPrice' && key !== 'maxPrice') {
         allFilters[key] = value.split(',').filter(Boolean);
      }
    });
    updateFilters(allFilters, priceMin, priceMax);
  };

  const handleReset = () => {
    router.push(pathname || "/catalog", { scroll: false });
  };

  // Get exact available filters from the original Vite logic
  const availableFilters = useMemo(() => 
    getAvailableFilters(allProducts, activeCategory && activeCategory !== "catalog" ? activeCategory : null), 
    [activeCategory]
  );

  return (
    <div
      className="w-full h-full flex flex-col [&::-webkit-scrollbar]:hidden"
      style={{ overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
    >
      <div className="bg-card rounded-2xl p-4 mb-3 shadow-sm border border-border/50">
        <Link
          href="/catalog"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Все категории
        </Link>
        {category && (
          <div className="ml-5 inline-flex items-center px-3 py-1.5 rounded-full bg-muted/60 text-sm font-medium text-foreground">
            {category.name}
          </div>
        )}
      </div>

      <div className="bg-card rounded-2xl p-5 mb-4 shadow-sm border border-border/50">
        <h3 className="font-medium text-foreground mb-5 text-base">Фильтры</h3>

        {/* ── Price filter (exact copy) ── */}
        <div className="mb-8">
          <span className="text-sm font-semibold text-foreground mb-3 block">Цена, ₽</span>
          <div className="flex gap-2 mb-3">
            <Input
              type="number"
              placeholder="от 0"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              onBlur={handlePriceApply}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePriceApply() }}
              className="rounded-lg border-border text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            <Input
              type="number"
              placeholder="до 30 000"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              onBlur={handlePriceApply}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePriceApply() }}
              className="rounded-lg border-border text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
          <Slider
            min={0}
            max={30000}
            step={100}
            minStepsBetweenThumbs={1}
            value={[
              priceMin ? parseInt(priceMin) : 0,
              priceMax ? parseInt(priceMax) : 30000,
            ]}
            onValueChange={([from, to]) => {
              setPriceMin(from > 0 ? String(from) : "");
              setPriceMax(to < 30000 ? String(to) : "");
            }}
            onValueCommit={([from, to]) => {
              const allFilters: Record<string, string[]> = {};
              searchParams?.forEach((value, key) => {
                if (key !== 'search' && key !== 'sort' && key !== 'minPrice' && key !== 'maxPrice') {
                  allFilters[key] = value.split(',').filter(Boolean);
                }
              });
              updateFilters(allFilters, from > 0 ? String(from) : "", to < 30000 ? String(to) : "");
            }}
            className="cursor-grab active:cursor-grabbing [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:rounded-full [&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:cursor-grab [&_[role=slider]]:active:cursor-grabbing [&_[role=slider]]:shadow-md [&_span.absolute]:bg-accent"
          />
        </div>

        {/* Brand filter */}
        {availableFilters.brands.length > 0 && (
          <div className="mb-8">
            <span className="text-sm font-semibold text-foreground mb-3 block">Бренд</span>
            <CheckboxFilter
              items={availableFilters.brands}
              selected={searchParams?.get("brand")?.split(',').filter(Boolean) || []}
              onToggle={(item) => toggleFilter("brand", item)}
              visibleCount={5}
            />
          </div>
        )}
        
        {/* Volume filter */}
        {availableFilters.volumes.length > 0 && activeCategory !== 'lubricants' && (
          <div className="mb-8">
            <span className="text-sm font-semibold text-foreground mb-3 block">Объём, л</span>
            <CheckboxFilter
              items={availableFilters.volumes}
              selected={searchParams?.get("volume")?.split(',').filter(Boolean) || []}
              onToggle={(item) => toggleFilter("volume", item)}
              visibleCount={5}
            />
          </div>
        )}

        {/* Category-specific filters */}
        {availableFilters.specificFilters.map(filter => (
          <div key={filter.key} className="mb-8">
            <span className="text-sm font-semibold text-foreground mb-3 block">{filter.label}</span>
            <CheckboxFilter
              items={filter.options}
              selected={searchParams?.get(filter.key)?.split(',').filter(Boolean) || []}
              onToggle={(item) => toggleFilter(filter.key, item)}
              visibleCount={5}
            />
          </div>
        ))}

        <Button
          variant="ghost"
          className="w-full text-muted-foreground mt-2"
          onClick={handleReset}
        >
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
};

export default CatalogFilters;
