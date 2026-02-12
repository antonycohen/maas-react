import { useDeletePrice, useGetPriceById, useGetPrices } from '@maas/core-api';
import { Button } from '@maas/web-components';
import { IconPlus } from '@tabler/icons-react';
import { useOutletContext } from 'react-router-dom';
import { PricePreview, PricesList } from './components';
import { CreatePriceModal } from './modals';
import { EditProductOutletContext } from '../../edit-product-manager-page';
import { Price } from '@maas/core-api-models';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

export const ProductPricesTab = () => {
    const {
        productId,
        isCreateMode,
        isLoading: isLoadingProduct,
        selectedPriceId,
        setSelectedPriceId,
        addPriceModalOpen,
        setAddPriceModalOpen,
    } = useOutletContext<EditProductOutletContext>();
    const { t } = useTranslation();

    // Fetch prices for this product
    const {
        data: pricesResponse,
        isLoading: isLoadingPrices,
        refetch: refetchPrices,
    } = useGetPrices(
        {
            filters: { productId: productId },
            fields: {
                id: null,
                currency: null,
                unitAmountInCents: null,
                active: null,
                lookupKey: null,
                recurringInterval: null,
                recurringIntervalCount: null,
                recurringUsageType: null,
            },
            offset: 0,
            limit: 100,
        },
        {
            enabled: !isCreateMode,
        }
    );

    const isListLoading = isLoadingProduct || isLoadingPrices;
    const prices = useMemo(() => pricesResponse?.data ?? [], [pricesResponse?.data]);

    // Fetch selected price details
    const { data: selectedPrice, isLoading: isLoadingPrice } = useGetPriceById(
        {
            id: selectedPriceId ?? '',
            fields: {
                id: null,
                currency: null,
                unitAmountInCents: null,
                active: null,
                lookupKey: null,
                recurringInterval: null,
                recurringIntervalCount: null,
                recurringUsageType: null,
            },
        },
        {
            enabled: !!selectedPriceId,
        }
    );

    const deleteMutation = useDeletePrice({
        onSuccess: () => {
            toast.success(t('prices.deletedSuccess'));
            refetchPrices();
            if (selectedPriceId) {
                setSelectedPriceId(null);
            }
        },
        onError: () => {
            toast.error(t('prices.deleteFailed'));
        },
    });

    const handlePriceCreated = (price: Price) => {
        refetchPrices();
        setSelectedPriceId(price.id);
    };

    const handleRemovePrice = (priceId: string) => {
        if (window.confirm(t('prices.deleteConfirm'))) {
            deleteMutation.mutate(priceId);
        }
    };

    if (isCreateMode) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted-foreground">{t('products.saveFirstPrices')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex h-full flex-1 overflow-hidden">
                {/* Left: Prices List */}
                <div className="flex h-full w-1/2 min-w-[300px] flex-col border-r">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="font-semibold">{t('products.prices')}</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                setAddPriceModalOpen(true);
                                e.preventDefault();
                            }}
                        >
                            <IconPlus className="mr-2 h-4 w-4" />
                            {t('products.addPrice')}
                        </Button>
                    </div>
                    <PricesList
                        prices={prices}
                        selectedPriceId={selectedPriceId}
                        onSelectPrice={setSelectedPriceId}
                        onRemovePrice={handleRemovePrice}
                        isLoading={isListLoading}
                    />
                </div>

                {/* Right: Preview */}
                <div className="h-full w-1/2 min-w-[300px]">
                    <PricePreview price={selectedPrice ?? null} isLoading={isLoadingPrice && !!selectedPriceId} />
                </div>
            </div>

            {/* Create Price Modal */}
            <CreatePriceModal
                open={addPriceModalOpen}
                onOpenChange={setAddPriceModalOpen}
                productId={productId}
                onSuccess={handlePriceCreated}
            />
        </>
    );
};
