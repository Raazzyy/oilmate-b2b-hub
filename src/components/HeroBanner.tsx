
"use client";

import { Button } from "@/components/ui/button";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

import { HeroSlide } from "@/types";


interface HeroBannerProps {
  slides: HeroSlide[];
}

const HeroBanner = ({ slides }: HeroBannerProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section className="pt-2 pb-6 md:pt-4 md:pb-10">
      <div className="container">
        {/* Full-width Carousel banner */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[3/1] rounded-2xl overflow-hidden shadow-sm">
          {/* Carousel */}
          <div className="overflow-hidden h-full" ref={emblaRef}>
            <div className="flex h-full">
              {slides.map((slide, index) => (
                <Link
                  key={slide.id}
                  href={slide.href || "/"}
                  className="flex-[0_0_100%] min-w-0 h-full relative overflow-hidden block"
                >
                  {slide.backgroundImage ? (
                    <Image 
                      src={slide.backgroundImage} 
                      alt={slide.title || "Слайд"}
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="100vw"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${slide.gradient || "from-muted to-muted/50"}`} />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-3 md:mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-sm transition-all ${
                selectedIndex === index ? "bg-primary w-6" : "bg-border hover:bg-primary/50 w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;