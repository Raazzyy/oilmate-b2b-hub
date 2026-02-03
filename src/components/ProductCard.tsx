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

  // Рассчитываем процент скидки
  const discountPercent = oldPrice ? Math.round((1 - price / oldPrice) * 100) : null;

  return (
    <div className="group relative flex flex-col h-full p-3 bg-card rounded-2xl">
      {/* Image container */}
      <div className="relative mb-3">
        <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-contain p-5 transition-transform group-hover:scale-105"
          />
        </div>
        
        {/* Discount badge */}
        {discountPercent && discountPercent > 0 && (
          <span className="absolute left-2 bottom-2 rounded-md bg-warning px-2 py-1 text-xs font-bold text-warning-foreground">
            -{discountPercent}%
          </span>
        )}
      </div>

      {/* Name - fixed height for alignment */}
      <h3 className="line-clamp-2 text-sm text-foreground leading-snug mb-2 h-10">
        {name}
      </h3>
      
      {/* Volume and parameters inline - fixed height */}
      <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
        {volume} · {oilType} · {brand}{isUniversal && " · Универсальное"}
      </p>

      {/* Spacer to push price and button to bottom */}
      <div className="mt-auto">
        {/* Price */}
        <div className="mb-3 flex flex-col">
          {oldPrice && (
            <span className="text-sm text-muted-foreground line-through mb-0.5">
              {oldRubles}<sup className="text-[10px]">{oldKopecks}</sup>₽
            </span>
          )}
          <div className="flex items-baseline">
            <span className={`text-xl font-bold ${oldPrice ? 'text-foreground' : 'text-foreground'}`}>
              {rubles.toLocaleString("ru-RU")}
            </span>
            <sup className={`text-xs font-bold text-foreground`}>
              {kopecks.toString().padStart(2, '0')}
            </sup>
            <span className={`text-lg font-bold text-foreground`}>₽</span>
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
    </div>
  );
};

export default ProductCard;
