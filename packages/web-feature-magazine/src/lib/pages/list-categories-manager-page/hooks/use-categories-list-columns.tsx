import { ColumnDef } from '@tanstack/react-table';
import { Category } from '@maas/core-api-models';
import { Button, Checkbox, LongText } from '@maas/web-components';
import {
  CollectionColumnHeader,
  CollectionRowActions,
} from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export function useCategoriesListColumns(): ColumnDef<Category>[] {
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
            <Link to={`/categories/${row.original.id}`}>
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
      id: 'parent',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Parent" />
      ),
      cell: ({ row }) => {
        const parent = row.original.parent;
        return parent ? (
          <Button variant="link" className="underline" asChild>
            <Link to={`/categories/${parent.id}`}>
              <LongText className="max-w-36">{parent.name}</LongText>
            </Link>
          </Button>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'childrenCount',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Children" />
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('childrenCount') ?? 0}</div>
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
              label: 'Edit Category',
              icon: IconEdit,
              linkTo: (category: Category) => `/categories/${category.id}`,
            },
            {
              label: 'Delete Category',
              icon: IconTrash,
              group: 'danger',
              className: 'text-red-500!',
              linkTo: (category: Category) => `/categories/${category.id}`,
            },
          ]}
        />
      ),
    },
  ];
}
