
"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { getStrapiMedia, StrapiImage } from "@/lib/strapi";
import { Promotion } from "@/types";

interface PromotionsProps {
  promotions: Promotion[];
}

const Promotions = ({ promotions }: PromotionsProps) => {
  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="py-3 md:py-5 bg-background">
      <div className="container">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full relative group"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Акции и предложения</h2>
            <div className="flex gap-2">
              <CarouselPrevious className="static translate-y-0 h-8 w-8 rounded-full border border-border bg-background hover:bg-muted" />
              <CarouselNext className="static translate-y-0 h-8 w-8 rounded-full border border-border bg-background hover:bg-muted" />
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {promotions.map((promo) => (
                <CarouselItem key={promo.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Link href={promo.href} className="block group/item">
                        <div className="relative overflow-hidden rounded-3xl bg-card border border-border h-full flex flex-col aspect-video">
                            {/* Mobile/Default image */}
                            <ImageWithSkeleton 
                                src={promo.image || "/oil-product.png"} 
                                alt={promo.title || "Promotion"} 
                                aspectRatio="video"
                                className={promo.desktopImage ? "md:hidden" : ""}
                            />
                            {/* Desktop image */}
                            {promo.desktopImage && (
                              <ImageWithSkeleton 
                                  src={promo.desktopImage} 
                                  alt={promo.title || "Promotion"} 
                                  aspectRatio="video"
                                  className="hidden md:block"
                              />
                            )}
                        </div>
                    </Link>
                </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default Promotions;
