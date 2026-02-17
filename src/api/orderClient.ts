import type { OrderPayload, Category, Product } from '../types';

/**
 * API client for order and catalogue operations
 * Connects to Google Apps Script backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ========================================
// RESPONSE TYPES
// ========================================

interface CreateOrderResponse {
    success: boolean;
    orderId: string;
    editToken?: string;
    message: string;
}

interface LoadOrderResponse {
    success: boolean;
    order: OrderPayload | null;
    message?: string;
}

interface CatalogueResponse {
    success: boolean;
    categories: Category[];
    message?: string;
}

interface CategoriesResponse {
    success: boolean;
    categories: { id: string; name: string }[];
    message?: string;
}

interface SettingsResponse {
    success: boolean;
    settings: { phase2Enabled: boolean };
    message?: string;
}


// ========================================
// CATALOGUE FUNCTIONS
// ========================================

/**
 * Fetch categories only (without products)
 */
export async function fetchCategories(): Promise<CategoriesResponse> {
    try {
        if (!API_BASE_URL) {
            console.warn('API_BASE_URL not configured');
            throw new Error('API_BASE_URL not configured');
        }

        const response = await fetch(`${API_BASE_URL}?action=getCategories`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            success: data.success,
            categories: data.categories || [],
            message: data.message,
        };
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
}

/**
 * Fetch products for a specific category
 */
export async function fetchProductsByCategory(
    categoryId: string
): Promise<{ success: boolean; categoryId: string; categoryName: string; products: Product[]; message?: string }> {
    try {
        if (!API_BASE_URL) {
            console.warn('API_BASE_URL not configured');
            throw new Error('API_BASE_URL not configured');
        }

        const params = new URLSearchParams({
            action: 'getProductsByCategory',
            categoryId: categoryId,
        });

        const response = await fetch(`${API_BASE_URL}?${params}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch products:', error);
        throw error;
    }
}

/**
 * Fetch full catalogue (legacy - for backwards compatibility)
 */
export async function fetchCatalogue(): Promise<CatalogueResponse> {
    try {
        if (!API_BASE_URL) {
            console.warn('API_BASE_URL not configured, using mock data');
            throw new Error('API_BASE_URL not configured');
        }

        const response = await fetch(`${API_BASE_URL}?action=getCatalogue`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch catalogue:', error);
        throw error;
    }
}

/**
 * Fetch application settings
 */
export async function fetchSettings(): Promise<SettingsResponse> {
    try {
        if (!API_BASE_URL) {
            console.warn('API_BASE_URL not configured');
            // Return default if no API
            return { success: true, settings: { phase2Enabled: false } };
        }

        const response = await fetch(`${API_BASE_URL}?action=getSettings`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        // Default to false on error to be safe
        return { success: false, settings: { phase2Enabled: false } };
    }
}

// ========================================
// ORDER FUNCTIONS
// ========================================

/**
 * Submit a new order
 */
export async function createOrder(
    orderPayload: OrderPayload
): Promise<CreateOrderResponse> {
    try {
        if (!API_BASE_URL) {
            console.error('API_BASE_URL not configured');
            throw new Error('API not configured. Please set VITE_API_BASE_URL in .env');
        }

        console.log('Submitting order to Apps Script:', orderPayload);

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'createOrder',
                payload: orderPayload,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Order created:', result);
        return result;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
}

/**
 * Load an existing order by ID
 */
export async function loadOrder(orderId: string): Promise<LoadOrderResponse> {
    try {
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL not configured');
        }

        console.log('Loading order:', orderId);

        const response = await fetch(
            `${API_BASE_URL}?action=getOrder&orderId=${encodeURIComponent(orderId)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to load order:', error);
        return {
            success: false,
            order: null,
            message: error instanceof Error ? error.message : 'Failed to load order',
        };
    }
}

/**
 * Load an existing order by edit token
 */
export async function loadOrderByToken(token: string, email?: string): Promise<LoadOrderResponse> {
    try {
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL not configured');
        }

        console.log('Loading order by token');

        const params = new URLSearchParams({
            action: 'getOrderByToken',
            token: token,
        });
        if (email) {
            params.set('email', email);
        }

        const response = await fetch(
            `${API_BASE_URL}?${params}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.order) {
            console.log('Order loaded from edit link');
        }

        return result;
    } catch (error) {
        console.error('Failed to load order by token:', error);
        return {
            success: false,
            order: null,
            message: error instanceof Error ? error.message : 'Failed to load order',
        };
    }
}

/**
 * Update an existing order
 */
export async function updateOrder(
    orderId: string,
    orderPayload: OrderPayload,
    editToken?: string
): Promise<CreateOrderResponse> {
    try {
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL not configured');
        }

        console.log('Updating order:', orderId);

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify({
                action: 'updateOrder',
                orderId: orderId,
                payload: orderPayload,
                editToken: editToken,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Order updated:', result);
        return result;
    } catch (error) {
        console.error('Failed to update order:', error);
        throw error;
    }
}
