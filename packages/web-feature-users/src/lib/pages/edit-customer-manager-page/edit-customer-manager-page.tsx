import { Button, TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router';
import { useGetCustomerById } from '@maas/core-api';
import { useRoutes } from '@maas/core-workspace';
import { ReadCustomer } from '@maas/core-api-models';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { CustomerFormValues, useEditCustomerActions, useEditCustomerForm } from './hooks';
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';

export type EditCustomerOutletContext = {
    customerId: string;
    customer: ReadCustomer | undefined;
    isLoading: boolean;
    isCreateMode: boolean;
    form: UseFormReturn<CustomerFormValues>;
};

export function EditCustomerManagerPage() {
    const { customerId = '' } = useParams<{ customerId: string }>();
    const routes = useRoutes();
    const { t } = useTranslation();

    const isCreateMode = customerId === 'new';

    const { data: customer, isLoading } = useGetCustomerById(
        {
            id: customerId,
            fields: {
                id: null,
                name: null,
                email: null,
                phone: null,
                description: null,
                addressLine1: null,
                addressLine2: null,
                addressCity: null,
                addressState: null,
                addressPostalCode: null,
                addressCountry: null,
                currency: null,
                balance: null,
                taxExempt: null,
                refId: null,
                delinquent: null,
                createdAt: null,
                updatedAt: null,
                metadata: null,
            },
        },
        { enabled: !isCreateMode }
    );

    const { form } = useEditCustomerForm({ customer });
    const { onSubmit, isSaving } = useEditCustomerActions(form, customerId, isCreateMode);

    const pageTitle = isCreateMode ? t('customers.createTitle') : (customer?.name ?? '');

    const getTabItems = (id: string) => [
        { title: t('customers.tabs.info'), url: routes.customerInfo(id) },
        ...(isCreateMode
            ? []
            : [
                  { title: t('customers.tabs.addresses'), url: routes.customerAddresses(id) },
                  { title: t('customers.tabs.subscriptions'), url: routes.customerSubscriptions(id) },
              ]),
    ];

    if (!isCreateMode && isLoading) {
        return <div className="flex h-screen items-center justify-center">{t('common.loading')}</div>;
    }

    if (!isCreateMode && !isLoading && !customer) {
        return <div className="flex h-screen items-center justify-center">{t('customers.notFound')}</div>;
    }

    const outletContext: EditCustomerOutletContext = {
        customerId,
        customer,
        isLoading,
        isCreateMode,
        form,
    };

    return (
        <FormProvider {...form}>
            <form
                id="customer-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-[calc(100vh-4rem)] flex-col"
            >
                <header className="shrink-0">
                    <LayoutBreadcrumb
                        items={[
                            { label: t('common.home'), to: routes.root() },
                            { label: t('customers.title'), to: routes.customers() },
                            { label: isCreateMode ? t('customers.createTitle') : (customer?.name ?? customerId) },
                        ]}
                    />
                </header>

                {/* Sticky Action Bar */}
                <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                    <div className="flex items-center gap-3">
                        <h1 className="max-w-md truncate text-xl font-semibold">
                            {pageTitle || t('customers.untitled')}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2">
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
                <TabNavLinks items={getTabItems(customerId)} />

                <Outlet context={outletContext} />
            </form>
        </FormProvider>
    );
}
