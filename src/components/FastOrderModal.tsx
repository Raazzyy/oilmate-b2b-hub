"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductData } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { Zap } from "lucide-react";

interface FastOrderModalProps {
  product: ProductData;
  trigger?: React.ReactNode;
}

export default function FastOrderModal({ product, trigger }: FastOrderModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все поля",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "fast",
          order: {
            name: formData.name,
            phone: formData.phone,
            productName: product.name,
            volume: product.volume,
            price: product.price,
          },
        }),
      });

      if (response.ok) {
        toast({
          title: "Заказ оформлен!",
          description: "Менеджер свяжется с вами в ближайшее время.",
        });
        setOpen(false);
        setFormData({ name: "", phone: "" });
      } else {
        throw new Error("Failed to send");
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Ошибка",
        description: "Не удалось отправить заказ. Попробуйте позже.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="w-full h-12 rounded-full border-primary text-primary hover:bg-primary/5 font-semibold">
            <Zap className="h-4 w-4 mr-2" />
            Купить в 1 клик
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Заказать в 1 клик</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex gap-4 p-3 bg-muted rounded-xl">
             <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center shrink-0">
               <img 
                 src={typeof product.image === 'string' ? product.image : product.image.src} 
                 alt={product.name} 
                 className="w-full h-full object-contain p-1"
               />
             </div>
             <div>
               <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
               <p className="text-xs text-muted-foreground">{product.volume}</p>
               <p className="font-bold text-primary mt-1">{product.price.toLocaleString()} ₽</p>
             </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Ваше имя</label>
              <Input 
                placeholder="Иван Иванов" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Телефон</label>
              <Input 
                type="tel" 
                placeholder="+7 (999) 000-00-00" 
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 gradient-primary hover:gradient-primary-hover text-white font-semibold rounded-full mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Отправка..." : "Оформить заказ"}
            </Button>
          </form>
          <p className="text-[10px] text-center text-muted-foreground italic">
            Нажимая кнопку, вы соглашаетесь на обработку персональных данных
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
