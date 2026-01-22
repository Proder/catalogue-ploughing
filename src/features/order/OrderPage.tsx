import { useState, useMemo, useEffect } from 'react';
import { HeroSection } from '../../components/HeroSection';
import { UserInfoForm, validateUserInfo } from '../../components/UserInfoForm';
import { CategoryTabs } from '../../components/CategoryTabs';
import { CategoryPanel } from '../../components/CategoryPanel';
import { OrderSummary } from '../../components/OrderSummary';
import { ConfirmationView } from '../../components/ConfirmationView';
import type { UserInfo, OrderLineItem, OrderPayload, ValidationErrors, Product } from '../../types';

import { createOrder, fetchCategories, fetchProductsByCategory, fetchCatalogue, loadOrderByToken, updateOrder } from '../../api/orderClient';



const INITIAL_USER_INFO: UserInfo = {
    name: '',
    email: '',
    company: '',
    phone: '',
};

export function OrderPage() {
    // Edit mode state
    const [editMode, setEditMode] = useState(false);
    const [editOrderId, setEditOrderId] = useState<string | null>(null);
    const [editToken, setEditToken] = useState<string | null>(null);

    // Catalogue state - OPTIMIZED
    const [categories, setCategories] = useState<Array<{ id: string; name: string; sortOrder?: number }>>([]);
    const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({});
    const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null);
    const [isLoadingCatalogue, setIsLoadingCatalogue] = useState(true);
    const [catalogueError, setCatalogueError] = useState<string | null>(null);

    // User information state
    const [userInfo, setUserInfo] = useState<UserInfo>(INITIAL_USER_INFO);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    // Category and product state
    const [activeCategoryId, setActiveCategoryId] = useState<string>('');
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [orderPayload, setOrderPayload] = useState<OrderPayload | null>(null);
    const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);
    const [confirmedEditToken, setConfirmedEditToken] = useState<string | null>(null);

    // Load categories first (lightweight), then products for first category
    useEffect(() => {
        let mounted = true;

        // Load categories only (fast!)
        fetchCategories()
            .then(response => {
                if (!mounted) return;

                if (response.success && response.categories.length > 0) {
                    setCategories(response.categories);
                    if (!editMode) {
                        const firstCategoryId = response.categories[0].id;
                        setActiveCategoryId(firstCategoryId);
                        // Load products for first category immediately
                        loadCategoryProducts(firstCategoryId);
                    }
                    setCatalogueError(null);
                    console.log('Categories loaded:', response.categories.length, 'categories');
                } else {
                    throw new Error('No categories returned from API');
                }
            })
            .catch(error => {
                if (!mounted) return;

                console.warn('Failed to load categories, using fallback:', error);
                setCatalogueError('Using offline catalogue data');

                // Fallback to full catalogue
                fetchCatalogue()
                    .then(response => {
                        if (!mounted) return;
                        if (response.success && response.categories.length > 0) {
                            const cats = response.categories.map(c => ({ id: c.id, name: c.name }));
                            setCategories(cats);

                            // Store all products
                            const productsMap: Record<string, Product[]> = {};
                            response.categories.forEach(cat => {
                                productsMap[cat.id] = cat.products;
                            });
                            setCategoryProducts(productsMap);

                            if (!editMode) {
                                setActiveCategoryId(response.categories[0].id);
                            }
                        }
                    })
                    .catch((fallbackError) => {
                        // No more fallbacks - show error
                        console.error('Failed to load catalogue:', fallbackError);
                        setCatalogueError('Unable to load catalogue. Please check your connection and try again.');
                    });
            })
            .finally(() => {
                if (mounted) {
                    setIsLoadingCatalogue(false);
                }
            });

        return () => { mounted = false; };
    }, [editMode]);

    // Helper function to load products for a specific category (with caching)
    const loadCategoryProducts = async (categoryId: string) => {
        // Check if already loaded
        if (categoryProducts[categoryId]) {
            console.log('Using cached products for category:', categoryId);
            return;
        }

        setLoadingCategoryId(categoryId);
        console.log('Loading products for category:', categoryId);

        try {
            const response = await fetchProductsByCategory(categoryId);
            if (response.success) {
                setCategoryProducts(prev => ({
                    ...prev,
                    [categoryId]: response.products
                }));
                console.log('Loaded', response.products.length, 'products for', response.categoryName);
            }
        } catch (error) {
            console.error('Failed to load products for category:', error);
            setCatalogueError('Failed to load products for this category');
        } finally {
            setLoadingCategoryId(null);
        }
    };

    // Handle category change - load products on demand
    const handleCategoryChange = (categoryId: string) => {
        setActiveCategoryId(categoryId);
        loadCategoryProducts(categoryId);
    };

    // Check for edit mode in URL parameters
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const editTokenParam = urlParams.get('edit');

        if (editTokenParam) {
            setEditMode(true);
            setEditToken(editTokenParam);
            setIsLoadingCatalogue(true);

            loadOrderByToken(editTokenParam)
                .then(async (response) => {
                    if (response.success && response.order) {
                        const order = response.order as OrderPayload & { orderId?: string; editToken?: string };

                        // Pre-fill user info
                        setUserInfo(order.userInfo);

                        // Pre-fill quantities
                        const loadedQuantities: Record<string, number> = {};
                        order.lineItems.forEach(item => {
                            loadedQuantities[item.productId] = item.quantity;
                        });
                        setQuantities(loadedQuantities);

                        // Set order ID
                        if (order.orderId) {
                            setEditOrderId(order.orderId);
                        }

                        // Load products for all categories that have items in the order
                        const categoryIdsWithItems = [...new Set(order.lineItems.map(item => item.categoryId))];
                        console.log('Loading products for', categoryIdsWithItems.length, 'categories with items');

                        // Load products for each category
                        const productLoadPromises = categoryIdsWithItems.map(categoryId =>
                            fetchProductsByCategory(categoryId)
                                .then(res => {
                                    if (res.success) {
                                        return { categoryId, products: res.products };
                                    }
                                    return null;
                                })
                                .catch(() => null)
                        );

                        const loadedProducts = await Promise.all(productLoadPromises);

                        // Build products map
                        const productsMap: Record<string, Product[]> = {};
                        loadedProducts.forEach(result => {
                            if (result) {
                                productsMap[result.categoryId] = result.products;
                            }
                        });
                        setCategoryProducts(productsMap);

                        // Set active category from first line item
                        const firstCategoryId = order.lineItems[0]?.categoryId;
                        if (firstCategoryId) {
                            setActiveCategoryId(firstCategoryId);
                        }

                        console.log('Loaded order for editing:', order.orderId);
                    } else {
                        console.error('Failed to load order:', response.message);
                        setCatalogueError('Failed to load order for editing. Link may be invalid or expired.');
                    }
                })
                .catch(error => {
                    console.error('Error loading order:', error);
                    setCatalogueError('Failed to load order for editing');
                })
                .finally(() => {
                    setIsLoadingCatalogue(false);
                });
        }
    }, []);

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

    // Compute line items from quantities using cached products
    const lineItems: OrderLineItem[] = useMemo(() => {
        const items: OrderLineItem[] = [];

        categories.forEach((category) => {
            const products = categoryProducts[category.id] || [];
            products.forEach((product: Product) => {
                const quantity = quantities[product.id] || 0;
                if (quantity > 0) {
                    items.push({
                        categoryId: category.id,
                        categoryName: category.name,
                        productId: product.id,
                        productName: product.name,
                        unitPrice: product.pricing2025,
                        quantity,
                        lineTotal: quantity * product.pricing2025,
                        size: product.size,
                        supplier: product.supplier,
                    });
                }
            });
        });

        return items;
    }, [quantities, categories, categoryProducts]);

    // Compute total
    const total = useMemo(() => {
        return lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
    }, [lineItems]);

    // Check if form is valid
    const isFormValid = useMemo(() => {
        const errors = validateUserInfo(userInfo);
        const hasNoErrors = Object.keys(errors).length === 0;
        const hasItems = lineItems.length > 0;

        return hasNoErrors && hasItems;
    }, [userInfo, lineItems]);

    // Handle order submission (create or update)
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
                total,
            },
            timestamp: new Date().toISOString(),
        };

        try {
            let response;

            // Use updateOrder if in edit mode, otherwise createOrder
            if (editMode && editOrderId) {
                console.log('Updating existing order:', editOrderId);
                response = await updateOrder(editOrderId, payload, editToken || undefined);
            } else {
                console.log('Creating new order');
                response = await createOrder(payload);
            }

            if (response.success) {
                setOrderPayload(payload);
                // Store the orderId and editToken from the response
                if (response.orderId) {
                    setConfirmedOrderId(response.orderId);
                }
                if (response.editToken) {
                    setConfirmedEditToken(response.editToken);
                }
                setIsConfirmed(true);

                // Clear URL parameters after successful submit
                if (editMode) {
                    window.history.replaceState({}, '', window.location.pathname);
                }
            }
        } catch (error) {
            console.error('Error submitting order:', error);
            // You could add error state here to show to the user
        } finally {
            setIsSubmitting(false);
        }
    };

    // Reset form for new order
    const handleCreateAnother = () => {
        setUserInfo(INITIAL_USER_INFO);
        setValidationErrors({});
        setActiveCategoryId(categories[0]?.id || '');
        setQuantities({});
        setIsConfirmed(false);
        setOrderPayload(null);
        setConfirmedOrderId(null);
        setConfirmedEditToken(null);
        setEditMode(false);
        setEditOrderId(null);
        setEditToken(null);
    };

    // Get active category with its products
    const activeCategory = useMemo(() => {
        const cat = categories.find((c) => c.id === activeCategoryId);
        if (!cat) return null;
        return {
            ...cat,
            products: categoryProducts[cat.id] || []
        };
    }, [categories, activeCategoryId, categoryProducts]);

    // Show confirmation view after successful submission
    if (isConfirmed && orderPayload) {
        return (
            <ConfirmationView
                orderPayload={orderPayload}
                orderId={confirmedOrderId}
                editToken={confirmedEditToken}
                onCreateAnother={handleCreateAnother}
            />
        );
    }

    // Show loading state while catalogue is being fetched - but still show UserInfoForm
    if (isLoadingCatalogue) {
        return (
            <div className="order-page">
                <HeroSection />

                {/* User info form is always visible - no backend needed */}
                <UserInfoForm
                    userInfo={userInfo}
                    validationErrors={validationErrors}
                    onChange={handleUserInfoChange}
                />

                {/* Loading indicator for catalogue */}
                <div className="card-elevated p-6 sm:p-8 mb-6 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-1">
                                {editMode ? 'Loading your order...' : 'Loading catalogue...'}
                            </h3>
                            <p className="text-sm sm:text-base text-neutral-500">
                                {editMode ? 'Please wait while we fetch your order details' : 'Fill in your details while we load the products'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main order form
    return (
        <div className="order-page">
            <HeroSection />

            {editMode && (
                <div style={{
                    padding: '1rem',
                    background: '#E6F7FF',
                    border: '1px solid #91D5FF',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    color: '#0050B3',
                    textAlign: 'center',
                    fontWeight: 500
                }}>
                    Edit Mode: You're updating order #{editOrderId}
                </div>
            )}

            {catalogueError && (
                <div className="card-elevated p-6 sm:p-8 mb-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">
                        {categories.length === 0 ? 'Unable to Load Catalogue' : 'Connection Issue'}
                    </h3>
                    <p className="text-sm sm:text-base text-neutral-600 mb-4">
                        {catalogueError}
                    </p>
                    {categories.length === 0 && (
                        <button
                            onClick={() => window.location.reload()}
                            className="btn-primary"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Try Again
                        </button>
                    )}
                </div>
            )}

            <UserInfoForm
                userInfo={userInfo}
                validationErrors={validationErrors}
                onChange={handleUserInfoChange}
            />

            <CategoryTabs
                categories={categories}
                activeCategoryId={activeCategoryId}
                onCategoryChange={handleCategoryChange}
            />

            {/* Loading indicator for category products */}
            {loadingCategoryId && (
                <div className="card-elevated p-8 mb-8 text-center">
                    <div className="inline-flex items-center gap-3">
                        <div className="w-6 h-6 border-3 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-neutral-600">Loading products...</span>
                    </div>
                </div>
            )}

            {activeCategory && !loadingCategoryId && (
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
                        total={total}
                        isValid={isFormValid}
                        isSubmitting={isSubmitting}
                        onSubmit={handleSubmit}
                    />
                </div>
            </div>
        </div>
    );
}
