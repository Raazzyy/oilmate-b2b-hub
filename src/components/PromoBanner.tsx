import { Button } from "@/components/ui/button";

const PromoBanner = () => {
  return (
    <section className="relative py-4 overflow-hidden">
      {/* Decorative wave background */}
      <div className="absolute inset-0 bg-primary">
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1200 60"
        >
          <pattern id="wave-pattern" x="0" y="0" width="120" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M0 30 Q30 10 60 30 T120 30"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
          </pattern>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" />
        </svg>
      </div>

      <div className="container relative">
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <span className="text-primary-foreground font-semibold text-lg">
            Скидка 500 ₽ на первый заказ от 15 000 ₽
          </span>
          <Button 
            size="sm" 
            variant="outline"
            className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 font-medium rounded-full px-6"
          >
            Доставка
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
