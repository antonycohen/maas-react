import { ColumnDef } from '@tanstack/react-table';
import { Article } from '@maas/core-api-models';
import { Badge, Checkbox, LongText } from '@maas/web-components';
import {
  CollectionColumnHeader,
  CollectionRowActions,
} from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router-dom';
import { IconEdit, IconTrash } from '@tabler/icons-react';

export function useArticlesListColumns(): ColumnDef<Article>[] {
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
      id: 'featuredImage',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Image" />
      ),
      cell: ({ row }) => {
        const image = row.original.featuredImage || row.original.cover;
        const imageUrl = image?.url || image?.base64;
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
          <Link to={`/articles/${row.original.id}`} className="underline">
            <LongText className="max-w-48">{row.getValue('title')}</LongText>
          </Link>
        );
      },
      meta: { className: 'w-48' },
    },
    {
      id: 'issue',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Issue" />
      ),
      cell: ({ row }) => {
        const issue = row.original.issue;
        return issue ? (
          <Link to={`/issues/${issue.id}`} className="underline">
            <LongText className="max-w-32">{issue.title}</LongText>
          </Link>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
      enableSorting: false,
    },
    {
      id: 'folder',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Folder" />
      ),
      cell: ({ row }) => {
        const folder = row.original.folder;
        return folder ? (
          <LongText className="max-w-24">{folder.name}</LongText>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'type',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Type" />
      ),
      cell: ({ row }) => {
        const type = row.getValue('type') as string | null;
        return type ? (
          <Badge variant="outline">{type}</Badge>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
      enableSorting: false,
    },
    {
      accessorKey: 'isPublished',
      header: ({ column }) => (
        <CollectionColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const isPublished = row.getValue('isPublished');
        const isFeatured = row.original.isFeatured;
        return (
          <div className="flex gap-1">
            <Badge variant={isPublished ? 'default' : 'secondary'}>
              {isPublished ? 'Published' : 'Draft'}
            </Badge>
            {isFeatured && <Badge variant="outline">Featured</Badge>}
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
              label: 'Edit Article',
              icon: IconEdit,
              linkTo: (article: Article) => `/articles/${article.id}`,
            },
            {
              label: 'Delete Article',
              icon: IconTrash,
              group: 'danger',
              className: 'text-red-500!',
              linkTo: (article: Article) => `/articles/${article.id}`,
            },
          ]}
        />
      ),
    },
  ];
}
