import {
    useGetFeatureById,
    useGetProductFeatures,
    useAttachFeatureToProduct,
    useDetachFeatureFromProduct,
} from '@maas/core-api';
import { Button } from '@maas/web-components';
import { IconPlus } from '@tabler/icons-react';
import { useOutletContext } from 'react-router';
import { FeaturePreview, FeaturesList } from './components';
import { AttachFeatureModal } from './modals';
import { EditProductOutletContext } from '../../edit-product-manager-page';
import { Feature } from '@maas/core-api-models';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

export const ProductFeaturesTab = () => {
    const {
        productId,
        isCreateMode,
        isLoading: isLoadingProduct,
        selectedFeatureId,
        setSelectedFeatureId,
        addFeatureModalOpen,
        setAddFeatureModalOpen,
    } = useOutletContext<EditProductOutletContext>();
    const { t } = useTranslation();

    const { data: productFeatures = [], isLoading: isLoadingFeatures } = useGetProductFeatures(
        { productId },
        { enabled: !isCreateMode && !!productId }
    );

    const attachFeatureMutation = useAttachFeatureToProduct();
    const detachFeatureMutation = useDetachFeatureFromProduct();

    const isListLoading = isLoadingProduct || isLoadingFeatures;

    // Get feature IDs for the modal to exclude already attached features
    const featureIds = useMemo(() => productFeatures.map((pf) => pf.feature.id), [productFeatures]);

    // Fetch selected feature details
    const { data: selectedFeature, isLoading: isLoadingFeature } = useGetFeatureById(
        {
            id: selectedFeatureId ?? '',
            fields: {
                id: null,
                displayName: null,
                lookupKey: null,
                withQuota: null,
                quotaAggregationFormula: null,
            },
        },
        {
            enabled: !!selectedFeatureId,
        }
    );

    const handleAttachFeature = (feature: Feature) => {
        attachFeatureMutation.mutate(
            { productId, featureId: feature.id },
            {
                onSuccess: () => {
                    toast.success(t('products.featureAttached', { name: feature.displayName }));
                    setSelectedFeatureId(feature.id);
                    setAddFeatureModalOpen(false);
                },
                onError: () => {
                    toast.error(t('products.featureAttachFailed'));
                },
            }
        );
    };

    const handleDetachFeature = (productFeatureId: string) => {
        // Find the feature to check if it's selected
        const pf = productFeatures.find((p) => p.id === productFeatureId);
        const featureId = pf?.feature.id;

        if (window.confirm(t('products.detachFeatureConfirm'))) {
            detachFeatureMutation.mutate(
                { productId, productFeatureId },
                {
                    onSuccess: () => {
                        toast.success(t('products.featureDetached'));
                        if (selectedFeatureId === featureId) {
                            setSelectedFeatureId(null);
                        }
                    },
                    onError: () => {
                        toast.error(t('products.featureDetachFailed'));
                    },
                }
            );
        }
    };

    if (isCreateMode) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted-foreground">{t('products.saveFirstFeatures')}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex h-full flex-1 overflow-hidden">
                {/* Left: Features List */}
                <div className="flex h-full w-1/2 min-w-[300px] flex-col border-r">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="font-semibold">{t('products.features')}</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                setAddFeatureModalOpen(true);
                                e.preventDefault();
                            }}
                        >
                            <IconPlus className="mr-2 h-4 w-4" />
                            {t('products.attachFeature')}
                        </Button>
                    </div>
                    <FeaturesList
                        productFeatures={productFeatures}
                        selectedFeatureId={selectedFeatureId}
                        onSelectFeature={setSelectedFeatureId}
                        onRemoveFeature={handleDetachFeature}
                        isLoading={isListLoading}
                    />
                </div>

                {/* Right: Preview */}
                <div className="h-full w-1/2 min-w-[300px]">
                    <FeaturePreview
                        feature={selectedFeature ?? null}
                        isLoading={isLoadingFeature && !!selectedFeatureId}
                    />
                </div>
            </div>

            {/* Attach Feature Modal */}
            <AttachFeatureModal
                open={addFeatureModalOpen}
                onOpenChange={setAddFeatureModalOpen}
                productId={productId}
                onSelectFeature={handleAttachFeature}
                existingFeatureIds={featureIds}
            />
        </>
    );
};
