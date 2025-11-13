import { create } from "zustand";
import { CartItem, OrderType, VATRate } from "@/types";
import { calculateVAT } from "@/lib/utils";

interface POSState {
  // Cart state
  cart: CartItem[];
  orderType: OrderType;
  selectedTableId: string | null;
  customerName: string;
  customerPhone: string;
  orderNotes: string;

  // Calculated values
  subtotal: number;
  vatAmount: number;
  discountAmount: number;
  total: number;

  // Actions
  addToCart: (item: Omit<CartItem, "subtotal">) => void;
  removeFromCart: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  clearCart: () => void;
  setOrderType: (type: OrderType) => void;
  setSelectedTable: (tableId: string | null) => void;
  setCustomerName: (name: string) => void;
  setCustomerPhone: (phone: string) => void;
  setOrderNotes: (notes: string) => void;
  setDiscountAmount: (amount: number) => void;
  calculateTotals: () => void;
}

export const usePOSStore = create<POSState>((set, get) => ({
  // Initial state
  cart: [],
  orderType: "DINE_IN",
  selectedTableId: null,
  customerName: "",
  customerPhone: "",
  orderNotes: "",
  subtotal: 0,
  vatAmount: 0,
  discountAmount: 0,
  total: 0,

  // Actions
  addToCart: (item) => {
    const { cart } = get();
    const existingItemIndex = cart.findIndex(
      (i) =>
        i.menuItemId === item.menuItemId &&
        JSON.stringify(i.modifiers) === JSON.stringify(item.modifiers)
    );

    let newCart: CartItem[];
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      newCart = cart.map((i, index) =>
        index === existingItemIndex
          ? {
              ...i,
              quantity: i.quantity + item.quantity,
              subtotal: (i.quantity + item.quantity) * i.price,
            }
          : i
      );
    } else {
      // Add new item
      const subtotal = item.price * item.quantity;
      newCart = [...cart, { ...item, subtotal }];
    }

    set({ cart: newCart });
    get().calculateTotals();
  },

  removeFromCart: (menuItemId) => {
    const { cart } = get();
    const newCart = cart.filter((item) => item.menuItemId !== menuItemId);
    set({ cart: newCart });
    get().calculateTotals();
  },

  updateQuantity: (menuItemId, quantity) => {
    const { cart } = get();
    if (quantity <= 0) {
      get().removeFromCart(menuItemId);
      return;
    }

    const newCart = cart.map((item) =>
      item.menuItemId === menuItemId
        ? { ...item, quantity, subtotal: item.price * quantity }
        : item
    );

    set({ cart: newCart });
    get().calculateTotals();
  },

  clearCart: () => {
    set({
      cart: [],
      selectedTableId: null,
      customerName: "",
      customerPhone: "",
      orderNotes: "",
      subtotal: 0,
      vatAmount: 0,
      discountAmount: 0,
      total: 0,
    });
  },

  setOrderType: (type) => {
    set({ orderType: type });
  },

  setSelectedTable: (tableId) => {
    set({ selectedTableId: tableId });
  },

  setCustomerName: (name) => {
    set({ customerName: name });
  },

  setCustomerPhone: (phone) => {
    set({ customerPhone: phone });
  },

  setOrderNotes: (notes) => {
    set({ orderNotes: notes });
  },

  setDiscountAmount: (amount) => {
    set({ discountAmount: amount });
    get().calculateTotals();
  },

  calculateTotals: () => {
    const { cart, discountAmount } = get();

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);

    // Calculate VAT (grouped by rate)
    let totalVAT = 0;
    cart.forEach((item) => {
      const itemVAT = calculateVAT(item.subtotal, item.vatRate);
      totalVAT += itemVAT;
    });

    // Calculate total
    const total = subtotal + totalVAT - discountAmount;

    set({
      subtotal,
      vatAmount: totalVAT,
      total: Math.max(0, total),
    });
  },
}));
