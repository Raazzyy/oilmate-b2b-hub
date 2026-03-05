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
}

export default function MobileFilters({ category, categorySlugProp, autoFilters }: MobileFiltersProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-card border">
          <SlidersHorizontal className="h-4 w-4" />
          Фильтры каталога
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 flex flex-col pt-12 bg-background">
        <SheetTitle className="sr-only">Фильтры каталога</SheetTitle>
        <div className="flex-1 overflow-hidden px-4">
            <CatalogFilters category={category} categorySlugProp={categorySlugProp} autoFilters={autoFilters} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
