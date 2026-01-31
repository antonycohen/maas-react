import {
  ColumnDef,
  flexRender,
  RowData,
  Table as TanstackTable,
} from '@tanstack/react-table';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { ReactNode } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@maas/web-components';
import {
  CollectionToolbar,
  CollectionToolbarProps,
} from './collection-toolbar';
import { CollectionPagination } from './collection-pagination';
import {
  ApiCollectionResponse,
  ApiError,
  FieldQuery,
  GetCollectionQueryParams,
} from '@maas/core-api';
import { useCollectionState } from './hooks/use-collection-state';
import { useCollectionQuery } from './hooks/use-collection-query';
import { useCollectionTable } from './hooks/use-collection-table';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className?: string;
    ascendingLabel?: string;
    descendingLabel?: string;
  }
}

export type UseQueryTable<T, Q> = (
  params: GetCollectionQueryParams<T, Q>,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<T>, ApiError>,
    'queryKey'
  >,
) => UseQueryResult<ApiCollectionResponse<T>, ApiError>;

/**
 * State returned by useCollectionState hook
 */
export type CollectionState = ReturnType<typeof useCollectionState>;

/**
 * Props passed to render functions
 */
export interface CollectionRenderProps<T> {
  items: T[];
  totalCount: number;
  table: TanstackTable<T>;
  state: CollectionState;
  filtersConfiguration:
    | Omit<CollectionToolbarProps<T>, 'table' | 'showColumnSelector'>
    | undefined;
}

/**
 * Props for renderLayout function
 */
export interface CollectionLayoutRenderProps<
  T,
> extends CollectionRenderProps<T> {
  toolbar: ReactNode;
  content: ReactNode;
  pagination: ReactNode;
}

interface Props<T, S> {
  columns: ColumnDef<T>[];
  filtersConfiguration?: Omit<
    CollectionToolbarProps<T>,
    'table' | 'showColumnSelector'
  >;
  useLocationAsState?: boolean;
  useQueryFn: UseQueryTable<T, S>;
  queryFields?: FieldQuery<T>;
  staticParams?: S;
  showColumnSelector?: boolean;
  /**
   * Custom toolbar renderer. Receives items, table instance, and state.
   * Default: CollectionToolbar with search and faceted filters
   */
  renderToolbar?: (props: CollectionRenderProps<T>) => ReactNode;
  /**
   * Custom content renderer. Use this to render a grid, cards, or any custom layout.
   * Default: Table with rows and cells
   */
  renderContent?: (props: CollectionRenderProps<T>) => ReactNode;
  /**
   * Custom pagination renderer.
   * Default: CollectionPagination with page size selector and navigation
   */
  renderPagination?: (props: CollectionRenderProps<T>) => ReactNode;
  /**
   * Custom layout wrapper. Receives toolbar, content, and pagination as ReactNodes.
   * Use this to control the overall structure and spacing.
   * Default: Vertical stack with space-y-4
   */
  renderLayout?: (props: CollectionLayoutRenderProps<T>) => ReactNode;
}

/**
 * Default toolbar renderer
 */
function DefaultToolbar<T>({
  table,
  showColumnSelector,
  filtersConfiguration,
}: {
  table: TanstackTable<T>;
  showColumnSelector: boolean;
  filtersConfiguration?: Omit<
    CollectionToolbarProps<T>,
    'table' | 'showColumnSelector'
  >;
}) {
  return (
    <CollectionToolbar
      table={table}
      showColumnSelector={showColumnSelector}
      {...filtersConfiguration}
    />
  );
}

/**
 * Default content renderer (table view)
 */
function DefaultContent<T>({
  table,
  columns,
}: {
  table: TanstackTable<T>;
  columns: ColumnDef<T>[];
}) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  colSpan={header.colSpan}
                  className={header.column.columnDef.meta?.className ?? ''}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cell.column.columnDef.meta?.className ?? ''}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

/**
 * Default pagination renderer
 */
function DefaultPagination<T>({ table }: { table: TanstackTable<T> }) {
  return <CollectionPagination table={table} />;
}

/**
 * Default layout renderer
 */
function DefaultLayout({
  toolbar,
  content,
  pagination,
}: {
  toolbar: ReactNode;
  content: ReactNode;
  pagination: ReactNode;
}) {
  return (
    <div className="space-y-4">
      {toolbar}
      {content}
      {pagination}
    </div>
  );
}

export function Collection<T, Q = undefined>({
  columns,
  filtersConfiguration,
  useLocationAsState = false,
  useQueryFn,
  queryFields,
  staticParams = undefined as Q,
  showColumnSelector = false,
  renderToolbar,
  renderContent,
  renderPagination,
  renderLayout,
}: Props<T, Q>) {
  const state = useCollectionState({ useLocationAsState });

  const { items, totalCount } = useCollectionQuery({
    pagination: state.pagination,
    globalFilter: state.globalFilter,
    debouncedGlobalFilter: state.debouncedGlobalFilter,
    columnFilters: state.columnFilters,
    sorting: state.sorting,
    filtersConfiguration,
    useQueryFn,
    queryFields,
    staticParams,
  });

  const table = useCollectionTable({
    items,
    columns,
    totalCount: totalCount,
    ...state,
  });

  // Shared props for all render functions
  const renderProps: CollectionRenderProps<T> = {
    items,
    totalCount,
    table,
    state,
    filtersConfiguration,
  };

  // Render each section (custom or default)
  const toolbar = renderToolbar ? (
    renderToolbar(renderProps)
  ) : (
    <DefaultToolbar
      table={table}
      showColumnSelector={showColumnSelector}
      filtersConfiguration={filtersConfiguration}
    />
  );

  const content = renderContent ? (
    renderContent(renderProps)
  ) : (
    <DefaultContent table={table} columns={columns} />
  );

  const pagination = renderPagination ? (
    renderPagination(renderProps)
  ) : (
    <DefaultPagination table={table} />
  );

  // Render layout (custom or default)
  if (renderLayout) {
    return renderLayout({
      ...renderProps,
      toolbar,
      content,
      pagination,
    });
  }

  return (
    <DefaultLayout
      toolbar={toolbar}
      content={content}
      pagination={pagination}
    />
  );
}
