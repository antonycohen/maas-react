import { ColumnDef } from '@tanstack/react-table';
import { User } from '@maas/core-api-models';
import { Button, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { useRoutes } from '@maas/core-workspace';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export function useUsersListColumns(): ColumnDef<User>[] {
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
            accessorKey: 'email',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Email" />,
            cell: ({ row }) => (
                <Button variant="link" className="underline" asChild>
                    <Link to={routes.userEdit(row.original.id ?? '')}>
                        <LongText className="max-w-36">{row.getValue('email')}</LongText>
                    </Link>
                </Button>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Registered Date" />,
            cell: ({ row }) => (
                <div className="w-fit text-nowrap">
                    {row.getValue('createdAt') ? format(row.getValue('createdAt'), 'dd MMM, yyyy') : ''}
                </div>
            ),
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <CollectionRowActions
                    row={row}
                    actions={[
                        {
                            label: 'Edit User',
                            icon: IconEdit,
                            linkTo: (user: User) => routes.userEdit(user.id ?? ''),
                        },
                        {
                            label: 'Delete User',
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (user: User) => routes.userEdit(user.id ?? ''),
                        },
                    ]}
                />
            ),
        },
    ];
}
