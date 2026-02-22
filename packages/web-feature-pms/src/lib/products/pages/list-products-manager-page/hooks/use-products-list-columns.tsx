import { ColumnDef } from '@tanstack/react-table';
import { Product } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router';
import { IconEdit, IconPackage, IconTrash } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function useProductsListColumns(): ColumnDef<Product>[] {
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
                return (
                    <Link to={routes.pmsProductInfo(row.original.id)} className="flex items-center gap-3">
                        <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                <IconPackage className="h-5 w-5" />
                            </div>
                        </div>
                        <LongText className="max-w-48 underline">{row.getValue('name')}</LongText>
                    </Link>
                );
            },
            meta: { className: 'w-64' },
        },
        {
            accessorKey: 'description',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.description')} />,
            cell: ({ row }) => <LongText className="max-w-64">{row.getValue('description')}</LongText>,
            enableSorting: false,
        },
        {
            accessorKey: 'lookupKey',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('products.lookupKey')} />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('lookupKey') || '-'}</span>,
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
                            label: t('products.edit'),
                            icon: IconEdit,
                            linkTo: (product: Product) => routes.pmsProductInfo(product.id),
                        },
                        {
                            label: t('products.delete'),
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (product: Product) => routes.pmsProductInfo(product.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
