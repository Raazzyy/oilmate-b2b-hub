"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { ProductData } from "@/data/products";
import { Check, Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface AddToCartButtonProps {
  product: ProductData;
  className?: string;
  showStepper?: boolean;
}

const AddToCartButton = ({ product, className, showStepper = true }: AddToCartButtonProps) => {
  const { addToCart, updateQuantity, getItemQuantity, isClient, setClient } = useCartStore();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setClient();
  }, [setClient]);

  const quantity = isClient ? getItemQuantity(product.id) : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleUpdateQuantity = (e: React.MouseEvent, newQuantity: number) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(product.id, newQuantity);
  };

  const isOutOfStock = product.stock !== undefined ? product.stock <= 0 : product.inStock === false;

  if (showStepper && quantity > 0) {
    return (
      <div className={`flex items-center bg-background border border-border rounded-xl h-10 px-1 ${className || ''}`}>
        <button
          onClick={(e) => handleUpdateQuantity(e, quantity - 1)}
          className="w-10 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="flex-1 text-center font-bold text-foreground text-sm">
          {quantity}
        </span>
        <button
          onClick={(e) => handleAddToCart(e)}
          disabled={product.stock !== undefined && quantity >= product.stock}
          className="w-10 h-8 flex items-center justify-center text-muted-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-30"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

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
