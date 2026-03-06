import { ColumnDef, flexRender, RowData, Table as TanstackTable } from '@tanstack/react-table';
import { UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { useTranslation } from '@maas/core-translations';
import { AlertCircle, RefreshCw } from 'lucide-react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@maas/web-components';
import { CollectionToolbar, CollectionToolbarProps } from './collection-toolbar';
import { CollectionPagination } from './collection-pagination';
import { ApiCollectionResponse, ApiError, FieldQuery, GetCollectionQueryParams } from '@maas/core-api';
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
    options?: Omit<UseQueryOptions<ApiCollectionResponse<T>, ApiError>, 'queryKey'>
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
    filtersConfiguration: Omit<CollectionToolbarProps<T>, 'table' | 'showColumnSelector'> | undefined;
    isFetching: boolean;
    isError: boolean;
    error: ApiError | null;
    refetch: () => void;
}

/**
 * Props for renderLayout function
 */
export interface CollectionLayoutRenderProps<T> extends CollectionRenderProps<T> {
    toolbar: ReactNode;
    content: ReactNode;
    pagination: ReactNode;
}

interface Props<T, S> {
    columns: ColumnDef<T>[];
    filtersConfiguration?: Omit<CollectionToolbarProps<T>, 'table' | 'showColumnSelector'>;
    useLocationAsState?: boolean;
    useQueryFn: UseQueryTable<T, S>;
    queryFields?: FieldQuery<T>;
    staticParams?: S;
    showColumnSelector?: boolean;
    defaultPageSize?: number;
    defaultColumnFilters?: import('@tanstack/react-table').ColumnFiltersState;
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
    isFetching,
}: {
    table: TanstackTable<T>;
    showColumnSelector: boolean;
    filtersConfiguration?: Omit<CollectionToolbarProps<T>, 'table' | 'showColumnSelector'>;
    isFetching?: boolean;
}) {
    return (
        <CollectionToolbar
            table={table}
            showColumnSelector={showColumnSelector}
            isFetching={isFetching}
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
    isError,
    refetch,
}: {
    table: TanstackTable<T>;
    columns: ColumnDef<T>[];
    isError?: boolean;
    refetch?: () => void;
}) {
    const { t } = useTranslation();

    if (isError) {
        return (
            <div className="rounded-md border">
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                    <div className="bg-destructive/10 flex h-10 w-10 items-center justify-center rounded-full">
                        <AlertCircle className="text-destructive h-5 w-5" />
                    </div>
                    <p className="text-destructive text-sm">{t('table.failedToLoad')}</p>
                    {refetch && (
                        <button
                            onClick={() => refetch()}
                            className="text-primary hover:text-primary/80 inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
                        >
                            <RefreshCw className="h-3.5 w-3.5" />
                            {t('table.retry')}
                        </button>
                    )}
                </div>
            </div>
        );
    }

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
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className={cell.column.columnDef.meta?.className ?? ''}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                {t('common.noResults')}
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
    defaultPageSize,
    defaultColumnFilters,
    renderToolbar,
    renderContent,
    renderPagination,
    renderLayout,
}: Props<T, Q>) {
    const state = useCollectionState({ useLocationAsState, defaultPageSize, defaultColumnFilters });

    const { items, totalCount, isError, error, isFetching, refetch } = useCollectionQuery({
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
        isFetching,
        isError,
        error: error ?? null,
        refetch,
    };

    // Render each section (custom or default)
    const toolbar = renderToolbar ? (
        renderToolbar(renderProps)
    ) : (
        <DefaultToolbar
            table={table}
            showColumnSelector={showColumnSelector}
            filtersConfiguration={filtersConfiguration}
            isFetching={isFetching}
        />
    );

    const content = renderContent ? (
        renderContent(renderProps)
    ) : (
        <DefaultContent table={table} columns={columns} isError={isError} refetch={refetch} />
    );

    const pagination = renderPagination ? renderPagination(renderProps) : <DefaultPagination table={table} />;

    // Render layout (custom or default)
    if (renderLayout) {
        return renderLayout({
            ...renderProps,
            toolbar,
            content,
            pagination,
        });
    }

    return <DefaultLayout toolbar={toolbar} content={content} pagination={pagination} />;
}
