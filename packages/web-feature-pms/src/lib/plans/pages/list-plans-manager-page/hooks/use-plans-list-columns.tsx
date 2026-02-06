import { ColumnDef } from '@tanstack/react-table';
import { Plan } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconLayoutGrid, IconTrash } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function usePlansListColumns(): ColumnDef<Plan>[] {
    const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

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
            accessorKey: 'name',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Name" />,
            cell: ({ row }) => {
                return (
                    <Link
                        to={`${currentWorkspaceBaseUrl}/pms/plans/${row.original.id}/info`}
                        className="flex items-center gap-3"
                    >
                        <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                <IconLayoutGrid className="h-5 w-5" />
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
            header: ({ column }) => <CollectionColumnHeader column={column} title="Description" />,
            cell: ({ row }) => <LongText className="max-w-64">{row.getValue('description')}</LongText>,
            enableSorting: false,
        },
        {
            accessorKey: 'active',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Status" />,
            cell: ({ row }) => {
                const active = row.getValue('active');
                return <Badge variant={active ? 'default' : 'secondary'}>{active ? 'Active' : 'Inactive'}</Badge>;
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
                            label: 'Edit Plan',
                            icon: IconEdit,
                            linkTo: (plan: Plan) => `${currentWorkspaceBaseUrl}/pms/plans/${plan.id}/info`,
                        },
                        {
                            label: 'Delete Plan',
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (plan: Plan) => `${currentWorkspaceBaseUrl}/pms/plans/${plan.id}/info`,
                        },
                    ]}
                />
            ),
        },
    ];
}
