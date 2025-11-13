import {
  User,
  Table,
  Category,
  MenuItem,
  Modifier,
  Order,
  OrderItem,
  Payment,
  InventoryItem,
  Supplier,
  Shift,
  Customer,
  Setting,
  UserRole,
  TableStatus,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  VATRate
} from "@prisma/client";

// Re-export Prisma types
export type {
  User,
  Table,
  Category,
  MenuItem,
  Modifier,
  Order,
  OrderItem,
  Payment,
  InventoryItem,
  Supplier,
  Shift,
  Customer,
  Setting,
  UserRole,
  TableStatus,
  OrderStatus,
  OrderType,
  PaymentMethod,
  PaymentStatus,
  VATRate,
};

// Extended types with relations
export type MenuItemWithCategory = MenuItem & {
  category: Category;
  modifiers: Modifier[];
};

export type OrderWithDetails = Order & {
  table?: Table | null;
  waiter?: User | null;
  orderItems: (OrderItem & {
    menuItem: MenuItem;
  })[];
  payments: Payment[];
};

export type TableWithOrder = Table & {
  orders: Order[];
};

// Cart item type for POS interface
export interface CartItem {
  menuItemId: string;
  name: string;
  nameDE?: string;
  nameFR?: string;
  nameIT?: string;
  price: number;
  quantity: number;
  vatRate: VATRate;
  modifiers: string[];
  notes?: string;
  subtotal: number;
}

// Order creation DTO
export interface CreateOrderDTO {
  type: OrderType;
  tableId?: string;
  waiterId?: string;
  customerName?: string;
  customerPhone?: string;
  notes?: string;
  items: {
    menuItemId: string;
    quantity: number;
    modifiers: string[];
    notes?: string;
  }[];
}

// Payment creation DTO
export interface CreatePaymentDTO {
  orderId: string;
  amount: number;
  method: PaymentMethod;
  transactionRef?: string;
  cardLast4?: string;
}

// Split payment type
export interface SplitPayment {
  method: PaymentMethod;
  amount: number;
}

// Report types
export interface DailySalesReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByType: Record<OrderType, number>;
  ordersByStatus: Record<OrderStatus, number>;
  paymentsByMethod: Record<PaymentMethod, number>;
  topItems: {
    menuItemId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
  hourlySales: {
    hour: number;
    orders: number;
    revenue: number;
  }[];
}

// Settings type
export interface RestaurantSettings {
  name: string;
  address: string;
  city: string;
  phone: string;
  vatNumber: string;
  website: string;
  currency: string;
  vatRateStandard: number;
  vatRateReduced: number;
  defaultLanguage: string;
}

// WebSocket message types
export enum WSMessageType {
  ORDER_CREATED = "ORDER_CREATED",
  ORDER_UPDATED = "ORDER_UPDATED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
  TABLE_UPDATED = "TABLE_UPDATED",
  KITCHEN_ALERT = "KITCHEN_ALERT",
}

export interface WSMessage {
  type: WSMessageType;
  payload: any;
  timestamp: number;
}

// Notification types
export interface Notification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: Date;
}

// Language type
export type Language = "en" | "de" | "fr" | "it";

// Receipt data type
export interface ReceiptData {
  orderNumber: string;
  date: string;
  time: string;
  table?: string;
  waiter?: string;
  items: {
    quantity: number;
    name: string;
    price: number;
    total: number;
  }[];
  subtotal: number;
  vatAmount: number;
  discountAmount: number;
  total: number;
  paymentMethod: string;
  restaurantName: string;
  restaurantAddress: string;
  restaurantCity: string;
  restaurantPhone: string;
  restaurantVATNumber: string;
  restaurantWebsite: string;
}

// Printer config type
export interface PrinterConfig {
  ip: string;
  port: number;
  encoding: string;
}

// Floor plan position
export interface FloorPosition {
  x: number;
  y: number;
}

// Stock alert type
export interface StockAlert {
  inventoryItemId: string;
  name: string;
  currentQuantity: number;
  minQuantity: number;
  unit: string;
}
