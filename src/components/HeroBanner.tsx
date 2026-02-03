import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const HeroBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <section className="py-6">
      <div className="container">
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main banner */}
          <div className="relative lg:col-span-2 h-[380px] rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-primary to-accent">
            {/* Animated shimmer overlay */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_3s_ease-in-out_infinite]" style={{ backgroundSize: '200% 100%' }} />
            </div>
            
            {/* Navigation arrows */}
            <button 
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center shadow-lg hover:bg-card transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setCurrentSlide(prev => Math.min(2, prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-card/90 flex items-center justify-center shadow-lg hover:bg-card transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div className="relative h-full p-8 flex flex-col justify-between">
              {/* Pattern background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/40 to-transparent" />
                <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <h2 className="text-5xl font-black text-primary-foreground leading-tight drop-shadow-lg">
                  ЦЕНТР<br/>
                  НИЗКИХ<br/>
                  ЦЕН
                </h2>
              </div>

              <div className="relative z-10 flex items-end justify-between">
                <Button className="bg-card text-foreground hover:bg-card/90 font-semibold px-8 h-12 rounded-xl text-lg shadow-xl">
                  Подробнее
                </Button>

                <div className="text-right text-primary-foreground">
                  <p className="text-lg mb-2 drop-shadow">Ищите товары со<br/>специальным ценником</p>
                  <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                    <span className="text-lg font-semibold">Выгодно</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Side banner */}
          <div className="h-[380px] rounded-3xl overflow-hidden bg-gradient-to-br from-accent via-accent to-primary/80 p-6 flex flex-col justify-between relative">
            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-primary-foreground leading-snug mb-4 drop-shadow">
                Широкий ассортимент<br/>
                моторных масел
              </h3>
              
              <p className="text-primary-foreground/90 text-sm">
                Для легковых и грузовых<br/>автомобилей, спецтехники
              </p>
            </div>

            <Button className="relative z-10 bg-card text-foreground hover:bg-card/90 font-semibold w-fit px-8 h-11 rounded-xl shadow-lg">
              Смотреть каталог
            </Button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((dot) => (
            <button
              key={dot}
              onClick={() => setCurrentSlide(dot)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentSlide === dot ? "bg-primary w-6" : "bg-border hover:bg-primary/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
