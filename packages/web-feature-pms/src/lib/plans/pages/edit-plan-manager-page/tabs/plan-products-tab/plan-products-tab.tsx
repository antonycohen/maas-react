import { useGetProductById, useGetProducts } from '@maas/core-api';
import { Button } from '@maas/web-components';
import { IconPlus } from '@tabler/icons-react';
import { useOutletContext } from 'react-router';
import { ProductPreview, ProductsList } from './components';
import { AddProductToPlanModal } from './modals';
import { EditPlanOutletContext } from '../../edit-plan-manager-page';
import { Product } from '@maas/core-api-models';
import { useMemo } from 'react';
import { useTranslation } from '@maas/core-translations';

export const PlanProductsTab = () => {
    const { t } = useTranslation();
    const {
        planId,
        isCreateMode,
        isLoading: isLoadingPlan,
        selectedProductId,
        setSelectedProductId,
        addProductModalOpen,
        setAddProductModalOpen,
    } = useOutletContext<EditPlanOutletContext>();

    // Fetch products for this plan
    const { data: productsResponse, isLoading: isLoadingProducts } = useGetProducts(
        {
            filters: { planId: planId },
            fields: {
                id: null,
                name: null,
                description: null,
                active: null,
                unitLabel: null,
            },
            offset: 0,
            limit: 100,
        },
        {
            enabled: !isCreateMode,
        }
    );

    const isListLoading = isLoadingPlan || isLoadingProducts;
    const products = useMemo(() => productsResponse?.data ?? [], [productsResponse?.data]);

    const productIds = useMemo(() => products.map((p) => p.id), [products]);

    // Fetch selected product details
    const { data: selectedProduct, isLoading: isLoadingProduct } = useGetProductById(
        {
            id: selectedProductId ?? '',
            fields: {
                id: null,
                name: null,
                description: null,
                active: null,
                unitLabel: null,
            },
        },
        {
            enabled: !!selectedProductId,
        }
    );

    const handleAddProduct = (product: Product) => {
        // Note: Adding product to plan requires updating the product's planId
        // This should be done through an API call in a real implementation
        // For now, we just close the modal and refresh
        setSelectedProductId(product.id);
        setAddProductModalOpen(false);
    };

    const handleRemoveProduct = (productId: string) => {
        if (window.confirm(t('plans.removeProductConfirm'))) {
            // Note: Removing product from plan requires updating the product's planId to null
            // This should be done through an API call
            if (selectedProductId === productId) {
                setSelectedProductId(null);
            }
        }
    };

    if (isCreateMode) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted-foreground">{t('plans.saveFirst')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex h-full flex-1 overflow-hidden">
                {/* Left: Products List */}
                <div className="flex h-full w-1/2 min-w-[300px] flex-col border-r">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="font-semibold">{t('plans.products')}</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                setAddProductModalOpen(true);
                                e.preventDefault();
                            }}
                        >
                            <IconPlus className="mr-2 h-4 w-4" />
                            {t('plans.addProduct')}
                        </Button>
                    </div>
                    <ProductsList
                        products={products}
                        selectedProductId={selectedProductId}
                        onSelectProduct={setSelectedProductId}
                        onRemoveProduct={handleRemoveProduct}
                        isLoading={isListLoading}
                    />
                </div>

                {/* Right: Preview */}
                <div className="h-full w-1/2 min-w-[300px]">
                    <ProductPreview
                        product={selectedProduct ?? null}
                        isLoading={isLoadingProduct && !!selectedProductId}
                    />
                </div>
            </div>

            {/* Add Product Modal */}
            <AddProductToPlanModal
                open={addProductModalOpen}
                onOpenChange={setAddProductModalOpen}
                planId={planId}
                onSelectExisting={handleAddProduct}
                existingProductIds={productIds}
            />
        </>
    );
};
