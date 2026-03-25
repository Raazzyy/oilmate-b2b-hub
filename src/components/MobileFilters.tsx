"use client";

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import CatalogFilters from "./CatalogFilters";
import { StrapiCategory, StrapiFilter } from "@/lib/strapi";

interface MobileFiltersProps {
  category?: StrapiCategory | null;
  categorySlugProp?: string;
  autoFilters?: StrapiFilter[];
  hasActiveFilters?: boolean;
  priceRange?: { min: number; max: number };
}

export default function MobileFilters({ category, categorySlugProp, autoFilters, hasActiveFilters = false, priceRange }: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="basis-2/3 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium transition-all active:scale-95"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Фильтр
          {hasActiveFilters && (
            <span className="w-2 h-2 bg-accent-foreground rounded-full" />
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col pt-12 bg-background">
        <SheetTitle className="sr-only">Фильтры каталога</SheetTitle>
        <div className="flex-1 overflow-y-auto px-4 py-8">
            <CatalogFilters category={category} categorySlugProp={categorySlugProp} autoFilters={autoFilters} priceRange={priceRange} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
