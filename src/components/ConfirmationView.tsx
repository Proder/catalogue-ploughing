import type { OrderPayload } from '../types';
import './ConfirmationView.css';

interface ConfirmationViewProps {
    orderPayload: OrderPayload;
    onCreateAnother: () => void;
}

export function ConfirmationView({ orderPayload, onCreateAnother }: ConfirmationViewProps) {
    return (
        <div className="confirmation-view">
            <div className="confirmation-header">
                <div className="success-icon">✓</div>
                <h2 className="confirmation-title">Order Submitted Successfully!</h2>
                <p className="confirmation-message">
                    Thank you for your order. We've received your request and will process it shortly.
                </p>
            </div>

            <div className="confirmation-section">
                <h3 className="section-heading">Customer Information</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{orderPayload.userInfo.name}</span>
                    </div>
                    <div className="info-item">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{orderPayload.userInfo.email}</span>
                    </div>
                    {orderPayload.userInfo.company && (
                        <div className="info-item">
                            <span className="info-label">Company:</span>
                            <span className="info-value">{orderPayload.userInfo.company}</span>
                        </div>
                    )}
                    {orderPayload.userInfo.phone && (
                        <div className="info-item">
                            <span className="info-label">Phone:</span>
                            <span className="info-value">{orderPayload.userInfo.phone}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="confirmation-section">
                <h3 className="section-heading">Order Items</h3>
                <div className="items-table">
                    <div className="table-header">
                        <span>Product</span>
                        <span>Size</span>
                        <span>Price</span>
                        <span>Qty</span>
                        <span>Total</span>
                    </div>
                    {orderPayload.lineItems.map((item) => (
                        <div key={item.productId} className="table-row">
                            <span className="item-name">{item.productName}</span>
                            <span>{item.size}</span>
                            <span>${item.unitPrice.toFixed(2)}</span>
                            <span>{item.quantity}</span>
                            <span className="item-total">${item.lineTotal.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="confirmation-section">
                <h3 className="section-heading">Order Totals</h3>
                <div className="totals-summary">
                    <div className="totals-row">
                        <span>Subtotal:</span>
                        <span>${orderPayload.totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="totals-row">
                        <span>Tax ({(orderPayload.totals.taxRate * 100).toFixed(0)}%):</span>
                        <span>${orderPayload.totals.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="totals-row grand-total">
                        <span>Grand Total:</span>
                        <span>${orderPayload.totals.grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div className="confirmation-actions">
                <button className="create-another-btn" onClick={onCreateAnother}>
                    Create Another Order
                </button>
            </div>
        </div>
    );
}
