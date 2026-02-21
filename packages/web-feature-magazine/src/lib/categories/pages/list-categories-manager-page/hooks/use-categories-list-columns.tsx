import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@maas/core-api-models';
import { Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function useCategoriesListColumns(): ColumnDef<Category>[] {
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
            id: 'cover',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.cover')} />,
            cell: ({ row }) => {
                const cover = row.original.cover;
                const imageUrl = cover?.url || cover?.base64;
                return imageUrl ? (
                    <img src={imageUrl} alt={row.original.name} className="h-10 w-10 rounded object-cover" />
                ) : (
                    <div className="bg-muted h-10 w-10 rounded" />
                );
            },
            enableSorting: false,
            meta: { className: 'w-16' },
        },
        {
            accessorKey: 'name',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.name')} />,
            cell: ({ row }) => {
                return (
                    <Link to={routes.categoryEdit(row.original.id)} className={'underline'}>
                        <LongText className="max-w-48">{row.getValue('name')}</LongText>
                    </Link>
                );
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'description',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.description')} />,
            cell: ({ row }) => <LongText className="max-w-64">{row.getValue('description')}</LongText>,
            enableSorting: false,
        },
        {
            id: 'parent',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.parent')} />,
            cell: ({ row }) => {
                const parent = row.original.parent;
                return parent ? (
                    <Link to={routes.categoryEdit(parent.id)} className="underline">
                        <LongText className="max-w-36">{parent.name}</LongText>
                    </Link>
                ) : (
                    <span className="text-muted-foreground">—</span>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'childrenCount',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.children')} />,
            cell: ({ row }) => <div className="text-center">{row.getValue('childrenCount') ?? 0}</div>,
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <CollectionRowActions
                    row={row}
                    actions={[
                        {
                            label: t('categories.edit'),
                            icon: IconEdit,
                            linkTo: (category: Category) => routes.categoryEdit(category.id),
                        },
                        {
                            label: t('categories.delete'),
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (category: Category) => routes.categoryEdit(category.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
