
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
    selectedCity: string;
    setSelectedCity: (city: string) => void;
    setClient: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isCartOpen: false,
            isClient: false,
            selectedCity: 'vladivostok',

            setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
            setSelectedCity: (city) => set({ selectedCity: city }),

            setClient: () => set({ isClient: true }),

            addToCart: (product, quantity = 1) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.product.id === product.id);
                    const currentQty = existingItem ? existingItem.quantity : 0;
                    const newQty = currentQty + quantity;

                    // Enforce stock limit if stock is defined
                    if (product.stock !== undefined && newQty > product.stock) {
                        const availableToAdd = product.stock - currentQty;
                        if (availableToAdd <= 0) return state; // Already at limit

                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: product.stock! }
                                    : item
                            ),
                            isCartOpen: true,
                        };
                    }

                    if (existingItem) {
                        return {
                            items: state.items.map((item) =>
                                item.product.id === product.id
                                    ? { ...item, quantity: newQty }
                                    : item
                            ),
                            isCartOpen: true,
                        };
                    }
                    return {
                        items: [...state.items, { product, quantity: Math.min(quantity, product.stock ?? 999999) }],
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

                    const item = state.items.find(i => i.product.id === productId);
                    if (item && item.product.stock !== undefined && quantity > item.product.stock) {
                        quantity = item.product.stock;
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
