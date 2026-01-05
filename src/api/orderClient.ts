import type { OrderPayload } from '../types';

/**
 * API client for order operations
 * Currently stubbed - replace with actual API calls when backend is ready
 */

interface CreateOrderResponse {
    success: boolean;
    orderId: string;
    message: string;
}

interface LoadOrderResponse {
    success: boolean;
    order: OrderPayload | null;
}

/**
 * Submit a new order
 * @param orderPayload - The order data to submit
 * @returns Promise with the order creation response
 */
export async function createOrder(
    orderPayload: OrderPayload
): Promise<CreateOrderResponse> {
    // TODO: Replace with actual API call
    // Example: const response = await fetch('/api/orders', { method: 'POST', body: JSON.stringify(orderPayload) })

    console.log('📦 Order payload being submitted:', orderPayload);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mock successful response
    return {
        success: true,
        orderId: `ORD-${Date.now()}`,
        message: 'Order created successfully',
    };
}

/**
 * Load an existing order by ID
 * @param orderId - The order ID to load
 * @returns Promise with the order data
 */
export async function loadOrder(orderId: string): Promise<LoadOrderResponse> {
    // TODO: Replace with actual API call
    // Example: const response = await fetch(`/api/orders/${orderId}`)

    console.log('📄 Loading order:', orderId);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Mock response - in production, this would return actual order data
    return {
        success: false,
        order: null,
    };
}

/**
 * Update an existing order
 * @param orderId - The order ID to update
 * @param orderPayload - The updated order data
 * @returns Promise with the update response
 */
export async function updateOrder(
    orderId: string,
    orderPayload: OrderPayload
): Promise<CreateOrderResponse> {
    // TODO: Replace with actual API call when edit functionality is implemented

    console.log('✏️ Updating order:', orderId, orderPayload);

    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
        success: true,
        orderId,
        message: 'Order updated successfully',
    };
}
