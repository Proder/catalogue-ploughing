/**
 * Core data types for the Catalogue Order Portal
 */

export interface Product {
  id: string;              // Code (A1, A2, B1, etc.)
  name: string;            // Item name
  description: string;     // Description/Notes
  pricing2025: number;     // Current pricing (Pricing 2025)
  imageUrl?: string;       // Image URL
  exampleUrl?: string;     // Example image URL
  artworkTemplateUrl?: string; // Artwork template URL
  notes?: string;          // Additional notes
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
  unitPrice: number;     // Keep as unitPrice for order records
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
