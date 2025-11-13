import { create } from "zustand";
import { Notification, Language } from "@/types";

interface UIState {
  // Notifications
  notifications: Notification[];
  addNotification: (
    type: Notification["type"],
    title: string,
    message: string
  ) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Modals
  isPaymentModalOpen: boolean;
  isSplitBillModalOpen: boolean;
  isModifierModalOpen: boolean;
  isDiscountModalOpen: boolean;
  isSettingsModalOpen: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  openSplitBillModal: () => void;
  closeSplitBillModal: () => void;
  openModifierModal: () => void;
  closeModifierModal: () => void;
  openDiscountModal: () => void;
  closeDiscountModal: () => void;
  openSettingsModal: () => void;
  closeSettingsModal: () => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;

  // Online/Offline status
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
}

export const useUIStore = create<UIState>((set, get) => ({
  // Notifications
  notifications: [],
  addNotification: (type, title, message) => {
    const notification: Notification = {
      id: Math.random().toString(36).substring(7),
      type,
      title,
      message,
      timestamp: new Date(),
    };
    set({ notifications: [notification, ...get().notifications] });

    // Auto-remove after 5 seconds
    setTimeout(() => {
      get().removeNotification(notification.id);
    }, 5000);
  },
  removeNotification: (id) => {
    set({
      notifications: get().notifications.filter((n) => n.id !== id),
    });
  },
  clearNotifications: () => {
    set({ notifications: [] });
  },

  // Language
  language: "de",
  setLanguage: (lang) => {
    set({ language: lang });
    localStorage.setItem("language", lang);
  },

  // Modals
  isPaymentModalOpen: false,
  isSplitBillModalOpen: false,
  isModifierModalOpen: false,
  isDiscountModalOpen: false,
  isSettingsModalOpen: false,
  openPaymentModal: () => set({ isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),
  openSplitBillModal: () => set({ isSplitBillModalOpen: true }),
  closeSplitBillModal: () => set({ isSplitBillModalOpen: false }),
  openModifierModal: () => set({ isModifierModalOpen: true }),
  closeModifierModal: () => set({ isModifierModalOpen: false }),
  openDiscountModal: () => set({ isDiscountModalOpen: true }),
  closeDiscountModal: () => set({ isDiscountModalOpen: false }),
  openSettingsModal: () => set({ isSettingsModalOpen: true }),
  closeSettingsModal: () => set({ isSettingsModalOpen: false }),

  // Loading
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),

  // Sidebar
  isSidebarOpen: true,
  toggleSidebar: () => set({ isSidebarOpen: !get().isSidebarOpen }),

  // Online/Offline
  isOnline: true,
  setIsOnline: (online) => set({ isOnline: online }),
}));
