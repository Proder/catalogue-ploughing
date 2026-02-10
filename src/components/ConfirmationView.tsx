import type { OrderPayload } from '../types';

interface ConfirmationViewProps {
    orderPayload: OrderPayload;
    orderId: string | null;
    editToken: string | null;
    onCreateAnother: () => void;
}

export function ConfirmationView({ orderPayload, orderId, editToken, onCreateAnother }: ConfirmationViewProps) {
    const editUrl = editToken ? `${window.location.origin}${window.location.pathname}?edit=${editToken}` : null;
    const isSameRequirements = orderPayload.userInfo.sameRequirements === true;

    return (
        <div className="max-w-4xl mx-auto fade-in">
            {/* Success Header */}
            <div className="text-center mb-8 sm:mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-success-400 to-success-600 text-white mb-4 sm:mb-6 shadow-xl scale-in">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 mb-2 sm:mb-3 px-4">
                    {isSameRequirements ? 'Submission Confirmed' : 'Order Submitted Successfully!'}
                </h2>
                <p className="text-base sm:text-lg text-neutral-600 max-w-xl mx-auto px-4">
                    {isSameRequirements
                        ? 'Thank you for your submission. Your requirements from last year will be carried forward.'
                        : "Thank you for your order. We've received your request and will process it shortly."}
                </p>
                {orderId && (
                    <p className="text-sm sm:text-base text-neutral-500 mt-2 px-4">
                        Reference: <span className="font-mono font-semibold text-primary-600">{orderId}</span>
                    </p>
                )}
            </div>

            {/* Same Requirements Banner */}
            {isSameRequirements && (
                <div className="card-elevated p-6 mb-8 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">Same Requirements as Last Year</h3>
                            <p className="text-sm text-neutral-600">
                                Your stand setup and specifications from the previous year will be carried forward.
                                No further action is required from you. If you need to make any changes, please contact us directly.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* View Link */}
            {editUrl && (
                <div className="card-elevated p-6 mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-neutral-900 mb-2">View Your Submission</h3>
                            <p className="text-sm text-neutral-600 mb-4">
                                You can view your submission details anytime using this link. Save it for your records!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={editUrl}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-all shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    View Your Submission
                                </a>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(editUrl);
                                        alert('Link copied to clipboard!');
                                    }}
                                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-neutral-50 text-neutral-700 font-semibold border-2 border-neutral-200 transition-all"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

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
                    {orderPayload.userInfo.department && (
                        <div className="p-5 rounded-xl bg-neutral-50">
                            <span className="text-sm font-medium text-neutral-500">Department</span>
                            <p className="text-base font-bold text-neutral-900 mt-1">{orderPayload.userInfo.department}</p>
                        </div>
                    )}
                    {orderPayload.userInfo.hub && (
                        <div className="p-5 rounded-xl bg-neutral-50">
                            <span className="text-sm font-medium text-neutral-500">Hub</span>
                            <p className="text-base font-bold text-neutral-900 mt-1">{orderPayload.userInfo.hub}</p>
                        </div>
                    )}
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

            {/* Order Items - Only show if not same requirements and has items */}
            {!isSameRequirements && orderPayload.lineItems.length > 0 && (
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
                                    <p className="font-semibold">{'\u20AC'}{item.unitPrice.toFixed(2)}</p>
                                </div>
                                <div className="text-neutral-700">
                                    <span className="text-sm font-medium">Qty:</span>
                                    <p className="font-semibold">{item.quantity}</p>
                                </div>
                                <div className="text-right col-span-2 md:col-span-4 mt-2 pt-2 border-t border-neutral-200">
                                    <span className="text-sm font-medium text-neutral-600">Total: </span>
                                    <span className="text-lg font-bold text-primary-600">{'\u20AC'}{item.lineTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Order Total - Only show if not same requirements and has items */}
            {!isSameRequirements && orderPayload.lineItems.length > 0 && (
                <div className="card-elevated p-8 mb-10">
                    <div className="max-w-sm ml-auto">
                        <div className="flex justify-between py-4">
                            <span className="text-lg font-bold text-neutral-900">Total</span>
                            <span className="text-2xl font-bold text-primary-600">{'\u20AC'}{orderPayload.totals.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            )}

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
