import { ColumnDef } from '@tanstack/react-table';
import { ArticleType } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function useArticleTypesListColumns(): ColumnDef<ArticleType>[] {
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
                    <Link to={routes.articleTypeEdit(row.original.id)} className="underline">
                        <LongText className="max-w-48">{row.getValue('name')}</LongText>
                    </Link>
                );
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'fields',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.fields')} />,
            cell: ({ row }) => {
                const fields = row.original.fields;
                const count = fields?.length ?? 0;
                return <div>{t('articleTypes.fieldCount', { count })}</div>;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'isActive',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.status')} />,
            cell: ({ row }) => {
                const isActive = row.getValue('isActive');
                return (
                    <Badge variant={isActive ? 'default' : 'secondary'}>
                        {isActive ? t('status.active') : t('status.inactive')}
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
                            label: t('articleTypes.edit'),
                            icon: IconEdit,
                            linkTo: (articleType: ArticleType) => routes.articleTypeEdit(articleType.id),
                        },
                        {
                            label: t('articleTypes.delete'),
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (articleType: ArticleType) => routes.articleTypeEdit(articleType.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
