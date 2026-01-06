import type { Category } from '../types';
import { ProductCard } from './ProductCard';

interface CategoryPanelProps {
    category: Category;
    quantities: Record<string, number>;
    onQuantityChange: (productId: string, quantity: number) => void;
}

export function CategoryPanel({ category, quantities, onQuantityChange }: CategoryPanelProps) {
    return (
        <section className="card-elevated p-8 mb-10 slide-up">
            {/* Header */}
            <div className="mb-8 pb-6 border-b-2 border-neutral-100">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary-400 to-secondary-500 flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-neutral-900">{category.name}</h2>
                        <p className="text-sm text-neutral-500 mt-0.5">
                            {category.products.length} product{category.products.length !== 1 ? 's' : ''} available
                        </p>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {category.products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        quantity={quantities[product.id] || 0}
                        onQuantityChange={onQuantityChange}
                    />
                ))}
            </div>
        </section>
    );
}
