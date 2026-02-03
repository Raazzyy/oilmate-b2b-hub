import { Star, ShoppingCart } from "lucide-react";
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
  inStock,
  discount,
}: ProductCardProps) => {
  return (
    <div className="group relative flex flex-col rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-lg">
      {/* Discount badge */}
      {discount && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-accent px-2 py-1 text-xs font-bold text-accent-foreground">
          -{discount}%
        </span>
      )}

      {/* Image */}
      <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-muted">
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
        <p className="mb-1 text-xs font-medium text-muted-foreground">{brand}</p>
        <h3 className="line-clamp-2 text-sm font-medium text-foreground leading-snug">
          {name}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{volume}</p>
      </div>

      {/* Price */}
      <div className="mb-3">
        {oldPrice && (
          <span className="text-sm text-muted-foreground line-through">
            {oldPrice.toLocaleString("ru-RU")}₽
          </span>
        )}
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-foreground">
            {price.toLocaleString("ru-RU")}
          </span>
          <span className="text-lg font-bold text-foreground">₽</span>
        </div>
      </div>

      {/* Stock status */}
      <p className={`mb-3 text-xs font-medium ${inStock ? "text-success" : "text-muted-foreground"}`}>
        {inStock ? "В наличии" : "Под заказ"}
      </p>

      {/* Add to cart */}
      <Button className="w-full gap-2 bg-primary hover:bg-primary/90">
        <ShoppingCart className="h-4 w-4" />
        В корзину
      </Button>
    </div>
  );
};

export default ProductCard;
