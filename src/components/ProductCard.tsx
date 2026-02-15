import { useState } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    quantity: number;
    onQuantityChange: (productId: string, quantity: number) => void;
}

export function ProductCard({ product, quantity, onQuantityChange }: ProductCardProps) {
    const lineTotal = quantity * product.pricing2025;
    const isSelected = quantity > 0;
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleIncrement = () => {
        onQuantityChange(product.id, quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 0) {
            onQuantityChange(product.id, quantity - 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 0) {
            onQuantityChange(product.id, value);
        } else if (e.target.value === '') {
            onQuantityChange(product.id, 0);
        }
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    return (
        <div className={`group relative flex flex-col rounded-xl sm:rounded-2xl border-2 transition-all duration-200 overflow-hidden ${isSelected
            ? 'bg-primary-50/50 border-primary-300 shadow-lg shadow-primary-500/10'
            : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
            }`}>
            {/* Selected Badge */}
            {isSelected && (
                <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 z-10 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}

            {/* Product Image - More compact for mobile */}
            <div className="relative w-full bg-neutral-100 aspect-[3/2] sm:aspect-[4/3] overflow-hidden">
                <div className="absolute top-2 right-2 z-10 px-1.5 sm:px-2.5 py-1 rounded-md sm:rounded-lg bg-primary-500 text-white font-bold text-[10px] sm:text-xs shadow-sm">
                    €{product.pricing2025.toFixed(2)}
                </div>
                {product.imageUrl && !imageError ? (
                    <>
                        {imageLoading && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-6 h-6 sm:w-8 sm:h-8 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        <img
                            src={product.imageUrl}
                            alt={product.name}
                            className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'
                                }`}
                            onLoad={handleImageLoad}
                            onError={handleImageError}
                            loading="lazy"
                        />
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
                        <svg className="w-10 h-10 sm:w-16 sm:h-16 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Product Info - Compact spacing for mobile */}
            <div className="p-2.5 sm:p-4 md:p-6 flex-1 flex flex-col">
                <div className="mb-2 sm:mb-4">
                    <div className="mb-1 sm:mb-3">
                        <h3 className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 leading-tight">
                            {product.name}
                        </h3>
                    </div>

                    <p className="text-[10px] sm:text-xs text-neutral-600 leading-relaxed line-clamp-2 sm:block">
                        {product.description}
                    </p>
                </div>

                {/* Quantity Controls - Compact for mobile */}
                <div className="space-y-2 sm:space-y-4 mt-auto">
                    <div className="flex items-center justify-center gap-1.5 sm:gap-3">
                        <button
                            onClick={handleDecrement}
                            disabled={quantity === 0}
                            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold transition-all ${quantity === 0
                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                : 'bg-neutral-100 text-neutral-700 hover:bg-primary-500 hover:text-white active:scale-95'
                                }`}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>

                        <input
                            type="number"
                            value={quantity}
                            onChange={handleInputChange}
                            min="0"
                            className="w-14 sm:w-20 md:w-24 h-8 sm:h-10 md:h-12 px-1.5 sm:px-3 rounded-lg sm:rounded-xl border-2 border-neutral-200 bg-white text-center text-base sm:text-lg md:text-xl font-bold text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-2 sm:focus:ring-4 focus:ring-primary-500/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            aria-label="Quantity"
                        />

                        <button
                            onClick={handleIncrement}
                            className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold hover:bg-primary-600 active:scale-95 transition-all shadow-lg shadow-primary-500/25"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    {/* Line Total */}
                    {isSelected && (
                        <div className="flex items-center justify-between px-2 sm:px-3 md:px-4 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-400/10 border border-primary-200">
                            <span className="text-[10px] sm:text-xs font-semibold text-neutral-700">Total</span>
                            <span className="text-sm sm:text-base md:text-xl font-bold text-primary-600">€{lineTotal.toFixed(2)}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
