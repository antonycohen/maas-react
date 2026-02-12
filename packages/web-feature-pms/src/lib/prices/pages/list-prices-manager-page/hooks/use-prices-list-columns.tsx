import { ColumnDef } from '@tanstack/react-table';
import { Price } from '@maas/core-api-models';
import { Badge, Checkbox } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconCoin, IconTrash } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

const formatPrice = (price: Price): string => {
    const amount = price.unitAmountInCents ?? 0;
    const currency = price.currency?.toUpperCase() ?? 'USD';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount / 100);
};

export function usePricesListColumns(): ColumnDef<Price>[] {
    const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();
    const { t } = useTranslation();

    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label={t('table.selectAll')}
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
                    aria-label={t('table.selectRow')}
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'unitAmountInCents',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('prices.amount')} />,
            cell: ({ row }) => {
                return (
                    <Link
                        to={`${currentWorkspaceBaseUrl}/pms/prices/${row.original.id}`}
                        className="flex items-center gap-3"
                    >
                        <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                <IconCoin className="h-5 w-5" />
                            </div>
                        </div>
                        <span className="font-medium underline">{formatPrice(row.original)}</span>
                    </Link>
                );
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'lookupKey',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('prices.lookupKey')} />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('lookupKey') || '-'}</span>,
            enableSorting: false,
        },
        {
            accessorKey: 'recurringInterval',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('prices.billingInterval')} />,
            cell: ({ row }) => {
                const interval = row.getValue('recurringInterval');
                const count = row.original.recurringIntervalCount ?? 1;
                if (!interval) return <span>{t('prices.oneTime')}</span>;
                return (
                    <span>
                        {count === 1
                            ? t('prices.perInterval', { interval })
                            : t('prices.everyInterval', { count, interval })}
                    </span>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'active',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.status')} />,
            cell: ({ row }) => {
                const active = row.getValue('active');
                return (
                    <Badge variant={active ? 'default' : 'secondary'}>
                        {active ? t('status.active') : t('status.inactive')}
                    </Badge>
                );
            },
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <CollectionRowActions
                    row={row}
                    actions={[
                        {
                            label: t('prices.edit'),
                            icon: IconEdit,
                            linkTo: (price: Price) => `${currentWorkspaceBaseUrl}/pms/prices/${price.id}`,
                        },
                        {
                            label: t('prices.delete'),
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (price: Price) => `${currentWorkspaceBaseUrl}/pms/prices/${price.id}`,
                        },
                    ]}
                />
            ),
        },
    ];
}
