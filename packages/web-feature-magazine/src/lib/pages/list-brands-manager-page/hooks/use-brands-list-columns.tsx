import { ColumnDef } from '@tanstack/react-table';
import { Brand } from '@maas/core-api-models';
import { Badge, Button, Checkbox, LongText } from '@maas/web-components';
import {
  CollectionColumnHeader,
  CollectionRowActions,
} from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export function useBrandsListColumns(): ColumnDef<Brand>[] {
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
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <Button variant="link" className="underline" asChild>
            <Link to={`/brands/${row.original.id}`}>
              <LongText className="max-w-48">{row.getValue('name')}</LongText>
            </Link>
          </Button>
        );
      },
      meta: { className: 'w-48' },
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <LongText className="max-w-64">{row.getValue('description')}</LongText>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'isActive',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isActive = row.getValue('isActive');
        return (
          <Badge variant={isActive ? 'default' : 'secondary'}>
            {isActive ? 'Active' : 'Inactive'}
          </Badge>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'issueCount',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Issues" />
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('issueCount') ?? 0}</div>
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
              label: 'Edit Brand',
              icon: IconEdit,
              linkTo: (brand: Brand) => `/brands/${brand.id}`,
            },
            {
              label: 'Delete Brand',
              icon: IconTrash,
              group: 'danger',
              className: 'text-red-500!',
              linkTo: (brand: Brand) => `/brands/${brand.id}`,
            },
          ]}
        />
      ),
    },
  ];
}
