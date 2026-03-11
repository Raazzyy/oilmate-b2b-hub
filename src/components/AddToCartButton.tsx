"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { ProductData } from "@/data/products";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

interface AddToCartButtonProps {
  product: ProductData;
  className?: string;
  quantity?: number;
}

const AddToCartButton = ({ product, className, quantity = 1 }: AddToCartButtonProps) => {
  const { addToCart, isClient, setClient } = useCartStore();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setClient();
  }, [setClient]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, quantity);
    setAdded(true);
    
    setTimeout(() => setAdded(false), 1500);
  };

  const isOutOfStock = product.stock !== undefined ? product.stock <= 0 : product.inStock === false;

  return (
    <Button 
      variant="ghost" 
      disabled={isOutOfStock}
      className={`w-full rounded-xl font-medium h-10 transition-all ${
        added 
          ? "bg-green-100 text-green-700 hover:bg-green-100" 
          : isOutOfStock
          ? "bg-red-50 text-red-400 cursor-not-allowed"
          : "bg-muted hover:bg-primary hover:text-primary-foreground"
      } ${className || ''}`}
      onClick={handleAddToCart}
    >
      {added ? (
        <>
          <Check className="h-4 w-4 mr-1" />
          Добавлено
        </>
      ) : isOutOfStock ? (
        "Нет в наличии"
      ) : (
        "В корзину"
      )}
    </Button>
  );
};

export default AddToCartButton;
