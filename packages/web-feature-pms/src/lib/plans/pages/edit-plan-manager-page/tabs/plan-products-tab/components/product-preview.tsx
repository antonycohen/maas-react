import { Product } from '@maas/core-api-models';
import { Badge } from '@maas/web-components';
import { IconPackage } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

interface ProductPreviewProps {
    product: Product | null;
    isLoading: boolean;
}

export const ProductPreview = ({ product, isLoading }: ProductPreviewProps) => {
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <span className="text-muted-foreground">Loading...</span>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <IconPackage className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">Select a product to view details</p>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">{product.name}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">{product.description || 'No description'}</p>
                    </div>
                    <Badge variant={product.active ? 'default' : 'secondary'}>
                        {product.active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Unit Label</p>
                            <p className="text-sm">{product.unitLabel || '-'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-sm font-medium">Unit Label</p>
                            <p className="text-sm">{product.unitLabel || '-'}</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="border-t pt-4">
                    <Link
                        to={`${workspaceUrl}/pms/products/${product.id}/info`}
                        className="text-primary text-sm hover:underline"
                    >
                        View full product details →
                    </Link>
                </div>
            </div>
        </div>
    );
};
