
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

// Mock data for promotions
const promotions = [
  {
    id: 1,
    title: "Скидка 15% на моторные масла Lukoil",
    description: "Только до конца месяца при заказе от 50 000 ₽",
    image: "/oil-product.png",
    color: "bg-blue-600",
  },
  {
    id: 2,
    title: "Бесплатная доставка",
    description: "При заказе бочки любого масла объемом 200л",
    image: "/oil-product.png",
    color: "bg-orange-500",
  },
  {
    id: 3,
    title: "Оптовые цены для СТО",
    description: "Специальные условия для автосервисов и магазинов",
    image: "/oil-product.png",
    color: "bg-green-600",
  },
];

const Promotions = () => {
  return (
    <section className="py-6 md:py-10 bg-muted/30">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Акции и предложения</h2>
          
          <div className="hidden md:flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/promotions">
                Все акции <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
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
                <div className="group relative overflow-hidden rounded-2xl bg-card border border-border h-full flex flex-col">
                  {/* Image/Background Area */}
                  <div className={`h-40 md:h-48 w-full ${promo.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    {/* Abstract shapes or image */}
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    
                    <div className="absolute inset-0 p-6 flex flex-col justify-center text-white">
                      <h3 className="text-xl font-bold leading-tight mb-2 drop-shadow-sm">
                        {promo.title}
                      </h3>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <p className="text-muted-foreground text-sm mb-4 flex-1">
                      {promo.description}
                    </p>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                      Подробнее
                    </Button>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </div>
        </Carousel>

        <div className="mt-6 md:hidden">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/promotions">
              Смотреть все акции
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Promotions;
