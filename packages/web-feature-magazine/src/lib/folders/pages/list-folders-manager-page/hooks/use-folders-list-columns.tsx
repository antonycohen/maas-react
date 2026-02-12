import { ColumnDef } from '@tanstack/react-table';
import { Folder } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconFolder, IconTrash } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export function useFoldersListColumns(): ColumnDef<Folder>[] {
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
            accessorKey: 'name',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.name')} />,
            cell: ({ row }) => {
                const cover = row.original.cover;
                return (
                    <Link
                        to={`${currentWorkspaceBaseUrl}/folders/${row.original.id}/info`}
                        className="flex items-center gap-3"
                    >
                        <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                            {cover?.url ? (
                                <img src={cover.url} alt="" className="h-full w-full object-cover" />
                            ) : (
                                <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                    <IconFolder className="h-5 w-5" />
                                </div>
                            )}
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
            accessorKey: 'isPublished',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.status')} />,
            cell: ({ row }) => {
                const isPublished = row.getValue('isPublished');
                return (
                    <Badge variant={isPublished ? 'default' : 'secondary'}>
                        {isPublished ? t('status.published') : t('status.draft')}
                    </Badge>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'articleCount',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('articles.title')} />,
            cell: ({ row }) => <div className="text-center">{row.getValue('articleCount') ?? 0}</div>,
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <CollectionRowActions
                    row={row}
                    actions={[
                        {
                            label: t('folders.edit'),
                            icon: IconEdit,
                            linkTo: (folder: Folder) => `${currentWorkspaceBaseUrl}/folders/${folder.id}/info`,
                        },
                        {
                            label: t('folders.delete'),
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (folder: Folder) => `${currentWorkspaceBaseUrl}/folders/${folder.id}/info`,
                        },
                    ]}
                />
            ),
        },
    ];
}
