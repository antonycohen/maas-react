import { ColumnDef } from '@tanstack/react-table';
import { User } from '@maas/core-api-models';
import { Badge, Button, Checkbox, LongText } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router';
import { format } from 'date-fns';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export function useUsersListColumns(): ColumnDef<User>[] {
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
            id: 'fullName',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Name" />,
            cell: ({ row }) => {
                const { firstName, lastName } = row.original;
                const fullName = `${firstName} ${lastName}`;
                return (
                    <Button variant="link" className="underline" asChild>
                        <Link to={`/users/${row.original.id}`}>
                            <LongText className="max-w-36">{fullName}</LongText>
                        </Link>
                    </Button>
                );
            },
            meta: { className: 'w-36' },
        },
        {
            accessorKey: 'email',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Email" />,
            cell: ({ row }) => <div className="w-fit text-nowrap">{row.getValue('email')}</div>,
        },
        {
            accessorKey: 'phoneNumber',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Phone Number" />,
            cell: ({ row }) => <div>{row.getValue('phoneNumber')}</div>,
            enableSorting: false,
        },
        {
            accessorKey: 'roles',
            header: ({ column }) => <CollectionColumnHeader column={column} title="Role" />,
            cell: ({ row }) => {
                const roles = row.original.roles;
                return (
                    <div className="flex items-center gap-x-2">
                        <span className="text-sm capitalize">
                            {roles?.map((role) => {
                                return <Badge>{role}</Badge>;
                            })}
                        </span>
                    </div>
                );
            },
            filterFn: 'arrIncludesSome',
            enableSorting: false,
            enableHiding: false,
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
                            linkTo: (user: User) => `/users/${user.id}`,
                        },
                        {
                            label: 'Delete User',
                            icon: IconTrash,
                            group: 'danger',
                            className: 'text-red-500!',
                            linkTo: (user: User) => `/users/${user.id}`,
                        },
                    ]}
                />
            ),
        },
    ];
}
