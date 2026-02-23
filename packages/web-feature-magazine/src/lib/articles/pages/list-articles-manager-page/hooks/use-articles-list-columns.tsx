import { ColumnDef } from '@tanstack/react-table';
import { Article } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router';
import { IconEdit } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';
import { format } from 'date-fns';

export function useArticlesListColumns(): ColumnDef<Article>[] {
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
            id: 'featuredImage',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.image')} />,
            cell: ({ row }) => {
                const image = row.original.featuredImage || row.original.cover;
                const imageUrl = image?.url || image?.base64;
                return imageUrl ? (
                    <img src={imageUrl} alt={row.original.title} className="h-10 w-10 rounded object-cover" />
                ) : (
                    <div className="bg-muted h-10 w-10 rounded" />
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
                    <Link to={routes.articleEdit(row.original.id)} className="underline">
                        <LongText className="max-w-48">{row.getValue('title')}</LongText>
                    </Link>
                );
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'type',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.type')} />,
            cell: ({ row }) => {
                const type = row.original.type?.name;
                return type ? (
                    <Badge variant="outline">{type}</Badge>
                ) : (
                    <span className="text-muted-foreground">-</span>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'isPublished',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.status')} />,
            cell: ({ row }) => {
                const isPublished = row.getValue('isPublished');
                return (
                    <div className="flex gap-1">
                        <Badge variant={isPublished ? 'default' : 'secondary'}>
                            {isPublished ? t('status.published') : t('status.draft')}
                        </Badge>
                    </div>
                );
            },
            enableSorting: false,
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
            accessorKey: 'createdAt',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.createdAt')} />,
            cell: ({ row }) => (
                <div className="w-fit text-nowrap">
                    {row.getValue('createdAt') ? format(row.getValue('createdAt'), 'dd MMM, yyyy') : '-'}
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
                            label: t('articles.edit'),
                            icon: IconEdit,
                            linkTo: (article: Article) => routes.articleEdit(article.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
