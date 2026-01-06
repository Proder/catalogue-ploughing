import type { Product } from '../types';

interface ProductCardProps {
    product: Product;
    quantity: number;
    onQuantityChange: (productId: string, quantity: number) => void;
}

export function ProductCard({ product, quantity, onQuantityChange }: ProductCardProps) {
    const lineTotal = quantity * product.unitPrice;
    const isSelected = quantity > 0;

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

    return (
        <div className={`group relative p-6 rounded-2xl border-2 transition-all duration-200 ${isSelected
                ? 'bg-primary-50/50 border-primary-300 shadow-lg shadow-primary-500/10'
                : 'bg-white border-neutral-200 hover:border-neutral-300 hover:shadow-md'
            }`}>
            {/* Selected Badge */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center shadow-lg">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}

            {/* Product Info */}
            <div className="mb-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-neutral-900 leading-tight flex-1">
                        {product.name}
                    </h3>
                    <div className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-primary-500 text-white font-bold text-sm shadow-sm">
                        ${product.unitPrice.toFixed(2)}
                    </div>
                </div>

                <p className="text-sm text-neutral-600 leading-relaxed mb-4">
                    {product.description}
                </p>

                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Size: {product.size}
                </div>
            </div>

            {/* Quantity Controls */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleDecrement}
                        disabled={quantity === 0}
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${quantity === 0
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
                        className="flex-1 h-11 px-4 rounded-xl border-2 border-neutral-200 bg-white text-center text-base font-bold text-neutral-900 focus:outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        aria-label="Quantity"
                    />

                    <button
                        onClick={handleIncrement}
                        className="w-11 h-11 rounded-xl bg-primary-500 text-white flex items-center justify-center text-lg font-bold hover:bg-primary-600 active:scale-95 transition-all shadow-lg shadow-primary-500/25"
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                {/* Line Total */}
                {isSelected && (
                    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-400/10 border border-primary-200">
                        <span className="text-sm font-semibold text-neutral-700">Line Total</span>
                        <span className="text-xl font-bold text-primary-600">${lineTotal.toFixed(2)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
