import { ColumnDef } from '@tanstack/react-table';
import { Enum } from '@maas/core-api-models';
import { Checkbox, LongText } from '@maas/web-components';
import {
  CollectionColumnHeader,
  CollectionRowActions,
} from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function useEnumsListColumns(): ColumnDef<Enum>[] {
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      meta: {
        className: cn(
          'sticky md:table-cell left-0 z-10 rounded-tl',
          'transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted pr-2! md:pr-0',
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
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <Link
            to={`${workspaceBaseUrl}/enums/${row.original.id}`}
            className="underline"
          >
            <LongText className="max-w-48">{row.getValue('name')}</LongText>
          </Link>
        );
      },
      meta: { className: 'w-48' },
    },
    {
      accessorKey: 'values',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Values" />
      ),
      cell: ({ row }) => {
        const values = row.original.values;
        const count = values?.length ?? 0;
        return (
          <div>
            {count} {count === 1 ? 'value' : 'values'}
          </div>
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
              label: 'Edit Enum',
              icon: IconEdit,
              linkTo: (enumItem: Enum) =>
                `${workspaceBaseUrl}/enums/${enumItem.id}`,
            },
            {
              label: 'Delete Enum',
              icon: IconTrash,
              group: 'danger',
              className: 'text-red-500!',
              linkTo: (enumItem: Enum) =>
                `${workspaceBaseUrl}/enums/${enumItem.id}`,
            },
          ]}
        />
      ),
    },
  ];
}
