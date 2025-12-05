'use client';

import { Cross2Icon } from '@radix-ui/react-icons';
import { Table } from '@tanstack/react-table';
import { Button, Input } from '@maas/web-components';
import { ObjectDotNotation } from '@maas/core-utils';
import {
  CollectionFacetedFilter,
  CollectionFacetedFilterProps,
} from './collection-faceted-filter';
import { CollectionViewOptions } from './collection-view-options';

interface FacetedFilterConfiguration<TData>
  extends Omit<CollectionFacetedFilterProps<TData, unknown>, 'column'> {
  columnId: ObjectDotNotation<TData>;
  queryParamName: string;
}

interface TextFilterConfiguration {
  placeholder: string;
  queryParamName: string;
}

export interface CollectionToolbarProps<TData> {
  table: Table<TData>;
  textFilter?: TextFilterConfiguration;
  facetedFilters?: FacetedFilterConfiguration<TData>[];
}

export function CollectionToolbar<TData>({
  table,
  textFilter,
  facetedFilters,
}: CollectionToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        {textFilter && (
          <Input
            placeholder={textFilter.placeholder}
            value={
              (table.getState().globalFilter as string) ?? ''
            }
            onChange={(event) =>
              table.setGlobalFilter(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {facetedFilters && facetedFilters.length > 0 && (
          <div className="flex gap-x-2">
            {facetedFilters.map((filterConfig) => {
              const column = table.getColumn(filterConfig.columnId);
              return column ? (
                <CollectionFacetedFilter
                  key={filterConfig.columnId}
                  column={column}
                  title={filterConfig.title}
                  options={filterConfig.options}
                />
              ) : null;
            })}
          </div>
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <CollectionViewOptions table={table} />
    </div>
  );
}
