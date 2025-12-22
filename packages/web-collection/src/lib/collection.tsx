import {ColumnDef, flexRender, RowData} from '@tanstack/react-table';
import {UseQueryOptions, UseQueryResult} from '@tanstack/react-query';

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '@maas/web-components';
import {CollectionToolbar, CollectionToolbarProps,} from './collection-toolbar';
import {CollectionPagination} from './collection-pagination';
import {ApiCollectionResponse, ApiError, FieldQuery, GetCollectionQueryParams,} from '@maas/core-api';
import {useCollectionState} from './hooks/useCollectionState';
import {useCollectionQuery} from './hooks/useCollectionQuery';
import {useCollectionTable} from './hooks/useCollectionTable';

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    className: string;
  }
}

export type UseQueryTable<T, Q> = (
  params: GetCollectionQueryParams<T, Q>,
  options?: Omit<
    UseQueryOptions<ApiCollectionResponse<T>, ApiError>,
    'queryKey'
  >,
) => UseQueryResult<ApiCollectionResponse<T>, ApiError>;

interface Props<T, S> {
  columns: ColumnDef<T>[];
  filtersConfiguration?: Omit<CollectionToolbarProps<T>, 'table' | 'showColumnSelector'>;
  useLocationAsState?: boolean;
  useQueryFn: UseQueryTable<T, S>;
  queryFields?: FieldQuery<T>;
  staticParams?: S;
  showColumnSelector?: boolean;
}

export function Collection<T, Q = undefined>({
  columns,
  filtersConfiguration,
  useLocationAsState = false,
  useQueryFn,
  queryFields,
  staticParams = undefined as Q,
  showColumnSelector = false
}: Props<T, Q>) {
  const state = useCollectionState({ useLocationAsState });

  const { items, totalCount } = useCollectionQuery({
    pagination: state.pagination,
    globalFilter: state.globalFilter,
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

  return (
    <div className="space-y-4">
      <CollectionToolbar table={table} showColumnSelector={showColumnSelector} {...filtersConfiguration} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
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
                  );
                })}
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CollectionPagination table={table} />
    </div>
  );
}
