import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  name: string;
  brand: string;
  volume: string;
  price: number;
  oldPrice?: number;
  rating: number;
  image: string;
  inStock: boolean;
  discount?: number;
}

const ProductCard = ({
  name,
  brand,
  volume,
  price,
  oldPrice,
  rating,
  image,
  discount,
}: ProductCardProps) => {
  return (
    <div className="group relative flex flex-col rounded-2xl bg-card border border-border p-4 transition-all hover:shadow-lg">
      {/* Discount badge */}
      {discount && (
        <span className="absolute left-3 top-3 z-10 rounded-lg bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
          % от 2 шт
        </span>
      )}

      {/* Image */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-xl bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-contain p-4 transition-transform group-hover:scale-105"
        />
      </div>

      {/* Rating */}
      <div className="mb-2 flex items-center gap-1">
        <Star className="h-4 w-4 fill-warning text-warning" />
        <span className="text-sm font-medium text-foreground">{rating.toFixed(2)}</span>
      </div>

      {/* Info */}
      <div className="mb-3 flex-1">
        <h3 className="line-clamp-2 text-sm font-medium text-foreground leading-snug mb-1">
          {name}
        </h3>
        <p className="text-xs text-muted-foreground">{volume}</p>
      </div>

      {/* Price */}
      <div className="mb-4">
        {oldPrice && (
          <span className="text-sm text-muted-foreground line-through mr-2">
            {oldPrice.toLocaleString("ru-RU")}₽
          </span>
        )}
        <div className="flex items-baseline gap-0.5">
          <span className="text-xl font-bold text-foreground">
            {price.toLocaleString("ru-RU")}
          </span>
          <span className="text-lg font-bold text-foreground">₽</span>
        </div>
      </div>

      {/* Add to cart */}
      <Button 
        variant="outline" 
        className="w-full rounded-xl border-2 hover:bg-muted font-medium"
      >
        В корзину
      </Button>
    </div>
  );
};

export default ProductCard;
