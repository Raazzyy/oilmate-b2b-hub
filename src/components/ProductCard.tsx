import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  image: string;
  inStock: boolean;
  oilType: string;
  isUniversal?: boolean;
}

const ProductCard = ({
  name,
  brand,
  volume,
  price,
  oldPrice,
  image,
  oilType,
  isUniversal = true,
}: ProductCardProps) => {
  // Разделяем цену на рубли и копейки
  const rubles = Math.floor(price);
  const kopecks = Math.round((price - rubles) * 100) || 99;
  
  const oldRubles = oldPrice ? Math.floor(oldPrice) : null;
  const oldKopecks = oldPrice ? Math.round((oldPrice - Math.floor(oldPrice)) * 100) || 99 : null;

  return (
    <div className="group relative flex flex-col p-3">
      {/* Image container */}
      <div className="relative mb-3">
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-5 transition-transform group-hover:scale-105"
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="line-clamp-3 text-sm text-foreground leading-snug mb-2 min-h-[3.75rem]">
        {name}
      </h3>
      
      {/* Volume and parameters inline */}
      <p className="text-xs text-muted-foreground mb-3">
        {volume} · {oilType} · {brand}{isUniversal && " · Универсальное"}
      </p>

      {/* Price */}
      <div className="mb-3 flex items-baseline gap-2">
        {oldPrice && (
          <span className="text-sm text-muted-foreground line-through">
            {oldRubles}<sup className="text-[10px]">{oldKopecks}</sup>₽
          </span>
        )}
        <div className="flex items-baseline">
          <span className={`text-xl font-bold ${oldPrice ? 'text-primary' : 'text-foreground'}`}>
            {rubles.toLocaleString("ru-RU")}
          </span>
          <sup className={`text-xs font-bold ${oldPrice ? 'text-primary' : 'text-foreground'}`}>
            {kopecks.toString().padStart(2, '0')}
          </sup>
          <span className={`text-lg font-bold ${oldPrice ? 'text-primary' : 'text-foreground'}`}>₽</span>
        </div>
      </div>

      {/* Add to cart */}
      <Button 
        variant="outline" 
        className="w-full rounded-full border border-border hover:bg-muted font-medium h-10"
      >
        В корзину
      </Button>
    </div>
  );
};

export default ProductCard;
