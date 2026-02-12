import { Feature } from '@maas/core-api-models';
import { Badge } from '@maas/web-components';
import { IconSparkles } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

interface FeaturePreviewProps {
    feature: Feature | null;
    isLoading: boolean;
}

export const FeaturePreview = ({ feature, isLoading }: FeaturePreviewProps) => {
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();
    const { t } = useTranslation();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground">{t('common.loading')}</span>
            </div>
        );
    }

    if (!feature) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <IconSparkles className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">{t('products.selectFeatureToView')}</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{feature.displayName}</h3>
                        <p className="text-muted-foreground mt-1 font-mono text-sm">{feature.lookupKey}</p>
                    </div>
                    {feature.withQuota && <Badge variant="outline">{t('products.hasQuota')}</Badge>}
                </div>

                {/* Details */}
                <div className="space-y-4">
                    {feature.withQuota && feature.quotaAggregationFormula && (
                        <div className="bg-muted/50 rounded-lg p-4">
                            <h4 className="mb-2 text-sm font-medium">{t('products.quotaAggregationFormula')}</h4>
                            <pre className="overflow-auto text-xs">{feature.quotaAggregationFormula}</pre>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="border-t pt-4">
                    <Link
                        to={`${workspaceUrl}/pms/features/${feature.id}`}
                        className="text-primary text-sm hover:underline"
                    >
                        {`${t('products.viewFullFeatureDetails')} \u2192`}
                    </Link>
                </div>
            </div>
        </div>
    );
};
