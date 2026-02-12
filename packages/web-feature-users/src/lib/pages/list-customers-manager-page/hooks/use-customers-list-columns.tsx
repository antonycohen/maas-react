import { ColumnDef } from '@tanstack/react-table';
import { ReadCustomer } from '@maas/core-api-models';
import { Button, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

const formatBalance = (balance: number | null, currency: string | null): string => {
    if (balance === null) return '—';
    const amount = balance / 100;
    const currencyCode = currency?.toUpperCase() ?? 'EUR';
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currencyCode,
    }).format(amount);
};

export function useCustomersListColumns(): ColumnDef<ReadCustomer>[] {
    const routes = useRoutes();
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
            accessorKey: 'name',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.name')} />,
            cell: ({ row }) => {
                const name = row.original.name;
                return (
                    <Button variant="link" className="underline" asChild>
                        <Link to={routes.customerInfo(row.original.id)}>
                            <LongText className="max-w-36">{name ?? '—'}</LongText>
                        </Link>
                    </Button>
                );
            },
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'email',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.email')} />,
            cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'phone',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.phone')} />,
            cell: ({ row }) => <div>{row.getValue('phone') ?? '—'}</div>,
            enableSorting: false,
        },
        {
            accessorKey: 'refId',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.refId')} />,
            cell: ({ row }) => (
                <div className="w-fit font-mono text-xs text-nowrap">{row.getValue('refId') ?? '—'}</div>
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'balance',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.balance')} />,
            cell: ({ row }) => (
                <div className="w-fit text-nowrap">{formatBalance(row.original.balance, row.original.currency)}</div>
            ),
            enableSorting: false,
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.created')} />,
            cell: ({ row }) => (
                <div className="w-fit text-nowrap">
                    {row.getValue('createdAt') ? format(row.getValue('createdAt'), 'dd MMM, yyyy') : ''}
                </div>
            ),
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <CollectionRowActions
                    row={row}
                    actions={[
                        {
                            label: t('customers.edit'),
                            icon: IconEdit,
                            linkTo: (customer: ReadCustomer) => routes.customerInfo(customer.id),
                        },
                        {
                            label: t('customers.delete'),
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (customer: ReadCustomer) => routes.customerInfo(customer.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
