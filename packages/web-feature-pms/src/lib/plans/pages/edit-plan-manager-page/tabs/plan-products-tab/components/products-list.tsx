import { Product } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { Button, Badge } from '@maas/web-components';
import { IconTrash, IconPackage } from '@tabler/icons-react';

interface ProductsListProps {
    products: Product[];
    selectedProductId: string | null;
    onSelectProduct: (id: string | null) => void;
    onRemoveProduct: (id: string) => void;
    isLoading: boolean;
}

export const ProductsList = ({
    products,
    selectedProductId,
    onSelectProduct,
    onRemoveProduct,
    isLoading,
}: ProductsListProps) => {
    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-4">
                <span className="text-muted-foreground">Loading products...</span>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                <IconPackage className="text-muted-foreground mb-4 h-12 w-12" />
                <p className="text-muted-foreground">No products added to this plan yet.</p>
                <p className="text-muted-foreground mt-1 text-sm">Click "Add Product" to link products to this plan.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            <ul className="divide-y">
                {products.map((product) => (
                    <li
                        key={product.id}
                        className={cn(
                            'hover:bg-muted/50 flex cursor-pointer items-center justify-between px-4 py-3 transition-colors',
                            selectedProductId === product.id && 'bg-muted'
                        )}
                        onClick={() => onSelectProduct(product.id)}
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md">
                                <IconPackage className="text-muted-foreground h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="truncate font-medium">{product.name}</p>
                                <p className="text-muted-foreground truncate text-sm">
                                    {product.description || 'No description'}
                                </p>
                            </div>
                            <Badge variant={product.active ? 'default' : 'secondary'}>
                                {product.active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-destructive ml-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemoveProduct(product.id);
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
