import type { OrderPayload } from '../types';

interface ConfirmationViewProps {
    orderPayload: OrderPayload;
    onCreateAnother: () => void;
}

export function ConfirmationView({ orderPayload, onCreateAnother }: ConfirmationViewProps) {
    return (
        <div className="max-w-4xl mx-auto fade-in">
            {/* Success Header */}
            <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-success-400 to-success-600 text-white text-4xl sm:text-5xl mb-4 sm:mb-6 shadow-xl scale-in">
                    ✓
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-2 sm:mb-3 px-4">Order Submitted Successfully!</h2>
                <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto px-4">
                    Thank you for your order. We've received your request and will process it shortly.
                </p>
            </div>

            {/* Customer Info */}
            <div className="card-elevated p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Customer Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="p-5 rounded-xl bg-neutral-50">
                        <span className="text-sm font-medium text-neutral-500">Name</span>
                        <p className="text-base font-bold text-neutral-900 mt-1">{orderPayload.userInfo.name}</p>
                    </div>
                    <div className="p-5 rounded-xl bg-neutral-50">
                        <span className="text-sm font-medium text-neutral-500">Email</span>
                        <p className="text-base font-bold text-neutral-900 mt-1">{orderPayload.userInfo.email}</p>
                    </div>
                    {orderPayload.userInfo.company && (
                        <div className="p-5 rounded-xl bg-neutral-50">
                            <span className="text-sm font-medium text-neutral-500">Company</span>
                            <p className="text-base font-bold text-neutral-900 mt-1">{orderPayload.userInfo.company}</p>
                        </div>
                    )}
                    {orderPayload.userInfo.phone && (
                        <div className="p-5 rounded-xl bg-neutral-50">
                            <span className="text-sm font-medium text-neutral-500">Phone</span>
                            <p className="text-base font-bold text-neutral-900 mt-1">{orderPayload.userInfo.phone}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Items */}
            <div className="card-elevated p-8 mb-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center">
                        <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4" />
                        </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900">Order Items</h3>
                </div>
                <div className="space-y-3">
                    {orderPayload.lineItems.map((item) => (
                        <div
                            key={item.productId}
                            className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-xl bg-neutral-50 items-center"
                        >
                            <div className="col-span-2">
                                <p className="font-bold text-neutral-900">{item.productName}</p>
                            </div>
                            <div className="text-neutral-700">
                                <span className="text-sm font-medium">Price:</span>
                                <p className="font-semibold">€{item.unitPrice.toFixed(2)}</p>
                            </div>
                            <div className="text-neutral-700">
                                <span className="text-sm font-medium">Qty:</span>
                                <p className="font-semibold">{item.quantity}</p>
                            </div>
                            <div className="text-right col-span-2 md:col-span-4 mt-2 pt-2 border-t border-neutral-200">
                                <span className="text-sm font-medium text-neutral-600">Total: </span>
                                <span className="text-lg font-bold text-primary-600">€{item.lineTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Order Totals */}
            <div className="card-elevated p-8 mb-10">
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-6">Order Totals</h3>
                <div className="max-w-sm ml-auto space-y-4">
                    <div className="flex justify-between py-3 border-b border-neutral-100">
                        <span className="text-neutral-600">Subtotal</span>
                        <span className="font-bold text-neutral-900">€{orderPayload.totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-neutral-100">
                        <span className="text-neutral-600">Tax ({(orderPayload.totals.taxRate * 100).toFixed(0)}%)</span>
                        <span className="font-bold text-neutral-900">€{orderPayload.totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-4 border-t-2 border-neutral-200">
                        <span className="text-lg font-bold text-neutral-900">Grand Total</span>
                        <span className="text-2xl font-bold text-primary-600">€{orderPayload.totals.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Action Button */}
            <div className="text-center">
                <button onClick={onCreateAnother} className="btn-primary px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Another Order
                </button>
            </div>
        </div>
    );
}
