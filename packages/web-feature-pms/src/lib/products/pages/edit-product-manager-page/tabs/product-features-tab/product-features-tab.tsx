import { useGetFeatureById, useGetFeatures } from '@maas/core-api';
import { Button } from '@maas/web-components';
import { IconPlus } from '@tabler/icons-react';
import { useOutletContext } from 'react-router-dom';
import { FeaturePreview, FeaturesList } from './components';
import { AttachFeatureModal } from './modals';
import { EditProductOutletContext } from '../../edit-product-manager-page';
import { Feature } from '@maas/core-api-models';
import { useMemo } from 'react';
import { toast } from 'sonner';

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

    // Note: In a real implementation, you would fetch ProductFeature junction records
    // For now, we'll simulate with a direct features query
    // The backend should have an endpoint like /products/{productId}/features
    const {
        data: featuresResponse,
        isLoading: isLoadingFeatures,
        refetch: refetchFeatures,
    } = useGetFeatures(
        {
            // This would need to be modified to filter by product
            fields: {
                id: null,
                displayName: null,
                lookupKey: null,
                withQuota: null,
                quotaAggregationFormula: null,
            },
            offset: 0,
            limit: 100,
        },
        {
            enabled: !isCreateMode,
        }
    );

    const isListLoading = isLoadingProduct || isLoadingFeatures;

    // In a real implementation, these would be the features attached to this product
    // For now, we show all features as a placeholder
    const features = useMemo(() => featuresResponse?.data ?? [], [featuresResponse?.data]);

    const featureIds = useMemo(() => features.map((f) => f.id), [features]);

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
        // In a real implementation, this would call an API to attach the feature to the product
        // For now, we just show a success message
        toast.success(`Feature "${feature.displayName}" attached to product`);
        setSelectedFeatureId(feature.id);
        setAddFeatureModalOpen(false);
        refetchFeatures();
    };

    const handleDetachFeature = (featureId: string) => {
        if (window.confirm('Detach this feature from the product?')) {
            // In a real implementation, this would call an API to detach the feature
            toast.success('Feature detached from product');
            if (selectedFeatureId === featureId) {
                setSelectedFeatureId(null);
            }
            refetchFeatures();
        }
    };

    if (isCreateMode) {
        return (
            <div className="flex flex-1 items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted-foreground">Save the product first before attaching features.</p>
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
                        <h3 className="font-semibold">Features</h3>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                                setAddFeatureModalOpen(true);
                                e.preventDefault();
                            }}
                        >
                            <IconPlus className="mr-2 h-4 w-4" />
                            Attach Feature
                        </Button>
                    </div>
                    <FeaturesList
                        features={features}
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
