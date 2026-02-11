import { Button, TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router-dom';
import { useGetCustomerById } from '@maas/core-api';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { ReadCustomer } from '@maas/core-api-models';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { CustomerFormValues, useEditCustomerActions, useEditCustomerForm } from './hooks';
import { IconDeviceFloppy, IconLoader2 } from '@tabler/icons-react';

const getTabItems = (baseUrl: string, customerId: string) => {
    return [
        { title: 'Info', url: `${baseUrl}/customers/${customerId}/info` },
        { title: 'Subscriptions', url: `${baseUrl}/customers/${customerId}/subscriptions` },
    ];
};

export type EditCustomerOutletContext = {
    customerId: string;
    customer: ReadCustomer | undefined;
    isLoading: boolean;
    form: UseFormReturn<CustomerFormValues>;
};

export function EditCustomerManagerPage() {
    const { customerId = '' } = useParams<{ customerId: string }>();
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();

    const { data: customer, isLoading } = useGetCustomerById({
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
    });

    const { form } = useEditCustomerForm({ customer });
    const { onSubmit, isSaving } = useEditCustomerActions(form, customerId);

    const pageTitle = customer?.name ?? '';

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isLoading && !customer) {
        return <div className="flex h-screen items-center justify-center">Customer not found</div>;
    }

    const outletContext: EditCustomerOutletContext = {
        customerId,
        customer,
        isLoading,
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
                            { label: 'Home', to: `${workspaceUrl}/` },
                            { label: 'Customers', to: `${workspaceUrl}/customers` },
                            { label: customer?.name ?? customerId },
                        ]}
                    />
                </header>

                {/* Sticky Action Bar */}
                <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                    <div className="flex items-center gap-3">
                        <h1 className="max-w-md truncate text-xl font-semibold">{pageTitle || 'Untitled'}</h1>
                    </div>

                    <div className="flex items-center gap-2">
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
                                    Save
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <TabNavLinks items={getTabItems(workspaceUrl, customerId)} />

                <Outlet context={outletContext} />
            </form>
        </FormProvider>
    );
}
