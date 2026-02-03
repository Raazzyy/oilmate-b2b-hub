import { Button } from "@/components/ui/button";
import { ArrowRight, Truck, Shield, Percent } from "lucide-react";

const HeroBanner = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90 py-12 md:py-20">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-accent" />
        <div className="absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-accent" />
      </div>

      <div className="container relative">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Content */}
          <div className="space-y-6 text-primary-foreground">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-2 text-sm font-medium text-accent">
              <Percent className="h-4 w-4" />
              Скидка до 15% на первый заказ
            </div>
            
            <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
              Оптовые поставки
              <span className="block text-accent">моторных масел</span>
            </h1>
            
            <p className="max-w-lg text-lg text-primary-foreground/80 md:text-xl">
              Прямые поставки от производителей. Shell, Mobil, Castrol, Лукойл и другие бренды со склада в Москве.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold gap-2 h-14 px-8">
                Смотреть каталог
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 h-14 px-8">
                Запросить прайс
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: Truck,
                title: "Доставка по России",
                desc: "Бесплатная доставка от 50 000 ₽",
              },
              {
                icon: Shield,
                title: "Гарантия качества",
                desc: "Только оригинальная продукция",
              },
              {
                icon: Percent,
                title: "Оптовые цены",
                desc: "Специальные условия для B2B",
              },
              {
                icon: ArrowRight,
                title: "Быстрая отгрузка",
                desc: "Отправка в день заказа",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded-xl bg-primary-foreground/10 p-5 backdrop-blur-sm transition-all hover:bg-primary-foreground/15"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <feature.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <h3 className="mb-1 font-semibold text-primary-foreground">{feature.title}</h3>
                <p className="text-sm text-primary-foreground/70">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
