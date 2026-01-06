import type { OrderPayload } from '../types';
import type { Category } from '../types';

/**
 * API client for order operations
 * Connects to Google Apps Script backend
 */

// Get API URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

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

/**
 * Fetch catalogue from Google Sheets via Apps Script
 * @returns Promise with categories and products
 */
export async function fetchCatalogue(): Promise<CatalogueResponse> {
    try {
        if (!API_BASE_URL) {
            console.warn('⚠️ API_BASE_URL not configured, using mock data');
            throw new Error('API_BASE_URL not configured');
        }

        const response = await fetch(`${API_BASE_URL}?action=getCategories`);

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
 * Submit a new order
 * @param orderPayload - The order data to submit
 * @returns Promise with the order creation response
 */
export async function createOrder(
    orderPayload: OrderPayload
): Promise<CreateOrderResponse> {
    try {
        if (!API_BASE_URL) {
            console.error('❌ API_BASE_URL not configured');
            throw new Error('API not configured. Please set VITE_API_BASE_URL in .env');
        }

        console.log('📦 Submitting order to Apps Script:', orderPayload);

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain', // Apps Script compatibility
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
        console.log('✅ Order created:', result);
        return result;
    } catch (error) {
        console.error('Failed to create order:', error);
        throw error;
    }
}

/**
 * Load an existing order by ID
 * @param orderId - The order ID to load
 * @returns Promise with the order data
 */
export async function loadOrder(orderId: string): Promise<LoadOrderResponse> {
    try {
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL not configured');
        }

        console.log('📄 Loading order:', orderId);

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
 * @param token - The edit token from email link
 * @returns Promise with the order data
 */
export async function loadOrderByToken(token: string): Promise<LoadOrderResponse> {
    try {
        if (!API_BASE_URL) {
            throw new Error('API_BASE_URL not configured');
        }

        console.log('🔑 Loading order by token');

        const response = await fetch(
            `${API_BASE_URL}?action=getOrderByToken&token=${encodeURIComponent(token)}`
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.order) {
            console.log('✅ Order loaded from edit link');
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
 * @param orderId - The order ID to update
 * @param orderPayload - The updated order data
 * @param editToken - Optional edit token for verification
 * @returns Promise with the update response
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

        console.log('✏️ Updating order:', orderId);

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
        console.log('✅ Order updated:', result);
        return result;
    } catch (error) {
        console.error('Failed to update order:', error);
        throw error;
    }
}
