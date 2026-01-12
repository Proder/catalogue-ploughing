import { useState } from 'react';

// Simple category info without products (for lightweight listing)
interface CategoryInfo {
    id: string;
    name: string;
}

interface CategoryTabsProps {
    categories: CategoryInfo[];
    activeCategoryId: string;
    onCategoryChange: (categoryId: string) => void;
}

export function CategoryTabs({ categories, activeCategoryId, onCategoryChange }: CategoryTabsProps) {
    const [searchQuery, setSearchQuery] = useState('');

    // Filter categories based on search query
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="card-elevated p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 slide-up">
            {/* Header */}
            <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-secondary-50 flex items-center justify-center">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base sm:text-xl md:text-2xl font-bold text-neutral-900">Browse by Category</h2>
                        <p className="text-xs sm:text-sm text-neutral-500">Select a category to view products</p>
                    </div>
                </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-neutral-50 border-2 border-neutral-200 rounded-xl text-neutral-800 placeholder:text-neutral-400 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all duration-200"
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 transition-colors"
                    >
                        <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            {/* Category Buttons - Scrollable Container */}
            <div className="max-h-[280px] sm:max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                {filteredCategories.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                        <svg className="w-10 h-10 mx-auto mb-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm">No categories found for "{searchQuery}"</p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        {filteredCategories.map((category) => {
                            const isActive = activeCategoryId === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => onCategoryChange(category.id)}
                                    className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 ${isActive
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:shadow-md'
                                        }`}
                                >
                                    {category.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
