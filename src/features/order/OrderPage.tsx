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

const TAX_RATE = 0.18;

const INITIAL_USER_INFO: UserInfo = {
    name: '',
    email: '',
    company: '',
    phone: '',
};

export function OrderPage() {
    const [userInfo, setUserInfo] = useState<UserInfo>(INITIAL_USER_INFO);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
    const [activeCategoryId, setActiveCategoryId] = useState<string>(MOCK_CATEGORIES[0].id);
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [orderPayload, setOrderPayload] = useState<OrderPayload | null>(null);

    const handleUserInfoChange = (field: keyof UserInfo, value: string) => {
        setUserInfo((prev) => ({ ...prev, [field]: value }));
        const updatedUserInfo = { ...userInfo, [field]: value };
        const errors = validateUserInfo(updatedUserInfo);
        setValidationErrors(errors);
    };

    const handleQuantityChange = (productId: string, quantity: number) => {
        setQuantities((prev) => ({ ...prev, [productId]: quantity }));
    };

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

    const { subtotal, taxAmount, grandTotal } = useMemo(() => {
        const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
        const taxAmount = subtotal * TAX_RATE;
        const grandTotal = subtotal + taxAmount;
        return { subtotal, taxAmount, grandTotal };
    }, [lineItems]);

    const isFormValid = useMemo(() => {
        const errors = validateUserInfo(userInfo);
        const hasNoErrors = Object.keys(errors).length === 0;
        const hasItems = lineItems.length > 0;
        return hasNoErrors && hasItems;
    }, [userInfo, lineItems]);

    const handleSubmit = async () => {
        const errors = validateUserInfo(userInfo);
        if (Object.keys(errors).length > 0 || lineItems.length === 0) {
            setValidationErrors(errors);
            return;
        }
        setIsSubmitting(true);
        const payload: OrderPayload = {
            userInfo,
            lineItems,
            totals: { subtotal, taxRate: TAX_RATE, taxAmount, grandTotal },
            timestamp: new Date().toISOString(),
        };
        try {
            const response = await createOrder(payload);
            if (response.success) {
                setOrderPayload(payload);
                setIsConfirmed(true);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCreateAnother = () => {
        setUserInfo(INITIAL_USER_INFO);
        setValidationErrors({});
        setActiveCategoryId(MOCK_CATEGORIES[0].id);
        setQuantities({});
        setIsConfirmed(false);
        setOrderPayload(null);
    };

    const activeCategory = MOCK_CATEGORIES.find((cat) => cat.id === activeCategoryId);

    if (isConfirmed && orderPayload) {
        return <ConfirmationView orderPayload={orderPayload} onCreateAnother={handleCreateAnother} />;
    }

    return (
        <div className="pb-24">
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

            {/* Floating Order Summary */}
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
    );
}
