
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";

import { HeroSlide } from "@/types";

interface HeroBannerProps {
  slides: HeroSlide[];
}

const HeroBanner = ({ slides }: HeroBannerProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  // Auto-play
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="py-4 md:py-6">
      <div className="container">
        <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
          {/* Carousel banner */}
          <div className="relative lg:col-span-2 h-[280px] md:h-[380px] rounded-2xl overflow-hidden">
            {/* Carousel */}
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex h-full">
                {slides.map((slide) => (
                  <Link
                    key={slide.id}
                    href={slide.href || "/"}
                    className={`flex-[0_0_100%] min-w-0 h-full bg-gradient-to-br ${slide.gradient} relative`}
                    style={slide.backgroundImage ? { 
                      backgroundImage: `url(${slide.backgroundImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : undefined}
                  >
                    {/* Dark overlay if image is present */}
                    {slide.backgroundImage && (
                      <div className="absolute inset-0 bg-black/40" />
                    )}

                    {/* Animated shimmer overlay */}
                    <div className="absolute inset-0 opacity-30">
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" 
                        style={{ 
                          backgroundSize: '200% 100%',
                          animation: 'shimmer 3s ease-in-out infinite'
                        }} 
                      />
                    </div>
                    
                    {/* Pattern background */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl" />
                    </div>

                    <div className="relative h-full p-5 md:p-8 flex flex-col justify-between">
                      <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight whitespace-pre-line">
                          {slide.title}
                        </h2>
                      </div>

                      <div className="relative z-10 flex items-end justify-between">
                        <Button className="bg-card text-foreground hover:bg-card/90 font-semibold px-5 md:px-8 h-10 md:h-12 rounded-xl text-sm md:text-lg pointer-events-none">
                          {slide.buttonText}
                        </Button>

                        {/* <div className="text-right text-primary-foreground hidden sm:block">
                          <p className="text-sm md:text-lg mb-2 whitespace-pre-line">{slide.subtitle}</p>
                          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-lg px-3 md:px-4 py-1.5 md:py-2 border border-white/20">
                            <span className="text-sm md:text-lg font-semibold">{slide.badge}</span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <button 
              onClick={(e) => { e.preventDefault(); scrollPrev(); }}
              className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-card/90 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm shadow-md"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); scrollNext(); }}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-10 md:h-10 rounded-lg bg-card/90 flex items-center justify-center hover:bg-card transition-colors backdrop-blur-sm shadow-md"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Fixed side banner */}
          <Link 
            href="/catalog/motor"
            className="h-[200px] md:h-[380px] rounded-2xl overflow-hidden bg-gradient-to-br from-accent via-accent to-primary/80 p-5 md:p-6 flex flex-col justify-between relative group"
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <h3 className="text-xl md:text-2xl font-bold text-primary-foreground leading-snug mb-2 md:mb-4">
                Широкий ассортимент<br/>
                моторных масел
              </h3>
              
              <p className="text-primary-foreground/90 text-xs md:text-sm">
                Для легковых и грузовых<br/>автомобилей, спецтехники
              </p>
            </div>

            <Button className="relative z-10 bg-card text-foreground group-hover:bg-card/90 font-semibold w-fit px-5 md:px-8 h-10 md:h-11 rounded-xl text-sm pointer-events-none">
              Смотреть каталог
            </Button>
          </Link>
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