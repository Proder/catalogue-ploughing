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
  size?: string;           // Product size (hidden from UI)
  supplier?: string;       // Supplier name (hidden from UI)
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
  size?: string;         // Product size (from product)
  supplier?: string;     // Supplier (from product)
}

export interface UserInfo {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  // New fields for Step 1
  department: string;
  mobile: string;
  backupName: string;
  backupEmail: string;
  hub: string;
  sameRequirements: boolean;
}

export interface Phase1Data {
  footprint: string; // Width x Depth
  locationRequests?: string;
  sharedStorage: boolean;
  storageSize?: string; // If sharedStorage is true
}

export interface OrderTotals {
  total: number;
}

export interface OrderPayload {
  userInfo: UserInfo;
  phase1Data?: Phase1Data; // Optional as it might be filled later
  lineItems: OrderLineItem[];
  totals: OrderTotals;
  timestamp: string;
  emailType?: 'INFO' | 'PHASE1' | 'PHASE2' | 'SAME_REQUIREMENTS';
}

// Form validation state
export interface ValidationErrors {
  name?: string;
  email?: string;
  department?: string;
  mobile?: string;
  backupName?: string;
  backupEmail?: string;
  hub?: string;
  // Phase 1 validation
  footprint?: string;
  storageSize?: string;
}
