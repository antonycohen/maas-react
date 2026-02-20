import { useForm } from 'react-hook-form';
import { CreateProduct, createProductSchema, Product, UpdateProduct, updateProductSchema } from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

type UseEditProductFormParams = {
    product: Product | undefined;
    isCreateMode: boolean;
    planId?: string;
};

export type ProductFormValues = CreateProduct | UpdateProduct;

export const useEditProductForm = ({ product, isCreateMode, planId }: UseEditProductFormParams) => {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(isCreateMode ? createProductSchema : updateProductSchema),
        defaultValues: {
            name: '',
            description: '',
            active: true,
            unitLabel: '',
            metadata: {},
            plan: planId ? { id: planId } : undefined,
        },
        values:
            !isCreateMode && product
                ? {
                      name: product.name ?? '',
                      description: product.description ?? '',
                      active: product.active ?? true,
                      unitLabel: product.unitLabel ?? '',
                      plan: product.plan ? { id: product.plan.id } : undefined,
                      metadata: product.metadata ?? {},
                  }
                : undefined,
    });

    return { form };
};
