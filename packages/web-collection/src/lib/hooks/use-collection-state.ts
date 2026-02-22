import { ColumnFiltersState, PaginationState, SortingState, VisibilityState } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router';

interface UseCollectionStateProps {
    useLocationAsState?: boolean;
    searchDebounceMs?: number;
    defaultPageSize?: number;
}

export function useCollectionState({
    useLocationAsState = false,
    searchDebounceMs = 300,
    defaultPageSize = 10,
}: UseCollectionStateProps = {}) {
    const [searchParams, setSearchParams] = useSearchParams();
    const { pathname } = useLocation();

    const [globalFilter, setGlobalFilter] = useState(() =>
        useLocationAsState ? searchParams.get('search') || '' : ''
    );
    const [debouncedGlobalFilter, setDebouncedGlobalFilter] = useState(globalFilter);
    const [rowSelection, setRowSelection] = useState({});

    // Debounce globalFilter for API queries
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedGlobalFilter(globalFilter);
        }, searchDebounceMs);

        return () => clearTimeout(timer);
    }, [globalFilter, searchDebounceMs]);

    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
        if (!useLocationAsState) return {};
        const visibility = searchParams.get('visibility');
        return visibility ? JSON.parse(visibility) : {};
    });

    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
        if (!useLocationAsState) return [];
        const filters = searchParams.get('filters');
        return filters ? JSON.parse(filters) : [];
    });

    const [sorting, setSorting] = useState<SortingState>(() => {
        if (!useLocationAsState) return [];
        const sort = searchParams.get('sort');
        return sort ? JSON.parse(sort) : [];
    });

    const [pagination, setPagination] = useState<PaginationState>(() => {
        if (!useLocationAsState) return { pageIndex: 0, pageSize: defaultPageSize };
        return {
            pageIndex: Number(searchParams.get('page')) || 0,
            pageSize: Number(searchParams.get('pageSize')) || defaultPageSize,
        };
    });

    // Reset collection state when the pathname changes (e.g. switching categories)
    useEffect(() => {
        if (!useLocationAsState) return;
        setPagination({ pageIndex: 0, pageSize: defaultPageSize });
        setGlobalFilter('');
        setColumnFilters([]);
        setSorting([]);
    }, [pathname]);

    // Sync state to URL
    useEffect(() => {
        if (!useLocationAsState) return;

        const params = new URLSearchParams();

        if (debouncedGlobalFilter) params.set('search', debouncedGlobalFilter);
        if (pagination.pageIndex > 0) params.set('page', String(pagination.pageIndex));
        if (pagination.pageSize !== defaultPageSize) params.set('pageSize', String(pagination.pageSize));
        if (columnFilters.length > 0) params.set('filters', JSON.stringify(columnFilters));
        if (sorting.length > 0) params.set('sort', JSON.stringify(sorting));
        if (Object.keys(columnVisibility).length > 0) params.set('visibility', JSON.stringify(columnVisibility));

        setSearchParams(params, { replace: true });
    }, [
        useLocationAsState,
        debouncedGlobalFilter,
        pagination,
        columnFilters,
        sorting,
        columnVisibility,
        setSearchParams,
    ]);

    return {
        globalFilter,
        debouncedGlobalFilter,
        setGlobalFilter,
        rowSelection,
        setRowSelection,
        columnVisibility,
        setColumnVisibility,
        columnFilters,
        setColumnFilters,
        sorting,
        setSorting,
        pagination,
        setPagination,
    };
}
