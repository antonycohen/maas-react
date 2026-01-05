import { ColumnDef } from '@tanstack/react-table';
import { Folder } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import {
  CollectionColumnHeader,
  CollectionRowActions,
} from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function useFoldersListColumns(): ColumnDef<Folder>[] {
  const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

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
            to={`${currentWorkspaceBaseUrl}/folders/${row.original.id}/info`}
            className="underline"
          >
            <LongText className="max-w-48">{row.getValue('name')}</LongText>
          </Link>
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
      accessorKey: 'isPublished',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isPublished = row.getValue('isPublished');
        return (
          <Badge variant={isPublished ? 'default' : 'secondary'}>
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'articleCount',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Articles" />
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('articleCount') ?? 0}</div>
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
              label: 'Edit Folder',
              icon: IconEdit,
              linkTo: (folder: Folder) =>
                `${currentWorkspaceBaseUrl}/folders/${folder.id}/info`,
            },
            {
              label: 'Delete Folder',
              icon: IconTrash,
              group: 'danger',
              className: 'text-red-500!',
              linkTo: (folder: Folder) =>
                `${currentWorkspaceBaseUrl}/folders/${folder.id}/info`,
            },
          ]}
        />
      ),
    },
  ];
}
