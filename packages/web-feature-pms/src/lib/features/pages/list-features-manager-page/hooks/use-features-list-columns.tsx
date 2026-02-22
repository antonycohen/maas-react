import { ColumnDef } from '@tanstack/react-table';
import { Feature } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router';
import { IconEdit, IconSparkles, IconTrash } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';

export function useFeaturesListColumns(): ColumnDef<Feature>[] {
    const routes = useRoutes();

    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
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
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'displayName',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Display Name" />,
            cell: ({ row }) => {
                return (
                    <Link to={routes.pmsFeatureEdit(row.original.id)} className="flex items-center gap-3">
                        <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                <IconSparkles className="h-5 w-5" />
                            </div>
                        </div>
                        <LongText className="max-w-48 underline">{row.getValue('displayName')}</LongText>
                    </Link>
                );
            },
            meta: { className: 'w-64' },
        },
        {
            accessorKey: 'lookupKey',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Lookup Key" />,
            cell: ({ row }) => <span className="font-mono text-xs">{row.getValue('lookupKey')}</span>,
            enableSorting: false,
        },
        {
            accessorKey: 'quotaConfig',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Quota" />,
            cell: ({ row }) => {
                const hasQuota = !!row.getValue('quotaConfig');
                return (
                    <Badge variant={hasQuota ? 'outline' : 'secondary'}>{hasQuota ? 'Has Quota' : 'No Quota'}</Badge>
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
                            label: 'Edit Feature',
                            icon: IconEdit,
                            linkTo: (feature: Feature) => routes.pmsFeatureEdit(feature.id),
                        },
                        {
                            label: 'Delete Feature',
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (feature: Feature) => routes.pmsFeatureEdit(feature.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
