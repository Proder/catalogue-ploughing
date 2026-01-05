import type { OrderLineItem } from '../types';
import './OrderSummary.css';

interface OrderSummaryProps {
    lineItems: OrderLineItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    grandTotal: number;
    isValid: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export function OrderSummary({
    lineItems,
    subtotal,
    taxRate,
    taxAmount,
    grandTotal,
    isValid,
    isSubmitting,
    onSubmit,
}: OrderSummaryProps) {
    const itemCount = lineItems.length;

    return (
        <aside className="order-summary">
            <h3 className="summary-title">Order Summary</h3>

            <div className="summary-section">
                <div className="summary-row">
                    <span className="summary-label">Selected Items:</span>
                    <span className="summary-value">{itemCount}</span>
                </div>
                <div className="summary-row">
                    <span className="summary-label">Subtotal:</span>
                    <span className="summary-value">${subtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                    <span className="summary-label">Tax ({(taxRate * 100).toFixed(0)}%):</span>
                    <span className="summary-value">${taxAmount.toFixed(2)}</span>
                </div>
            </div>

            <div className="summary-total">
                <span className="total-label">Grand Total:</span>
                <span className="total-value">${grandTotal.toFixed(2)}</span>
            </div>

            {!isValid && itemCount === 0 && (
                <p className="validation-hint">Please select at least one item</p>
            )}

            {!isValid && itemCount > 0 && (
                <p className="validation-hint">Please complete all required fields</p>
            )}

            <button
                className="submit-button"
                onClick={onSubmit}
                disabled={!isValid || isSubmitting}
            >
                {isSubmitting ? 'Processing...' : 'Submit Order'}
            </button>
        </aside>
    );
}
