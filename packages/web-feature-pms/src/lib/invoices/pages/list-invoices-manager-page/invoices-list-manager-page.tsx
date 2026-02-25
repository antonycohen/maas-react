import { useState, useMemo } from 'react';
import { Collection } from '@maas/web-collection';
import { useInvoicesListColumns } from './hooks/use-invoices-list-columns';
import { useGetInvoices, useGetCustomers } from '@maas/core-api';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { useTranslation } from '@maas/core-translations';
import { useRoutes } from '@maas/core-workspace';
import { AsyncCombobox, AsyncComboboxOption, Checkbox, Label } from '@maas/web-components';

const useInvoiceStatusOptions = () => {
    const { t } = useTranslation();
    return [
        { value: 'draft', label: t('invoices.statusDraft') },
        { value: 'open', label: t('invoices.statusOpen') },
        { value: 'paid', label: t('invoices.statusPaid') },
        { value: 'uncollectible', label: t('invoices.statusUncollectible') },
        { value: 'void', label: t('invoices.statusVoid') },
    ];
};

export function InvoicesListManagerPage() {
    const { t } = useTranslation();
    const columns = useInvoicesListColumns();
    const statusOptions = useInvoiceStatusOptions();
    const routes = useRoutes();

    const [selectedCustomer, setSelectedCustomer] = useState<AsyncComboboxOption | null>(null);
    const [customerSearch, setCustomerSearch] = useState('');
    const [overdueOnly, setOverdueOnly] = useState(false);

    const { data: customersData, isLoading: isLoadingCustomers } = useGetCustomers({
        fields: { id: null, email: null, name: null },
        offset: 0,
        limit: 20,
        filters: { query: customerSearch },
    });

    const customerOptions: AsyncComboboxOption[] = useMemo(
        () =>
            (customersData?.data ?? []).map((c) => ({
                id: c.id ?? '',
                label: c.email ?? c.name ?? c.id ?? '',
            })),
        [customersData]
    );

    const staticParams = useMemo(
        () => ({
            filters: {
                ...(selectedCustomer && { customerId: selectedCustomer.id }),
                ...(overdueOnly && { overdue: true }),
            },
        }),
        [selectedCustomer, overdueOnly]
    );

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[{ label: t('common.home'), to: routes.root() }, { label: t('invoices.title') }]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader pageTitle={t('invoices.title')} />
                <div className="mb-4 flex flex-wrap items-end gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label className="text-sm">{t('invoices.customer')}</Label>
                        <AsyncCombobox
                            value={selectedCustomer}
                            onChange={setSelectedCustomer}
                            onSearchChange={setCustomerSearch}
                            options={customerOptions}
                            isLoading={isLoadingCustomers}
                            placeholder={t('invoices.selectCustomer')}
                            searchPlaceholder={t('invoices.searchCustomer')}
                            emptyMessage={t('invoices.noCustomerFound')}
                            className="w-72"
                        />
                    </div>
                    <div className="flex items-center gap-2 pb-0.5">
                        <Checkbox
                            id="overdue-filter"
                            checked={overdueOnly}
                            onCheckedChange={(checked) => setOverdueOnly(checked === true)}
                        />
                        <Label htmlFor="overdue-filter" className="cursor-pointer text-sm">
                            {t('invoices.overdueOnly')}
                        </Label>
                    </div>
                </div>
                <Collection
                    useLocationAsState
                    columns={columns}
                    filtersConfiguration={{
                        facetedFilters: [
                            {
                                columnId: 'status',
                                queryParamName: 'status',
                                title: t('field.status'),
                                options: statusOptions,
                            },
                        ],
                    }}
                    useQueryFn={useGetInvoices}
                    staticParams={staticParams}
                    queryFields={{
                        id: null,
                        number: null,
                        status: null,
                        amountDue: null,
                        amountPaid: null,
                        amountRemaining: null,
                        currency: null,
                        customerId: null,
                        customerEmail: null,
                        dueDate: null,
                        hostedInvoiceUrl: null,
                        createdAt: null,
                    }}
                />
            </LayoutContent>
        </div>
    );
}
