import { useState, useMemo } from 'react';
import { HeroSection } from '../../components/HeroSection';
import { UserInfoForm, validateUserInfo } from '../../components/UserInfoForm';
import { CategoryTabs } from '../../components/CategoryTabs';
import { CategoryPanel } from '../../components/CategoryPanel';
import { OrderSummary } from '../../components/OrderSummary';
import { ConfirmationView } from '../../components/ConfirmationView';
import type { UserInfo, OrderLineItem, OrderPayload, ValidationErrors } from '../../types';
import { MOCK_CATEGORIES } from '../../data/mockCatalogue';
import { createOrder } from '../../api/orderClient';
import './OrderPage.css';

const TAX_RATE = 0.18; // 18%

const INITIAL_USER_INFO: UserInfo = {
    name: '',
    email: '',
    company: '',
    phone: '',
};

export function OrderPage() {
    // User information state
    const [userInfo, setUserInfo] = useState<UserInfo>(INITIAL_USER_INFO);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // Category and product state
    const [activeCategoryId, setActiveCategoryId] = useState<string>(MOCK_CATEGORIES[0].id);
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [orderPayload, setOrderPayload] = useState<OrderPayload | null>(null);

    // Handle user info changes
    const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
        setUserInfo((prev) => ({ ...prev, [field]: value }));

        // Validate on change
        const updatedUserInfo = { ...userInfo, [field]: value };
        const errors = validateUserInfo(updatedUserInfo);
        setValidationErrors(errors);
    };

    // Handle quantity changes
    const handleQuantityChange = (productId: string, quantity: number) => {
        setQuantities((prev) => ({
            ...prev,
            [productId]: quantity,
        }));
    };

    // Compute line items from quantities
    const lineItems: OrderLineItem[] = useMemo(() => {
        const items: OrderLineItem[] = [];

        MOCK_CATEGORIES.forEach((category) => {
            category.products.forEach((product) => {
                const quantity = quantities[product.id] || 0;
                if (quantity > 0) {
                    items.push({
                        categoryId: category.id,
                        categoryName: category.name,
                        productId: product.id,
                        productName: product.name,
                        size: product.size,
                        unitPrice: product.unitPrice,
                        quantity,
                        lineTotal: quantity * product.unitPrice,
                    });
                }
            });
        });

        return items;
    }, [quantities]);

    // Compute totals
    const { subtotal, taxAmount, grandTotal } = useMemo(() => {
        const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
        const taxAmount = subtotal * TAX_RATE;
        const grandTotal = subtotal + taxAmount;

        return { subtotal, taxAmount, grandTotal };
    }, [lineItems]);

    // Check if form is valid
    const isFormValid = useMemo(() => {
        const errors = validateUserInfo(userInfo);
        const hasNoErrors = Object.keys(errors).length === 0;
        const hasItems = lineItems.length > 0;

        return hasNoErrors && hasItems;
    }, [userInfo, lineItems]);

    // Handle order submission
    const handleSubmit = async () => {
        // Final validation
        const errors = validateUserInfo(userInfo);
        if (Object.keys(errors).length > 0 || lineItems.length === 0) {
            setValidationErrors(errors);
            return;
        }

        setIsSubmitting(true);

        // Build order payload
        const payload: OrderPayload = {
            userInfo,
            lineItems,
            totals: {
                subtotal,
                taxRate: TAX_RATE,
                taxAmount,
                grandTotal,
            },
            timestamp: new Date().toISOString(),
        };

        try {
            // Call stubbed API
            const response = await createOrder(payload);

            if (response.success) {
                setOrderPayload(payload);
                setIsConfirmed(true);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            // In production, show error message to user
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form for new order
    const handleCreateAnother = () => {
        setUserInfo(INITIAL_USER_INFO);
        setValidationErrors({});
        setActiveCategoryId(MOCK_CATEGORIES[0].id);
        setQuantities({});
        setIsConfirmed(false);
        setOrderPayload(null);
    };

    // Get active category
    const activeCategory = MOCK_CATEGORIES.find((cat) => cat.id === activeCategoryId);

    // Show confirmation view after successful submission
    if (isConfirmed && orderPayload) {
        return <ConfirmationView orderPayload={orderPayload} onCreateAnother={handleCreateAnother} />;
    }

    // Main order form
    return (
        <div className="order-page">
            <HeroSection />

            <UserInfoForm
                userInfo={userInfo}
                validationErrors={validationErrors}
                onChange={handleUserInfoChange}
            />

            <CategoryTabs
                categories={MOCK_CATEGORIES}
                activeCategoryId={activeCategoryId}
                onCategoryChange={setActiveCategoryId}
            />

            {activeCategory && (
                <CategoryPanel
                    category={activeCategory}
                    quantities={quantities}
                    onQuantityChange={handleQuantityChange}
                />
            )}

            <div className="order-layout">
                <div className="order-content">
                    {/* Additional content can go here if needed */}
                </div>
                <div className="order-sidebar">
                    <OrderSummary
                        lineItems={lineItems}
                        subtotal={subtotal}
                        taxRate={TAX_RATE}
                        taxAmount={taxAmount}
                        grandTotal={grandTotal}
                        isValid={isFormValid}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
