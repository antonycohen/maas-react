import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Button,
    Input,
} from '@maas/web-components';
import { useGetProducts } from '@maas/core-api';
import { Product } from '@maas/core-api-models';
import { IconPackage, IconSearch } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';

interface AddProductToPlanModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    planId: string;
    onSelectExisting: (product: Product) => void;
    existingProductIds: string[];
}

export const AddProductToPlanModal = ({
    open,
    onOpenChange,
    planId,
    onSelectExisting,
    existingProductIds,
}: AddProductToPlanModalProps) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: productsResponse, isLoading } = useGetProducts(
        {
            filters: { name: searchTerm || undefined },
            fields: {
                id: null,
                name: null,
                description: null,
                active: null,
            },
            offset: 0,
            limit: 20,
        },
        {
            enabled: open,
        }
    );

    const availableProducts =
        productsResponse?.data?.filter((product) => !existingProductIds.includes(product.id)) ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{t('plans.addProductTitle')}</DialogTitle>
                    <DialogDescription>{t('plans.addProductDescription')}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="relative">
                        <IconSearch className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder={t('plans.searchProducts')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="max-h-[300px] overflow-y-auto rounded-md border">
                        {isLoading ? (
                            <div className="text-muted-foreground p-4 text-center">{t('plans.loadingProducts')}</div>
                        ) : availableProducts.length === 0 ? (
                            <div className="text-muted-foreground p-4 text-center">
                                {t('plans.noAvailableProducts')}
                            </div>
                        ) : (
                            <ul className="divide-y">
                                {availableProducts.map((product) => (
                                    <li
                                        key={product.id}
                                        className="hover:bg-muted/50 flex cursor-pointer items-center justify-between px-4 py-3 transition-colors"
                                        onClick={() => onSelectExisting(product)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md">
                                                <IconPackage className="text-muted-foreground h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium">{product.name}</p>
                                                <p className="text-muted-foreground text-xs">
                                                    {product.description || t('plans.noDescription')}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">
                                            {t('common.add')}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
