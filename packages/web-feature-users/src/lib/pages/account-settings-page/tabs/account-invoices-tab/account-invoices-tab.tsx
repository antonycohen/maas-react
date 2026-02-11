import { useGetMyInvoices } from '@maas/core-api';
import { Skeleton } from '@maas/web-components';
import { InvoiceListSection } from './components/invoice-list-section';

export const AccountInvoicesTab = () => {
    const { data, isLoading } = useGetMyInvoices();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                <Skeleton className="h-[300px] w-full rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <InvoiceListSection invoices={data?.invoices} />
        </div>
    );
};
