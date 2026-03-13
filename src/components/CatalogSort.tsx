"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ChevronDown } from "lucide-react";

const sortLabels: Record<string, string> = {
  default: "По актуальности",
  price_asc: "По возрастанию цены",
  price_desc: "По убыванию цены",
};

export default function CatalogSort({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sortRef = useRef<HTMLDivElement>(null);
  
  const currentSort = searchParams?.get("sort") || "default";
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSortChange = (key: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    if (key === "default") {
      params.delete("sort");
    } else {
      params.set("sort", key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setIsSortOpen(false);
  };

  if (isMobile) {
    return (
      <div className="relative basis-1/3" ref={sortRef}>
        <button
          onClick={() => setIsSortOpen(!isSortOpen)}
          className="w-full flex items-center justify-center py-2.5 rounded-xl bg-muted text-foreground text-sm font-medium transition-all active:scale-95"
        >
          <ArrowUpDown className="h-4 w-4" />
        </button>
        {isSortOpen && (
          <div className="absolute left-0 top-full mt-1.5 w-52 bg-card rounded-xl border border-border shadow-lg z-30 py-1.5">
            {(["default", "price_asc", "price_desc"] as const).map((key) => (
              <button
                key={key}
                onClick={() => handleSortChange(key)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors"
              >
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  currentSort === key ? 'border-primary' : 'border-border'
                }`}>
                  {currentSort === key && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <span className={currentSort === key ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                  {sortLabels[key]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Desktop Component
  return (
    <div className="relative flex items-center" ref={sortRef}>
      <button
        onClick={() => setIsSortOpen(!isSortOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
      >
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        {sortLabels[currentSort]}
        <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
      </button>
      {isSortOpen && (
        <div className="absolute right-0 top-full mt-1.5 w-56 bg-card rounded-xl border border-border shadow-lg z-30 py-1.5">
          {(["default", "price_asc", "price_desc"] as const).map((key) => (
            <button
              key={key}
              onClick={() => handleSortChange(key)}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors"
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                currentSort === key ? 'border-primary' : 'border-border'
              }`}>
                {currentSort === key && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>
              <span className={currentSort === key ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                {sortLabels[key]}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
