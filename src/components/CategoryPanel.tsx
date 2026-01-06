import type { Category, Product } from '../types';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './LoadingSkeleton';

interface CategoryPanelProps {
    category: Category;
    products?: Product[];
    quantities: Record<string, number>;
    onQuantityChange: (productId: string, quantity: number) => void;
    isLoading?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
    isLoadingMore?: boolean;
}

export function CategoryPanel({
    category,
    products,
    quantities,
    onQuantityChange,
    isLoading = false,
    hasMore = false,
    onLoadMore,
    isLoadingMore = false,
}: CategoryPanelProps) {
    // Use products prop if provided, otherwise fall back to category.products
    const displayProducts = products || category.products || [];

    return (
        <section className="card-elevated p-8 mb-10 slide-up">
            {/* Header - No product count */}
            <div className="mb-8 pb-6 border-b-2 border-neutral-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">{category.name}</h2>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
                <ProductSkeleton count={6} />
            ) : displayProducts.length === 0 ? (
                <div className="text-center py-12 text-neutral-500">
                    <svg className="w-12 h-12 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p>No products in this category</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {displayProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                quantity={quantities[product.id] || 0}
                                onQuantityChange={onQuantityChange}
                            />
                        ))}
                    </div>

                    {/* Load More Button */}
                    {hasMore && onLoadMore && (
                        <div className="flex justify-center mt-8">
                            <button
                                onClick={onLoadMore}
                                disabled={isLoadingMore}
                                className="btn-secondary px-8 py-3"
                            >
                                {isLoadingMore ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Loading...
                                    </span>
                                ) : (
                                    'Load More Products'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}
