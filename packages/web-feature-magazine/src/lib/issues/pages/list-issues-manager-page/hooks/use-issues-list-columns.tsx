import { ColumnDef } from '@tanstack/react-table';
import { Issue } from '@maas/core-api-models';
import { Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';
import { format } from 'date-fns';

export function useIssuesListColumns(): ColumnDef<Issue>[] {
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
                    <img src={imageUrl} alt={row.original.title} className="rounded object-cover" />
                ) : (
                    <div className="bg-muted rounded" />
                );
            },
            enableSorting: false,
            meta: { className: 'w-16' },
        },
        {
            accessorKey: 'title',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.title')} />,
            cell: ({ row }) => {
                return (
                    <Link to={routes.issueInfo(row.original.id)} className={'underline'}>
                        <LongText className="max-w-48">{row.getValue('title')}</LongText>
                    </Link>
                );
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'issueNumber',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('issues.issueNumber')} />,
            cell: ({ row }) => <span>{row.getValue('issueNumber') || '—'}</span>,
            meta: { className: 'w-24' },
        },
        {
            id: 'brand',
            accessorFn: (row) => row.brand?.id,
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.brand')} />,
            cell: ({ row }) => {
                const brand = row.original.brand;
                return brand ? (
                    <Link to={routes.brandEdit(brand.id)} className="underline">
                        <LongText className="max-w-36">{brand.name}</LongText>
                    </Link>
                ) : (
                    <span className="text-muted-foreground">—</span>
                );
            },
            enableSorting: false,
            filterFn: (row, id, value) => {
                return value.includes(row.getValue(id));
            },
        },
        {
            accessorKey: 'isPublished',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.published')} />,
            cell: ({ row }) => (
                <span className={row.getValue('isPublished') ? 'text-green-600' : 'text-muted-foreground'}>
                    {row.getValue('isPublished') ? t('common.yes') : t('common.no')}
                </span>
            ),
            meta: { className: 'w-24' },
        },
        {
            accessorKey: 'folderCount',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('folders.title')} />,
            cell: ({ row }) => <div className="text-center">{row.getValue('folderCount') ?? 0}</div>,
            enableSorting: false,
            meta: { className: 'w-20' },
        },
        {
            accessorKey: 'articleCount',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('articles.title')} />,
            cell: ({ row }) => <div className="text-center">{row.getValue('articleCount') ?? 0}</div>,
            enableSorting: false,
            meta: { className: 'w-20' },
        },
        {
            accessorKey: 'publishedAt',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.publishedAt')} />,
            cell: ({ row }) => (
                <div className="w-fit text-nowrap">
                    {row.getValue('publishedAt') ? format(row.getValue('publishedAt'), 'dd MMM, yyyy') : '-'}
                </div>
            ),
            enableSorting: true,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <CollectionRowActions
                    row={row}
                    actions={[
                        {
                            label: t('issues.edit'),
                            icon: IconEdit,
                            linkTo: (issue: Issue) => routes.issueInfo(issue.id),
                        },
                        {
                            label: t('issues.delete'),
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (issue: Issue) => routes.issueInfo(issue.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
