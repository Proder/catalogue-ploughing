/**
 * Core data types for the Catalogue Order Portal
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  size: string;
  unitPrice: number;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface OrderLineItem {
  categoryId: string;
  categoryName: string;
  productId: string;
  productName: string;
  size: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface UserInfo {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

export interface OrderTotals {
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
}

export interface OrderPayload {
  userInfo: UserInfo;
  lineItems: OrderLineItem[];
  totals: OrderTotals;
  timestamp: string;
}

// Form validation state
export interface ValidationErrors {
  name?: string;
  email?: string;
}
