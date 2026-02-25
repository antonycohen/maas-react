import { ColumnDef } from '@tanstack/react-table';
import { Invoice, InvoiceStatus } from '@maas/core-api-models';
import { Badge, Checkbox } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router';
import { IconFileInvoice, IconExternalLink } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

const getStatusColor = (status: InvoiceStatus | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'open':
            return 'default';
        case 'paid':
            return 'secondary';
        case 'draft':
            return 'outline';
        case 'uncollectible':
        case 'void':
            return 'destructive';
        default:
            return 'secondary';
    }
};

const STATUS_TRANSLATION_KEYS: Record<string, string> = {
    draft: 'invoices.statusDraft',
    open: 'invoices.statusOpen',
    paid: 'invoices.statusPaid',
    uncollectible: 'invoices.statusUncollectible',
    void: 'invoices.statusVoid',
};

const numberFormatCache = new Map<string, Intl.NumberFormat>();

const getCurrencyFormatter = (currency: string): Intl.NumberFormat => {
    const key = `fr-${currency}`;
    const cached = numberFormatCache.get(key);
    if (cached) return cached;
    const formatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency });
    numberFormatCache.set(key, formatter);
    return formatter;
};

const formatAmount = (amount: number, currency: string | null): string => {
    if (!currency) return `${(amount / 100).toFixed(2)}`;
    return getCurrencyFormatter(currency).format(amount / 100);
};

const formatDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return '\u2014';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
};

export function useInvoicesListColumns(): ColumnDef<Invoice>[] {
    const routes = useRoutes();
    const { t } = useTranslation();

    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            meta: {
                className: cn(
                    'sticky md:table-cell left-0 z-10 rounded-tl',
                    'transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted pr-2! md:pr-0'
                ),
            },
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'number',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('invoices.number')} />,
            cell: ({ row }) => {
                const number = row.getValue('number') as string | null;
                return (
                    <div className="flex items-center gap-3">
                        <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                <IconFileInvoice className="h-5 w-5" />
                            </div>
                        </div>
                        <span className="text-sm font-medium">{number ?? row.original.id.slice(0, 12)}</span>
                    </div>
                );
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.status')} />,
            cell: ({ row }) => {
                const status = row.getValue('status') as InvoiceStatus | null;
                const translationKey = status ? STATUS_TRANSLATION_KEYS[status] : undefined;
                const label = translationKey ? t(translationKey) : (status ?? 'Unknown');
                return <Badge variant={getStatusColor(status)}>{label}</Badge>;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'customerEmail',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('invoices.customerEmail')} />,
            cell: ({ row }) => {
                const email = row.getValue('customerEmail') as string | null;
                const customerId = row.original.customerId;
                if (!email) return <span className="text-muted-foreground">{'\u2014'}</span>;
                if (customerId) {
                    return (
                        <Link to={routes.customerInfo(customerId)} className="text-sm underline hover:no-underline">
                            {email}
                        </Link>
                    );
                }
                return <span className="text-sm">{email}</span>;
            },
        },
        {
            accessorKey: 'amountDue',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('invoices.amountDue')} />,
            cell: ({ row }) => {
                const amount = row.getValue('amountDue') as number;
                return <span className="text-sm font-medium">{formatAmount(amount, row.original.currency)}</span>;
            },
            meta: { className: 'text-right' },
        },
        {
            accessorKey: 'amountRemaining',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('invoices.amountRemaining')} />,
            cell: ({ row }) => {
                const amount = row.getValue('amountRemaining') as number;
                const isUnpaid = amount > 0;
                return (
                    <span className={cn('text-sm font-medium', isUnpaid && 'text-red-600')}>
                        {formatAmount(amount, row.original.currency)}
                    </span>
                );
            },
            meta: { className: 'text-right' },
        },
        {
            accessorKey: 'dueDate',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('invoices.dueDate')} />,
            cell: ({ row }) => {
                const dueDate = row.original.dueDate;
                const isOverdue = dueDate && new Date(dueDate) < new Date() && row.original.status === 'open';
                return (
                    <span className={cn('text-sm', isOverdue ? 'font-semibold text-red-600' : 'text-muted-foreground')}>
                        {formatDate(dueDate)}
                    </span>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('invoices.createdAt')} />,
            cell: ({ row }) => {
                return <span className="text-muted-foreground text-sm">{formatDate(row.getValue('createdAt'))}</span>;
            },
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const invoice = row.original;
                const actions = [];

                if (invoice.hostedInvoiceUrl) {
                    actions.push({
                        label: t('invoices.viewOnStripe'),
                        icon: IconExternalLink,
                        onClick: () => window.open(invoice.hostedInvoiceUrl!, '_blank'),
                    });
                }

                if (actions.length === 0) return null;

                return <CollectionRowActions row={row} actions={actions} />;
            },
        },
    ];
}
