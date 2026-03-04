"use client";

import { useRef } from "react";

export default function CategoriesScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  return (
    <div
      ref={ref}
      className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
      onMouseDown={(e) => {
        isDown.current = true;
        startX.current = e.pageX - (ref.current?.offsetLeft ?? 0);
        scrollLeft.current = ref.current?.scrollLeft ?? 0;
      }}
      onMouseMove={(e) => {
        if (!isDown.current || !ref.current) return;
        const x = e.pageX - ref.current.offsetLeft;
        ref.current.scrollLeft = scrollLeft.current - (x - startX.current);
      }}
      onMouseUp={() => { isDown.current = false; }}
      onMouseLeave={() => { isDown.current = false; }}
    >
      {children}
    </div>
  );
}
