import type { Category } from '../types';

interface CategoryTabsProps {
    categories: Category[];
    activeCategoryId: string;
    onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategoryId, onCategoryChange }: CategoryTabsProps) {
    return (
        <section className="card-elevated p-6 sm:p-8 mb-8 sm:mb-10 slide-up">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="section-title">Browse by Category</h2>
                        <p className="section-subtitle text-sm">Select a category to view products</p>
                    </div>
                </div>
            </div>

            {/* Category Buttons - No product counts */}
            <div className="flex flex-wrap gap-3">
                {categories.map((category) => {
                    const isActive = activeCategoryId === category.id;
                    return (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={`px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${isActive
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:shadow-md'
                                }`}
                        >
                            {category.name}
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
