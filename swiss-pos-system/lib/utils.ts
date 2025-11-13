import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format currency in Swiss Francs
 */
export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency: "CHF",
  }).format(num);
}

/**
 * Calculate Swiss VAT
 * @param amount - Base amount
 * @param rate - "STANDARD" (7.7%) or "REDUCED" (2.5%)
 */
export function calculateVAT(
  amount: number,
  rate: "STANDARD" | "REDUCED"
): number {
  const vatRate = rate === "STANDARD" ? 0.077 : 0.025;
  return amount * vatRate;
}

/**
 * Calculate total with VAT
 */
export function calculateTotalWithVAT(
  amount: number,
  rate: "STANDARD" | "REDUCED"
): number {
  return amount + calculateVAT(amount, rate);
}

/**
 * Format date for Swiss locale
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("de-CH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

/**
 * Format time for Swiss locale
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("de-CH", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/**
 * Format date and time
 */
export function formatDateTime(date: Date | string): string {
  return `${formatDate(date)} ${formatTime(date)}`;
}

/**
 * Generate unique order number
 * Format: YYYYMMDD-XXXX (e.g., 20251113-0001)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const randomPart = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `${datePart}-${randomPart}`;
}

/**
 * Calculate change for cash payments
 */
export function calculateChange(total: number, received: number): number {
  return Math.max(0, received - total);
}

/**
 * Validate Swiss phone number
 */
export function validateSwissPhone(phone: string): boolean {
  const phoneRegex = /^(\+41|0041|0)[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ""));
}

/**
 * Validate Swiss VAT number
 */
export function validateSwissVATNumber(vat: string): boolean {
  const vatRegex = /^CHE-\d{3}\.\d{3}\.\d{3}$/;
  return vatRegex.test(vat);
}

/**
 * Format Swiss phone number
 */
export function formatSwissPhone(phone: string): string {
  const cleaned = phone.replace(/\s/g, "");
  if (cleaned.startsWith("+41")) {
    return cleaned.replace(/^(\+41)(\d{2})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5");
  }
  return phone;
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Calculate preparation time estimate for order
 */
export function estimatePreparationTime(itemCount: number): number {
  // Base time: 5 minutes
  // Additional: 2 minutes per item
  return 5 + itemCount * 2;
}

/**
 * Check if order is urgent (>15 minutes old)
 */
export function isOrderUrgent(createdAt: Date | string): boolean {
  const created = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const now = new Date();
  const diffMinutes = (now.getTime() - created.getTime()) / 1000 / 60;
  return diffMinutes > 15;
}

/**
 * Get order age in minutes
 */
export function getOrderAge(createdAt: Date | string): number {
  const created = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const now = new Date();
  return Math.floor((now.getTime() - created.getTime()) / 1000 / 60);
}
