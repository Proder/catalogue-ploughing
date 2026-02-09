import type { OrderLineItem } from '../types';
import { useState } from 'react';

interface OrderSummaryProps {
    lineItems: OrderLineItem[];
    total: number;
    isValid: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
    buttonText?: string;
}

export function OrderSummary({
    lineItems,
    total,
    isValid,
    isSubmitting,
    onSubmit,
    buttonText,
}: OrderSummaryProps) {
    const [isOpen, setIsOpen] = useState(false);
    const itemCount = lineItems.length;

    return (
        <>
            {/* Floating Cart Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-full shadow-2xl hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
            >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="text-sm sm:text-base">View Cart</span>
                {itemCount > 0 && (
                    <span className="absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 w-6 h-6 sm:w-7 sm:h-7 bg-accent-400 text-neutral-900 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-lg">
                        {itemCount}
                    </span>
                )}
            </button>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Slide-out Panel */}
            <div className={`fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-neutral-200 bg-neutral-50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Order Summary</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-10 h-10 rounded-xl hover:bg-neutral-200 flex items-center justify-center transition-colors"
                        >
                            <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {/* Summary Details */}
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center py-3 border-b border-neutral-100">
                                <span className="text-sm font-medium text-neutral-600">Selected Items</span>
                                <span className="px-3 py-1 rounded-lg bg-primary-100 text-primary-700 text-sm font-bold">
                                    {itemCount}
                                </span>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="rounded-xl bg-gradient-to-r from-primary-50 to-secondary-50 border-2 border-primary-200 p-4 sm:p-5 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-sm sm:text-base font-semibold text-neutral-700">Total</span>
                                <span className="text-2xl sm:text-3xl font-bold text-primary-600">€{total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Validation Messages */}
                        {!isValid && itemCount === 0 && (
                            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-5">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <span className="font-medium">Please select at least one item</span>
                            </div>
                        )}

                        {!isValid && itemCount > 0 && (
                            <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm mb-5">
                                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
                                </svg>
                                <span className="font-medium">Please complete all required fields</span>
                            </div>
                        )}
                    </div>

                    {/* Footer - Sticky */}
                    <div className="p-6 border-t border-neutral-200 bg-neutral-50">
                        <button
                            onClick={onSubmit}
                            disabled={!isValid || isSubmitting}
                            className={`w-full py-4 rounded-xl text-white font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${isValid && !isSubmitting
                                ? 'btn-primary'
                                : 'bg-neutral-300 cursor-not-allowed'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    {buttonText || 'Submit Order'}
                                </>
                            )}
                        </button>

                        <p className="mt-4 text-center text-xs text-neutral-500 flex items-center justify-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Secure checkout
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
