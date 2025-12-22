import { ColumnDef } from '@tanstack/react-table';
import { Issue } from '@maas/core-api-models';
import { Checkbox, LongText } from '@maas/web-components';
import {
  CollectionColumnHeader,
  CollectionRowActions,
} from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function useIssuesListColumns(): ColumnDef<Issue>[] {
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
      id: 'cover',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Cover" />
      ),
      cell: ({ row }) => {
        const cover = row.original.cover;
        const imageUrl = cover?.url || cover?.base64;
        return imageUrl ? (
          <img
            src={imageUrl}
            alt={row.original.title}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded bg-muted" />
        );
      },
      enableSorting: false,
      meta: { className: 'w-16' },
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
        return (
          <Link to={`${workspaceBaseUrl}/issues/${row.original.id}/info`} className={'underline'}>
            <LongText className="max-w-48">{row.getValue('title')}</LongText>
          </Link>
        );
      },
      meta: { className: 'w-48' },
    },
    {
      accessorKey: 'issueNumber',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Issue #" />
      ),
      cell: ({ row }) => (
        <span>{row.getValue('issueNumber') || '—'}</span>
      ),
      meta: { className: 'w-24' },
    },
    {
      id: 'brand',
      accessorFn: (row) => row.brand?.id,
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Brand" />
      ),
      cell: ({ row }) => {
        const brand = row.original.brand;
        return brand ? (
          <Link to={`${workspaceBaseUrl}/brands/${brand.id}`} className="underline">
            <LongText className="max-w-36">{brand.name}</LongText>
          </Link>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
      enableSorting: false,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: 'isPublished',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Published" />
      ),
      cell: ({ row }) => (
        <span className={row.getValue('isPublished') ? 'text-green-600' : 'text-muted-foreground'}>
          {row.getValue('isPublished') ? 'Yes' : 'No'}
        </span>
      ),
      meta: { className: 'w-24' },
    },
    {
      accessorKey: 'folderCount',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Folders" />
      ),
      cell: ({ row }) => (
        <div className="text-center">{row.getValue('folderCount') ?? 0}</div>
      ),
      enableSorting: false,
      meta: { className: 'w-20' },
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
      meta: { className: 'w-20' },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <CollectionRowActions
          row={row}
          actions={[
            {
              label: 'Edit Issue',
              icon: IconEdit,
              linkTo: (issue: Issue) => `/issues/${issue.id}/info`,
            },
            {
              label: 'Delete Issue',
              icon: IconTrash,
              group: 'danger',
              className: 'text-red-500!',
              linkTo: (issue: Issue) => `/issues/${issue.id}/info`,
            },
          ]}
        />
      ),
    },
  ];
}
