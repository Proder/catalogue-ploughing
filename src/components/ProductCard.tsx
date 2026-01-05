import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
    product: Product;
    quantity: number;
    onQuantityChange: (productId: string, quantity: number) => void;
}

export function ProductCard({ product, quantity, onQuantityChange }: ProductCardProps) {
    const lineTotal = quantity * product.unitPrice;

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
        <div className={`product-card ${quantity > 0 ? 'selected' : ''}`}>
            <div className="product-info">
                <h4 className="product-name">{product.name}</h4>
                <p className="product-description">{product.description}</p>
                <div className="product-details">
                    <span className="product-size">Size: {product.size}</span>
                    <span className="product-price">${product.unitPrice.toFixed(2)}</span>
                </div>
            </div>

            <div className="product-controls">
                <div className="quantity-control">
                    <button
                        className="qty-btn"
                        onClick={handleDecrement}
                        disabled={quantity === 0}
                        aria-label="Decrease quantity"
                    >
                        −
                    </button>
                    <input
                        type="number"
                        className="qty-input"
                        value={quantity}
                        onChange={handleInputChange}
                        min="0"
                        aria-label="Quantity"
                    />
                    <button
                        className="qty-btn"
                        onClick={handleIncrement}
                        aria-label="Increase quantity"
                    >
                        +
                    </button>
                </div>

                {quantity > 0 && (
                    <div className="line-total">
                        Line Total: <strong>${lineTotal.toFixed(2)}</strong>
                    </div>
                )}
            </div>
        </div>
    );
}
