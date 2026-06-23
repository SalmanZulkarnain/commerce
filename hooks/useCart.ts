import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  weight: number;
  imageUrl: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  calculateTotalPrice: () => number;
  totalWeight: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.productId === item.productId,
        );
        if (existing) {
          set((state) => ({
            items: state.items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity: 1 }],
          }));
        }
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId.toString()),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId.toString() ? { ...i, quantity } : i,
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
        if (typeof window !== undefined) {
          localStorage.removeItem("my-cart")
        }
      },
      calculateTotalPrice: () =>
        get().items.reduce((acc, i) => acc + i.price * i.quantity, 0),
      totalWeight: () =>
        get().items.reduce((acc, i) => acc + i.weight * i.quantity, 0),
    }),
    {
      name: "my-cart",
    },
  ),
);
