"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, Cog, Droplets, Factory, Snowflake, Wrench, LayoutGrid } from "lucide-react";

const sidebarCategories = [
  { slug: "motor", name: "Моторные масла", icon: Car },
  { slug: "transmission", name: "Трансмиссионные масла", icon: Cog },
  { slug: "hydraulic", name: "Гидравлические масла", icon: Droplets },
  { slug: "industrial", name: "Индустриальные масла", icon: Factory },
  { slug: "lubricants", name: "Смазки", icon: Wrench },
  { slug: "antifreeze", name: "Антифризы", icon: Snowflake },
  { slug: "marine", name: "Судовые масла", icon: Car },
];

const filterData = {
  brands: ["Shell", "Mobil", "Castrol", "Liqui Moly", "Motul", "Total"],
  viscosity: ["0W-20", "0W-30", "5W-30", "5W-40", "10W-40", "15W-40"],
  volume: ["1 л", "4 л", "5 л", "20 л", "60 л", "208 л"],
};

const CatalogFilters = () => {
  const pathname = usePathname();
  const categorySlug = pathname?.split('/').filter(Boolean).pop() || '';

  return (
    <div className="w-full">
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-xl">Категории</h3>
        <div className="space-y-1">
          {sidebarCategories.map((category) => {
            const isActive = categorySlug === category.slug;
            const IconComponent = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/catalog/${category.slug}`}
                className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${isActive ? 'bg-muted' : 'hover:bg-muted/50'}`}
              >
                <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <IconComponent className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-foreground'}`} />
                </div>
                <span className={`text-sm ${isActive ? 'text-primary font-medium' : 'text-foreground'}`}>
                  {category.name}
                </span>
              </Link>
            );
          })}
          <Link
            href="/catalog"
            className={`flex items-center gap-3 p-2 rounded-xl transition-colors ${categorySlug === 'catalog' || pathname === '/catalog' ? 'bg-muted' : 'hover:bg-muted/50'}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
              <LayoutGrid className="h-4 w-4 text-foreground" />
            </div>
            <span className={`text-sm ${pathname === '/catalog' ? 'text-primary font-medium' : 'text-foreground'}`}>
              Все товары
            </span>
          </Link>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4">Фильтры</h3>

      <Accordion type="multiple" defaultValue={["brand", "viscosity", "volume"]} className="w-full">
        <AccordionItem value="brand" className="border-b-0 mb-4">
          <AccordionTrigger className="font-semibold py-2 hover:no-underline">Бренд</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3">
              {filterData.brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox id={`brand-${brand}`} className="rounded border-gray-300" />
                  <Label htmlFor={`brand-${brand}`} className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="viscosity" className="border-b-0 mb-4">
          <AccordionTrigger className="font-semibold py-2 hover:no-underline">Вязкость</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3">
              {filterData.viscosity.map((visc) => (
                <div key={visc} className="flex items-center space-x-2">
                  <Checkbox id={`visc-${visc}`} className="rounded border-gray-300" />
                  <Label htmlFor={`visc-${visc}`} className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground">
                    {visc}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="volume" className="border-b-0 mb-4">
          <AccordionTrigger className="font-semibold py-2 hover:no-underline">Объем</AccordionTrigger>
          <AccordionContent className="pt-2">
            <div className="space-y-3">
              {filterData.volume.map((vol) => (
                <div key={vol} className="flex items-center space-x-2">
                  <Checkbox id={`vol-${vol}`} className="rounded border-gray-300" />
                  <Label htmlFor={`vol-${vol}`} className="text-sm font-normal cursor-pointer text-muted-foreground hover:text-foreground">
                    {vol}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-8">
        <Button className="w-full mb-3" variant="default">Применить</Button>
        <Button className="w-full" variant="outline">Сбросить</Button>
      </div>
    </div>
  );
};

export default CatalogFilters;
