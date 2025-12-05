import { keepPreviousData } from '@tanstack/react-query';
import { FieldQuery, QueryParams } from '@maas/core-api';
import { useMemo } from 'react';
import { ColumnFiltersState, PaginationState } from '@tanstack/react-table';
import { CollectionToolbarProps } from '../collection-toolbar';
import { UseQueryTable } from '../collection';

interface UseCollectionQueryProps<T> {
  pagination: PaginationState;
  globalFilter: string;
  columnFilters: ColumnFiltersState;
  filtersConfiguration?: Omit<CollectionToolbarProps<T>, 'table'>;
  useQueryFn: UseQueryTable<T>;
  queryFields?: FieldQuery<T>
}

export function useCollectionQuery<T>({
  pagination,
  globalFilter,
  columnFilters,
  filtersConfiguration,
  useQueryFn,
  queryFields
}: UseCollectionQueryProps<T>) {
  const filters = useMemo(() => {
    const filters: QueryParams = {};
    const textFilter = filtersConfiguration?.textFilter;
    if (textFilter !== undefined) {
      filters[textFilter.queryParamName] = globalFilter;
    }
    filtersConfiguration?.facetedFilters?.forEach((facetedFilter) => {
      filters[facetedFilter.queryParamName] = columnFilters.find(
        (columnFilter) => columnFilter.id === facetedFilter.columnId,
      )?.value;
    });
    return filters;
  }, [
    columnFilters,
    filtersConfiguration?.facetedFilters,
    filtersConfiguration?.textFilter,
    globalFilter,
  ]);

  const { data } = useQueryFn(
    {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      filters,
      fields: queryFields
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  return {
    items: data?.data || [],
  };
}
