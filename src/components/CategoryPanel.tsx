import type { Category } from '../types';
import { ProductCard } from './ProductCard';
import './CategoryPanel.css';

interface CategoryPanelProps {
    category: Category;
    quantities: Record<string, number>;
    onQuantityChange: (productId: string, quantity: number) => void;
}

export function CategoryPanel({ category, quantities, onQuantityChange }: CategoryPanelProps) {
    return (
        <section className="category-panel">
            <h3 className="panel-title">{category.name}</h3>
            <div className="products-grid">
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
