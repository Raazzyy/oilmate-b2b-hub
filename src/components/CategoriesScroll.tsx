"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoriesScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") => {
    const el = ref.current;
    if (!el) return;
    const amount = el.clientWidth * 0.7;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  return (
    <div className="relative group/scroll">
      {/* Left arrow — desktop only */}
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 items-center justify-center w-9 h-9 rounded-full bg-background border border-border shadow-md hover:bg-muted transition-all opacity-0 group-hover/scroll:opacity-100"
          aria-label="Прокрутить влево"
        >
          <ChevronLeft className="h-5 w-5 text-foreground" />
        </button>
      )}

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          isDown.current = true;
          startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
          scrollLeft.current = ref.current?.scrollLeft ?? 0;
          if (ref.current) ref.current.style.userSelect = "none";
        }}
        onMouseMove={(e) => {
          if (!isDown.current || !ref.current) return;
          const x = e.pageX - ref.current.offsetLeft;
          ref.current.scrollLeft = scrollLeft.current - (x - startX.current);
        }}
        onMouseUp={() => { isDown.current = false; if (ref.current) ref.current.style.userSelect = ""; }}
        onMouseLeave={() => { isDown.current = false; if (ref.current) ref.current.style.userSelect = ""; }}
      >
        {children}
      </div>

      {/* Right arrow — desktop only */}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 items-center justify-center w-9 h-9 rounded-full bg-background border border-border shadow-md hover:bg-muted transition-all opacity-0 group-hover/scroll:opacity-100"
          aria-label="Прокрутить вправо"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      )}
    </div>
  );
}
