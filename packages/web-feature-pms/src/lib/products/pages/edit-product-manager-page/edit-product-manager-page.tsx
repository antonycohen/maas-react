import { Badge, Button, TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router-dom';
import { useGetProductById } from '@maas/core-api';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useState } from 'react';
import { Product } from '@maas/core-api-models';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { ProductFormValues, useEditProductActions, useEditProductForm } from './hooks';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';

const getTabItems = (baseUrl: string, productId: string) => {
    return [
        { title: 'Info', url: `${baseUrl}/pms/products/${productId}/info` },
        { title: 'Prices', url: `${baseUrl}/pms/products/${productId}/prices` },
        { title: 'Features', url: `${baseUrl}/pms/products/${productId}/features` },
    ];
};

export type EditProductOutletContext = {
    productId: string;
    isCreateMode: boolean;
    product: Product | undefined;
    isLoading: boolean;
    refetchProduct: () => void;
    // Form
    form: UseFormReturn<ProductFormValues>;
    // Selection state for prices organizer
    selectedPriceId: string | null;
    setSelectedPriceId: (id: string | null) => void;
    // Selection state for features organizer
    selectedFeatureId: string | null;
    setSelectedFeatureId: (id: string | null) => void;
    // Modal states
    addPriceModalOpen: boolean;
    setAddPriceModalOpen: (open: boolean) => void;
    addFeatureModalOpen: boolean;
    setAddFeatureModalOpen: (open: boolean) => void;
};

export function EditProductManagerPage() {
    const { productId = '' } = useParams<{ productId: string }>();
    const isCreateMode = productId === 'new';
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();

    // Selection states for organizers
    const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null);
    const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(null);
    // Modal states
    const [addPriceModalOpen, setAddPriceModalOpen] = useState(false);
    const [addFeatureModalOpen, setAddFeatureModalOpen] = useState(false);

    // Data fetching
    const {
        data: product,
        isLoading,
        refetch: refetchProduct,
    } = useGetProductById(
        {
            id: productId,
            fields: {
                id: null,
                name: null,
                description: null,
                active: null,
                unitLabel: null,
                metadata: null,
            },
        },
        {
            enabled: !isCreateMode,
        }
    );

    // Form
    const { form } = useEditProductForm({
        product,
        isCreateMode,
    });

    // Actions
    const { onSubmit, handleDelete, isSaving, deleteMutation } = useEditProductActions(form, isCreateMode, productId);

    const active = form.watch('active');
    const pageTitle = isCreateMode ? 'New Product' : (product?.name ?? '');

    if (!isCreateMode && isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isCreateMode && !isLoading && !product) {
        return <div className="flex h-screen items-center justify-center">Product not found</div>;
    }

    const breadcrumbLabel = isCreateMode ? 'New' : (product?.name ?? '');

    const outletContext: EditProductOutletContext = {
        productId,
        isCreateMode,
        product,
        isLoading,
        refetchProduct,
        form,
        selectedPriceId,
        setSelectedPriceId,
        selectedFeatureId,
        setSelectedFeatureId,
        addPriceModalOpen,
        setAddPriceModalOpen,
        addFeatureModalOpen,
        setAddFeatureModalOpen,
    };

    return (
        <FormProvider {...form}>
            <form
                id="product-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-[calc(100vh-4rem)] flex-col"
            >
                <header className="shrink-0">
                    <LayoutBreadcrumb
                        items={[
                            { label: 'Home', to: `${workspaceUrl}/` },
                            { label: 'Products', to: `${workspaceUrl}/pms/products` },
                            { label: breadcrumbLabel },
                        ]}
                    />
                </header>

                {/* Sticky Action Bar */}
                <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                    <div className="flex items-center gap-3">
                        <h1 className="max-w-md truncate text-xl font-semibold">{pageTitle || 'Untitled'}</h1>
                        <div className="flex items-center gap-2">
                            {active ? (
                                <Badge variant="default">Active</Badge>
                            ) : (
                                <Badge variant="secondary">Inactive</Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isCreateMode && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <IconTrash className="mr-1.5 h-4 w-4" />
                                Delete
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.reset()}
                            disabled={isLoading || !form.formState.isDirty}
                        >
                            Discard
                        </Button>
                        <Button type="submit" size="sm" disabled={isSaving || isLoading}>
                            {isSaving ? (
                                <>
                                    <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                                    {isCreateMode ? 'Create' : 'Save'}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <TabNavLinks items={getTabItems(workspaceUrl, productId)} />

                <Outlet context={outletContext} />
            </form>
        </FormProvider>
    );
}
