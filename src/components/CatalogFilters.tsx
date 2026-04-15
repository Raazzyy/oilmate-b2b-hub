"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronDown } from "lucide-react";
import { StrapiFilter } from "@/lib/strapi";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  autoFilters?: StrapiFilter[];
  priceRange?: { min: number; max: number };
}

const CatalogFilters = ({ category, categorySlugProp, autoFilters = [], priceRange }: CatalogFiltersProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const priceMin = priceRange?.min ?? 0;
  const priceMax = priceRange?.max ?? 30000;

  const [localMin, setLocalMin] = useState(searchParams?.get('minPrice') || "");
  const [localMax, setLocalMax] = useState(searchParams?.get('maxPrice') || "");

  useEffect(() => {
    setLocalMin(searchParams?.get('minPrice') || "");
    setLocalMax(searchParams?.get('maxPrice') || "");
  }, [searchParams]);

  const getCurrentFilters = () => {
    const allFilters: Record<string, string[]> = {};
    searchParams?.forEach((value, key) => {
      if (key !== 'search' && key !== 'sort' && key !== 'minPrice' && key !== 'maxPrice') {
        allFilters[key] = value.split(',').filter(Boolean);
      }
    });
    return allFilters;
  };

  const pushFilters = (filters: Record<string, string[]>, min: string, max: string) => {
    const params = new URLSearchParams();
    if (searchParams?.get('search')) params.set('search', searchParams.get('search')!);
    if (searchParams?.get('sort')) params.set('sort', searchParams.get('sort')!);
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) params.set(key, values.join(','));
    });
    if (min && Number(min) > priceMin) params.set('minPrice', min);
    if (max && Number(max) < priceMax) params.set('maxPrice', max);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleFilter = (filterSlug: string, option: string) => {
    const filters = getCurrentFilters();
    const current = filters[filterSlug] || [];
    filters[filterSlug] = current.includes(option)
      ? current.filter(v => v !== option)
      : [...current, option];
    pushFilters(filters, searchParams?.get('minPrice') || "", searchParams?.get('maxPrice') || "");
  };

  const handlePriceApply = () => {
    const currentMin = searchParams?.get('minPrice') || "";
    const currentMax = searchParams?.get('maxPrice') || "";
    if (localMin !== currentMin || localMax !== currentMax) {
      pushFilters(getCurrentFilters(), localMin, localMax);
    }
  };

  const handleSliderCommit = ([from, to]: number[]) => {
    const mn = from > priceMin ? String(from) : "";
    const mx = to < priceMax ? String(to) : "";
    setLocalMin(mn);
    setLocalMax(mx);
    pushFilters(getCurrentFilters(), mn, mx);
  };

  const handleReset = () => router.push(pathname || "/catalog", { scroll: false });
  const getSelected = (slug: string) => searchParams?.get(slug)?.split(',').filter(Boolean) || [];

  return (
    <div className="w-full flex flex-col">
      <div className="bg-card rounded-2xl p-4 mb-3 border border-border/50">
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

      <div className="bg-card rounded-2xl p-5 mb-4 border border-border/50 overflow-hidden">
        <h3 className="font-medium text-foreground mb-6 text-base">Фильтры</h3>

        {/* Price section — permanently visible */}
        <div className="mb-8 px-0.5">
          <span className="text-sm font-semibold text-foreground mb-4 block">Цена, ₽</span>
          <div className="flex gap-2 mb-4">
            <Input
              type="number"
              placeholder={`${priceMin}`}
              value={localMin}
              onChange={(e) => setLocalMin(e.target.value)}
              onBlur={handlePriceApply}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePriceApply(); }}
              className="rounded-lg border-border h-9 text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
            <Input
              type="number"
              placeholder={`${priceMax.toLocaleString()}`}
              value={localMax}
              onChange={(e) => setLocalMax(e.target.value)}
              onBlur={handlePriceApply}
              onKeyDown={(e) => { if (e.key === 'Enter') handlePriceApply(); }}
              className="rounded-lg border-border h-9 text-sm [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            />
          </div>
          <Slider
            min={priceMin}
            max={priceMax}
            step={Math.max(1, Math.round((priceMax - priceMin) / 200))}
            minStepsBetweenThumbs={1}
            value={[
              localMin ? parseInt(localMin) : priceMin,
              localMax ? parseInt(localMax) : priceMax,
            ]}
            onValueChange={([from, to]) => {
              setLocalMin(from > priceMin ? String(from) : "");
              setLocalMax(to < priceMax ? String(to) : "");
            }}
            onValueCommit={handleSliderCommit}
            className="cursor-grab active:cursor-grabbing [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:rounded-full [&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:cursor-grab [&_[role=slider]]:active:cursor-grabbing [&_[role=slider]]:shadow-md [&_span.absolute]:bg-accent"
          />
        </div>

        <Accordion type="multiple" className="w-full">
          {/* Dynamic groups */}
          {autoFilters.map((filter) => {
            if (!filter.options?.length) return null;
            return (
              <AccordionItem key={filter.slug} value={filter.slug} className="border-none mt-2">
                <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3 px-0">
                  {filter.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-1 pb-4">
                    <CheckboxFilter
                      items={filter.options}
                      selected={getSelected(filter.slug)}
                      onToggle={(item) => toggleFilter(filter.slug, item)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        <Button
          variant="ghost"
          className="w-full text-muted-foreground mt-4 h-9"
          onClick={handleReset}
        >
          Сбросить фильтры
        </Button>
      </div>
    </div>
  );
};

export default CatalogFilters;
