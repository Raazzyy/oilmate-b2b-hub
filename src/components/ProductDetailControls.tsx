"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartButton from "@/components/AddToCartButton";
import { ProductData } from "@/data/products";

interface ProductDetailControlsProps {
  product: ProductData;
}

const ProductDetailControls = ({ product }: ProductDetailControlsProps) => {
  const [quantity, setQuantity] = useState(1);

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex items-center border rounded-xl bg-muted/20 px-2 h-12 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-muted"
          onClick={decreaseQty}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <span className="w-10 text-center font-bold">{quantity}</span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-muted font-bold"
          onClick={increaseQty}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 max-w-[300px]">
        <AddToCartButton
          product={product}
          quantity={quantity}
          className="w-full h-12 text-base font-bold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all"
        />
      </div>
    </div>
  );
};

export default ProductDetailControls;
