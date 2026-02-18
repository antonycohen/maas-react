import { ColumnDef } from '@tanstack/react-table';
import { DiffusionList } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEye, IconListDetails } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';
import { statusVariantMap } from '../../detail-diffusion-list-page/components/diffusion-list-status-badge';

export function useDiffusionListsColumns(): ColumnDef<DiffusionList>[] {
    const { t } = useTranslation();
    const routes = useRoutes();

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
            cell: ({ row }) => (
                <Link to={routes.diffusionListDetail(row.original.id)} className="flex items-center gap-3">
                    <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                        <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                            <IconListDetails className="h-5 w-5" />
                        </div>
                    </div>
                    <LongText className="max-w-48 underline">{row.getValue('name')}</LongText>
                </Link>
            ),
            meta: { className: 'w-64' },
        },
        {
            accessorKey: 'type',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.type')} />,
            cell: ({ row }) => <Badge variant="outline">{row.getValue('type')}</Badge>,
            enableSorting: false,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.status')} />,
            cell: ({ row }) => {
                const status = row.original.status;
                return (
                    <Badge variant={status ? (statusVariantMap[status] ?? 'secondary') : 'secondary'}>
                        {status ? t(`diffusionLists.status.${status}`) : '-'}
                    </Badge>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'entryCount',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('diffusionLists.entryCount')} />,
            cell: ({ row }) => row.getValue('entryCount') ?? 0,
            enableSorting: false,
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.createdAt')} />,
            cell: ({ row }) => {
                const date = row.original.createdAt;
                return date ? new Date(date).toLocaleDateString() : '-';
            },
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <CollectionRowActions
                    row={row}
                    actions={[
                        {
                            label: t('common.view'),
                            icon: IconEye,
                            linkTo: (item: DiffusionList) => routes.diffusionListDetail(item.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
