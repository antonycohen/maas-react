import {keepPreviousData} from '@tanstack/react-query';
import {FieldQuery, QueryParams} from '@maas/core-api';
import {useMemo} from 'react';
import {ColumnFiltersState, PaginationState, SortingState} from '@tanstack/react-table';
import {CollectionToolbarProps} from '../collection-toolbar';
import {UseQueryTable} from '../collection';

interface UseCollectionQueryProps<T, S = undefined> {
  pagination: PaginationState;
  globalFilter: string;
  debouncedGlobalFilter: string;
  columnFilters: ColumnFiltersState;
  sorting?: SortingState;
  filtersConfiguration?: Omit<CollectionToolbarProps<T>, 'table' | 'showColumnSelector'>;
  useQueryFn: UseQueryTable<T, S>;
  queryFields?: FieldQuery<T>;
  staticParams?: S;
}

export function useCollectionQuery<T, Q = undefined>({
  pagination,
  globalFilter,
  debouncedGlobalFilter,
  columnFilters,
  sorting,
  filtersConfiguration,
  useQueryFn,
  queryFields,
  staticParams,
}: UseCollectionQueryProps<T, Q>) {
  const filters = useMemo(() => {
    const filters: QueryParams = {};
    const textFilter = filtersConfiguration?.textFilter;
    if (textFilter !== undefined) {
      filters[textFilter.queryParamName] = debouncedGlobalFilter;
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
    debouncedGlobalFilter,
  ]);

  const sort = useMemo(() => {
    if (sorting && sorting.length > 0) {
      const sortItem = sorting[0];
      return {
        field: sortItem.id as keyof T,
        direction: (sortItem.desc ? 'desc' : 'asc') as 'desc' | 'asc',
      };
    }
    return undefined;
  }, [sorting]);



  const staticParamsObj = (staticParams ?? {}) as Record<string, unknown>;
  const staticFilters = (staticParamsObj.filters ?? {}) as Record<string, unknown>;
  const otherStaticParams = { ...staticParamsObj } as Record<string, unknown>;
  Reflect.deleteProperty(otherStaticParams, 'filters');

  const { data } = useQueryFn(
    {
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      // merge static filters (defaults) with dynamic filters (overrides)
      filters: { ...(staticFilters ?? {}), ...(filters ?? {}) },
      fields: queryFields,
      // spread other static params at top level so hooks expecting top-level params receive them
      ...otherStaticParams,
      sort: sort
        ? {
          field: sort.field,
          direction: sort.direction,
        }
        : undefined,
    },
    {
      placeholderData: keepPreviousData,
    },
  );

  return {
    items: data?.data || [],
    totalCount: data?.pagination?.count || 0,
  };
}
