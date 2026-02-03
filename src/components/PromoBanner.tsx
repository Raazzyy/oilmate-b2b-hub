import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <section className="bg-gradient-to-r from-accent to-warning py-4">
      <div className="container">
        <div className="flex flex-wrap items-center justify-center gap-4 text-center text-accent-foreground">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            <span className="font-semibold text-lg">Скидка 500 ₽ на первый заказ от 15 000 ₽</span>
          </div>
          <Button 
            size="sm" 
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium"
          >
            Доставка
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
