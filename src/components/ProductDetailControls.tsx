"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/AddToCartButton";
import { ProductData } from "@/data/products";
import { useCartStore } from "@/store/cart";

interface ProductDetailControlsProps {
  product: ProductData;
}

const ProductDetailControls = ({ product }: ProductDetailControlsProps) => {
  const { getItemQuantity, updateQuantity, isClient } = useCartStore();
  const cartQuantity = isClient ? getItemQuantity(product.id) : 0;
  
  const [quantity, setQuantity] = useState(1);

  // Sync local quantity with cart if product is in cart
  useEffect(() => {
    if (cartQuantity > 0) {
      setQuantity(cartQuantity);
    }
  }, [cartQuantity]);

  const decreaseQty = () => {
    const newQty = Math.max(1, quantity - 1);
    setQuantity(newQty);
    if (cartQuantity > 0) {
      updateQuantity(product.id, newQty);
    }
  };

  const increaseQty = () => {
    const newQty = quantity + 1;
    if (product.stock !== undefined && newQty > product.stock) return;
    setQuantity(newQty);
    if (cartQuantity > 0) {
      updateQuantity(product.id, newQty);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex items-center border border-border rounded-xl bg-background px-2 h-12 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
          onClick={decreaseQty}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center font-bold text-foreground">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-muted text-muted-foreground"
          onClick={increaseQty}
          disabled={product.stock !== undefined && quantity >= product.stock}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 max-w-[300px]">
        {cartQuantity > 0 ? (
          <Button 
            variant="ghost" 
            className="w-full h-12 text-base font-bold rounded-xl bg-green-50 text-green-600 border border-green-100 cursor-default hover:bg-green-50"
          >
            В корзине
          </Button>
        ) : (
          <AddToCartButton
            product={product}
            showStepper={false}
            quantity={quantity}
            className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all px-0"
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailControls;
