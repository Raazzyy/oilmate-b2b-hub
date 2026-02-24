
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
import { ArrowRight } from "lucide-react";
import ImageWithSkeleton from "./ImageWithSkeleton";
import { getStrapiMedia, StrapiImage } from "@/lib/strapi";

interface Promotion {
  id: number;
  title?: string;
  image?: StrapiImage;
  href: string;
}

interface PromotionsProps {
  promotions: Promotion[];
}

const Promotions = ({ promotions }: PromotionsProps) => {
  if (!promotions || promotions.length === 0) return null;

  return (
    <section className="py-6 md:py-10 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-foreground">Акции и предложения</h2>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {promotions.map((promo) => (
                <CarouselItem key={promo.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <Link href={promo.href} className="block group">
                        <div className="relative overflow-hidden rounded-3xl bg-card border border-border h-full flex flex-col aspect-video">
                            <ImageWithSkeleton 
                                src={getStrapiMedia(promo.image?.url) || "/oil-product.png"} 
                                alt={promo.title || "Promotion"} 
                                aspectRatio="video"
                            />
                            {promo.title && (
                                <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent text-white">
                                    <h3 className="text-xl font-bold leading-tight mb-2 drop-shadow-sm">
                                        {promo.title}
                                    </h3>
                                </div>
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
