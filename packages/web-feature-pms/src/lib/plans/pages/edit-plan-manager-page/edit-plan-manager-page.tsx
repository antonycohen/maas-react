import { Badge, Button, TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router-dom';
import { useGetPlanById } from '@maas/core-api';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useState } from 'react';
import { Plan } from '@maas/core-api-models';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { PlanFormValues, useEditPlanActions, useEditPlanForm } from './hooks';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';

const getTabItems = (baseUrl: string, planId: string) => {
    return [
        { title: 'Info', url: `${baseUrl}/pms/plans/${planId}/info` },
        { title: 'Products', url: `${baseUrl}/pms/plans/${planId}/products` },
    ];
};

export type EditPlanOutletContext = {
    planId: string;
    isCreateMode: boolean;
    plan: Plan | undefined;
    isLoading: boolean;
    refetchPlan: () => void;
    // Form
    form: UseFormReturn<PlanFormValues>;
    // Selection state for products organizer
    selectedProductId: string | null;
    setSelectedProductId: (id: string | null) => void;
    // Modal state
    addProductModalOpen: boolean;
    setAddProductModalOpen: (open: boolean) => void;
};

export function EditPlanManagerPage() {
    const { planId = '' } = useParams<{ planId: string }>();
    const isCreateMode = planId === 'new';
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();

    // Selection state for products organizer
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
    // Modal state
    const [addProductModalOpen, setAddProductModalOpen] = useState(false);

    // Data fetching
    const {
        data: plan,
        isLoading,
        refetch: refetchPlan,
    } = useGetPlanById(
        {
            id: planId,
            fields: {
                id: null,
                name: null,
                description: null,
                active: null,
                metadata: null,
            },
        },
        {
            enabled: !isCreateMode,
        }
    );

    // Form
    const { form } = useEditPlanForm({
        plan,
        isCreateMode,
    });

    // Actions
    const { onSubmit, handleDelete, isSaving, deleteMutation } = useEditPlanActions(form, isCreateMode, planId);

    const active = form.watch('active');
    const pageTitle = isCreateMode ? 'New Plan' : (plan?.name ?? '');

    if (!isCreateMode && isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isCreateMode && !isLoading && !plan) {
        return <div className="flex h-screen items-center justify-center">Plan not found</div>;
    }

    const breadcrumbLabel = isCreateMode ? 'New' : (plan?.name ?? '');

    const outletContext: EditPlanOutletContext = {
        planId,
        isCreateMode,
        plan,
        isLoading,
        refetchPlan,
        form,
        selectedProductId,
        setSelectedProductId,
        addProductModalOpen,
        setAddProductModalOpen,
    };

    return (
        <FormProvider {...form}>
            <form id="plan-form" onSubmit={form.handleSubmit(onSubmit)} className="flex h-[calc(100vh-4rem)] flex-col">
                <header className="shrink-0">
                    <LayoutBreadcrumb
                        items={[
                            { label: 'Home', to: `${workspaceUrl}/` },
                            { label: 'Subscription Plans', to: `${workspaceUrl}/pms/plans` },
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
                <TabNavLinks items={getTabItems(workspaceUrl, planId)} />

                <Outlet context={outletContext} />
            </form>
        </FormProvider>
    );
}
