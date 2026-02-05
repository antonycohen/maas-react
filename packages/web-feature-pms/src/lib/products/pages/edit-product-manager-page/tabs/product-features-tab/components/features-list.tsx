import { ProductFeature } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { Button, Badge } from '@maas/web-components';
import { IconTrash, IconSparkles } from '@tabler/icons-react';

interface FeaturesListProps {
    productFeatures: ProductFeature[];
    selectedFeatureId: string | null;
    onSelectFeature: (featureId: string | null) => void;
    onRemoveFeature: (productFeatureId: string) => void;
    isLoading: boolean;
}

export const FeaturesList = ({
    productFeatures,
    selectedFeatureId,
    onSelectFeature,
    onRemoveFeature,
    isLoading,
}: FeaturesListProps) => {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <span className="text-muted-foreground">Loading features...</span>
            </div>
        );
    }

    if (productFeatures.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <IconSparkles className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">No features attached to this product yet.</p>
                <p className="text-muted-foreground mt-1 text-sm">
                    Click "Attach Feature" to link features to this product.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <ul className="divide-y">
                {productFeatures.map((pf) => (
                    <li
                        key={pf.id}
                        className={cn(
                            'hover:bg-muted/50 flex cursor-pointer items-center justify-between px-4 py-3 transition-colors',
                            selectedFeatureId === pf.feature.id && 'bg-muted'
                        )}
                        onClick={() => onSelectFeature(pf.feature.id)}
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
                                <IconSparkles className="text-muted-foreground h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{pf.feature.displayName}</p>
                                <p className="text-muted-foreground truncate font-mono text-sm text-xs">
                                    {pf.feature.lookupKey}
                                </p>
                            </div>
                            {pf.feature.withQuota && <Badge variant="outline">Quota</Badge>}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive ml-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveFeature(pf.id);
                            }}
                        >
                            <IconTrash className="h-4 w-4" />
                        </Button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
