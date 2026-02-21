import { ColumnDef } from '@tanstack/react-table';
import { Enum } from '@maas/core-api-models';
import { Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function useEnumsListColumns(): ColumnDef<Enum>[] {
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
                    <Link to={routes.enumEdit(row.original.id)} className="underline">
                        <LongText className="max-w-48">{row.getValue('name')}</LongText>
                    </Link>
                );
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'values',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.values')} />,
            cell: ({ row }) => {
                const values = row.original.values;
                const count = values?.length ?? 0;
                return <div>{t('enums.valueCount', { count })}</div>;
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
                            label: t('enums.edit'),
                            icon: IconEdit,
                            linkTo: (enumItem: Enum) => routes.enumEdit(enumItem.id),
                        },
                        {
                            label: t('enums.delete'),
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (enumItem: Enum) => routes.enumEdit(enumItem.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
