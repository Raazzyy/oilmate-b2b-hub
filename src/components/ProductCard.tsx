import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id?: string;
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
  id = "1",
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
    <div className="group relative flex flex-col h-full p-3 bg-card rounded-2xl transition-all duration-300">
      {/* Clickable area for product page */}
      <Link to={`/product/${id}`} className="block">
        {/* Image container */}
        <div className="relative mb-3">
          <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-muted to-muted/50">
            <img
              src={image}
              alt={name}
              className="h-full w-full object-contain p-5 transition-transform group-hover:scale-105"
            />
          </div>
          
          {/* Discount badge */}
          {discountPercent && discountPercent > 0 && (
            <span className="absolute left-2 bottom-2 rounded-md bg-gradient-to-r from-primary to-accent px-2 py-1 text-xs font-bold text-primary-foreground">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Name - fixed height for alignment */}
        <h3 className="line-clamp-2 text-sm text-foreground leading-snug mb-2 h-10 group-hover:text-primary transition-colors">
          {name}
        </h3>
        
        {/* Volume and parameters inline - fixed height */}
        <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
          {volume} · {oilType} · {brand}{isUniversal && " · Универсальное"}
        </p>
      </Link>

      {/* Spacer to push price and button to bottom */}
      <div className="mt-auto">
        {/* Price */}
        <div className="mb-3 flex flex-col">
          {oldPrice && (
            <span className="text-xs text-muted-foreground line-through mb-1">
              {oldRubles}<sup className="text-[8px]">{String(oldKopecks).padStart(2, '0')}</sup>₽
            </span>
          )}
          <div className={`inline-flex items-baseline w-fit ${oldPrice ? 'bg-gradient-to-r from-primary/20 to-accent/20 px-1.5 py-0.5 rounded' : ''}`}>
            <span className={`text-xl font-bold ${oldPrice ? 'text-primary' : 'text-foreground'}`}>
              {rubles.toLocaleString("ru-RU")}
            </span>
            <sup className={`text-[10px] font-bold ml-px ${oldPrice ? 'text-primary' : 'text-foreground'}`}>
              {kopecks.toString().padStart(2, '0')}
            </sup>
            <span className={`text-base font-bold ml-0.5 ${oldPrice ? 'text-primary' : 'text-foreground'}`}>₽</span>
          </div>
        </div>

        {/* Add to cart */}
        <Button 
          variant="outline" 
          className="w-full rounded-full border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary font-medium h-10 transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          В корзину
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
