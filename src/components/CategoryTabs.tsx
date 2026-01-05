import type { Category } from '../types';
import './CategoryTabs.css';

interface CategoryTabsProps {
    categories: Category[];
    activeCategoryId: string;
    onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategoryId, onCategoryChange }: CategoryTabsProps) {
    return (
        <section className="categories-section">
            <h3 className="section-title">Browse Products by Category</h3>
            <div className="category-tabs">
                {categories.map((category) => (
                    <button
                        key={category.id}
                        className={`category-tab ${activeCategoryId === category.id ? 'active' : ''}`}
                        onClick={() => onCategoryChange(category.id)}
                    >
                        {category.name}
                    </button>
                ))}
            </div>
        </section>
    );
}
