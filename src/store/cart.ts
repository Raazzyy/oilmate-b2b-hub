
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductData } from '@/data/products';

export interface CartItem {
    product: ProductData;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isCartOpen: boolean;
    isClient: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    addToCart: (product: ProductData, quantity?: number) => void;
    removeFromCart: (productId: number | string) => void;
    updateQuantity: (productId: number | string, quantity: number) => void;
    clearCart: () => void;
    getItemQuantity: (productId: number | string) => number;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    setClient: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            isClient: false,

            setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

            setClient: () => set({ isClient: true }),

            addToCart: (product, quantity = 1) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.product.id === product.id);
                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: item.quantity + quantity }
                                    : item
                            ),
                            isCartOpen: true, // Auto-open cart on add
                        };
                    }
                    return {
                        items: [...state.items, { product, quantity }],
                        isCartOpen: true,
                    };
                });
            },

            removeFromCart: (productId) => {
                set((state) => ({
                    items: state.items.filter((item) => item.product.id !== productId),
                }));
            },

            updateQuantity: (productId, quantity) => {
                set((state) => {
                    if (quantity <= 0) {
                        return {
                            items: state.items.filter((item) => item.product.id !== productId),
                        };
                    }
                    return {
                        items: state.items.map((item) =>
                            item.product.id === productId ? { ...item, quantity } : item
                        ),
                    };
                });
            },

            clearCart: () => set({ items: [] }),

            getItemQuantity: (productId) => {
                const state = get();
                const item = state.items.find((item) => item.product.id === productId);
                return item ? item.quantity : 0;
            },

            getTotalItems: () => {
                const state = get();
                return state.items.reduce((total, item) => total + item.quantity, 0);
            },

            getTotalPrice: () => {
                const state = get();
                return state.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
            },
        }),
        {
            name: 'oilmate-cart-storage',
            skipHydration: true, // We handle hydration manually with isClient if needed, or rely on persist's hydration
        }
    )
);
