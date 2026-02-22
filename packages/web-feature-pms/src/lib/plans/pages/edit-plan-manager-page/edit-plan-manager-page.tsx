import { Badge, Button, TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router';
import { useGetPlanById } from '@maas/core-api';
import { useRoutes } from '@maas/core-workspace';
import { useState } from 'react';
import { Plan } from '@maas/core-api-models';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { PlanFormValues, useEditPlanActions, useEditPlanForm } from './hooks';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';

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
    const { t } = useTranslation();
    const { planId = '' } = useParams<{ planId: string }>();
    const isCreateMode = planId === 'new';
    const routes = useRoutes();

    const getTabItems = (id: string) => {
        return [
            { title: t('plans.tabs.info'), url: routes.pmsPlanInfo(id) },
            { title: t('plans.tabs.products'), url: routes.pmsPlanProducts(id) },
        ];
    };

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
    const pageTitle = isCreateMode ? t('plans.new') : (plan?.name ?? '');

    if (!isCreateMode && isLoading) {
        return <div className="flex h-screen items-center justify-center">{t('common.loading')}</div>;
    }

    if (!isCreateMode && !isLoading && !plan) {
        return <div className="flex h-screen items-center justify-center">{t('plans.notFound')}</div>;
    }

    const breadcrumbLabel = isCreateMode ? t('plans.new') : (plan?.name ?? '');

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
                            { label: t('common.home'), to: routes.root() },
                            { label: t('plans.title'), to: routes.pmsPlans() },
                            { label: breadcrumbLabel },
                        ]}
                    />
                </header>

                {/* Sticky Action Bar */}
                <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                    <div className="flex items-center gap-3">
                        <h1 className="max-w-md truncate text-xl font-semibold">{pageTitle || t('plans.untitled')}</h1>
                        <div className="flex items-center gap-2">
                            {active ? (
                                <Badge variant="default">{t('status.active')}</Badge>
                            ) : (
                                <Badge variant="secondary">{t('status.inactive')}</Badge>
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
                                {t('common.delete')}
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.reset()}
                            disabled={isLoading || !form.formState.isDirty}
                        >
                            {t('common.discard')}
                        </Button>
                        <Button type="submit" size="sm" disabled={isSaving || isLoading}>
                            {isSaving ? (
                                <>
                                    <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    {t('common.saving')}
                                </>
                            ) : (
                                <>
                                    <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                                    {isCreateMode ? t('common.create') : t('common.save')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <TabNavLinks items={getTabItems(planId)} />

                <Outlet context={outletContext} />
            </form>
        </FormProvider>
    );
}
