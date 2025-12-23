import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface UseCollectionStateProps {
  useLocationAsState?: boolean;
}

export function useCollectionState({
  useLocationAsState = false,
}: UseCollectionStateProps = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [globalFilter, setGlobalFilter] = useState(() =>
    useLocationAsState ? searchParams.get('search') || '' : '',
  );
  const [rowSelection, setRowSelection] = useState({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      if (!useLocationAsState) return {};
      const visibility = searchParams.get('visibility');
      return visibility ? JSON.parse(visibility) : {};
    },
  );

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
    if (!useLocationAsState) return { pageIndex: 0, pageSize: 10 };
    return {
      pageIndex: Number(searchParams.get('page')) || 0,
      pageSize: Number(searchParams.get('pageSize')) || 10,
    };
  });

  // Sync state to URL
  useEffect(() => {
    if (!useLocationAsState) return;

    const params = new URLSearchParams();

    if (globalFilter) params.set('search', globalFilter);
    if (pagination.pageIndex > 0)
      params.set('page', String(pagination.pageIndex));
    if (pagination.pageSize !== 10)
      params.set('pageSize', String(pagination.pageSize));
    if (columnFilters.length > 0)
      params.set('filters', JSON.stringify(columnFilters));
    if (sorting.length > 0) params.set('sort', JSON.stringify(sorting));
    if (Object.keys(columnVisibility).length > 0)
      params.set('visibility', JSON.stringify(columnVisibility));

    setSearchParams(params, { replace: true });
  }, [
    useLocationAsState,
    globalFilter,
    pagination,
    columnFilters,
    sorting,
    columnVisibility,
    setSearchParams,
  ]);

  return {
    globalFilter,
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