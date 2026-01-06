const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry<T> {
    data: T;
    timestamp: number;
}

/**
 * Get cached products for a specific category and page
 */
export function getCachedProducts(categoryId: string, page: number): any | null {
    const key = `products_${categoryId}_${page}`;
    const cached = sessionStorage.getItem(key);

    if (!cached) return null;

    try {
        const entry: CacheEntry<any> = JSON.parse(cached);

        if (Date.now() - entry.timestamp > CACHE_TTL) {
            sessionStorage.removeItem(key);
            return null;
        }

        return entry.data;
    } catch {
        sessionStorage.removeItem(key);
        return null;
    }
}

/**
 * Cache products for a specific category and page
 */
export function setCachedProducts(categoryId: string, page: number, data: any): void {
    const key = `products_${categoryId}_${page}`;
    const entry: CacheEntry<any> = {
        data,
        timestamp: Date.now(),
    };

    try {
        sessionStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
        // Storage might be full, clear old entries
        clearOldCache();
    }
}

/**
 * Get cached categories
 */
export function getCachedCategories(): any[] | null {
    const cached = sessionStorage.getItem('categories');

    if (!cached) return null;

    try {
        const entry: CacheEntry<any[]> = JSON.parse(cached);

        if (Date.now() - entry.timestamp > CACHE_TTL) {
            sessionStorage.removeItem('categories');
            return null;
        }

        return entry.data;
    } catch {
        sessionStorage.removeItem('categories');
        return null;
    }
}

/**
 * Cache categories
 */
export function setCachedCategories(categories: any[]): void {
    const entry: CacheEntry<any[]> = {
        data: categories,
        timestamp: Date.now(),
    };

    try {
        sessionStorage.setItem('categories', JSON.stringify(entry));
    } catch {
        clearOldCache();
    }
}

/**
 * Clear old cache entries
 */
function clearOldCache(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('products_')) {
            keysToRemove.push(key);
        }
    }

    // Remove oldest half
    keysToRemove.slice(0, Math.ceil(keysToRemove.length / 2)).forEach(key => {
        sessionStorage.removeItem(key);
    });
}

/**
 * Clear all catalogue cache
 */
export function clearCatalogueCache(): void {
    const keysToRemove: string[] = [];

    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith('products_') || key === 'categories') {
            keysToRemove.push(key);
        }
    }

    keysToRemove.forEach(key => sessionStorage.removeItem(key));
}
