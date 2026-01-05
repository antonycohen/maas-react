import { Table as TanstackTable } from '@tanstack/react-table';
import {
  Button,
  Checkbox,
  Pagination,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@maas/web-components';
import { IconFilter, IconX } from '@tabler/icons-react';
import { CollectionRenderProps } from '@maas/web-collection';
import { Article } from '@maas/core-api-models';
import { ReactNode } from 'react';
interface FacetedFilterConfig {
  columnId: string;
  title?: string;
  options: { label: string; value: string }[];
}
interface ContentFilterProps<T> {
  table: TanstackTable<T>;
  facetedFilters?: FacetedFilterConfig[];
  resetLabel?: string;
  className?: string;
}
/**
 * Reusable content filter sidebar component
 * Uses table column state via setFilterValue
 */
export function ContentFilter<T>({
                            table,
                            facetedFilters,
                            sortingTitle = 'Afficher par',
                            resetLabel = 'Réinitialiser',
                            className,
                          }: ContentFilterProps<T> & { sortingTitle?: string }) {
  // Get sorting options from columns with enableSorting and meta labels
  const sortingOptions: { columnId: string; label: string; desc: boolean }[] = [];
  table.getAllColumns().forEach((column) => {
    if (column.getCanSort()) {
      const meta = column.columnDef.meta as { descendingLabel?: string; ascendingLabel?: string } | undefined;
      if (meta?.descendingLabel) {
        sortingOptions.push({ columnId: column.id, label: meta.descendingLabel, desc: true });
      }
      if (meta?.ascendingLabel) {
        sortingOptions.push({ columnId: column.id, label: meta.ascendingLabel, desc: false });
      }
    }
  });
  // Get current sorting state
  const currentSort = table.getState().sorting[0];
  const getActiveSortKey = () => {
    if (!currentSort) return null;
    return `${currentSort.id}-${currentSort.desc ? 'desc' : 'asc'}`;
  };
  const activeSortKey = getActiveSortKey();
  // Check if any filter is active
  const hasActiveFilters = facetedFilters?.some((filter) => {
    const column = table.getColumn(filter.columnId);
    const filterValue = column?.getFilterValue() as string[] | undefined;
    return filterValue && filterValue.length > 0;
  }) ?? false;
  const hasSorting = currentSort !== undefined;
  const handleReset = () => {
    // Reset filters
    facetedFilters?.forEach((filter) => {
      const column = table.getColumn(filter.columnId);
      column?.setFilterValue(undefined);
    });
    // Reset sorting
    table.resetSorting();
  };
  const hasSortingOptions = sortingOptions.length > 0;
  const hasFilters = facetedFilters && facetedFilters.length > 0;
  if (!hasSortingOptions && !hasFilters) {
    return null;
  }
  return (
    <aside
      className={
        className ?? 'sticky top-0 flex w-[290px] shrink-0 flex-col gap-6 pr-5'
      }
    >
      {/* Sorting Section */}
      {hasSortingOptions && (
        <div className="flex flex-col gap-5">
          <h3 className="font-body text-[13px] font-bold uppercase leading-4 tracking-[0.26px] text-black/50">
            {sortingTitle}
          </h3>
          <div className="flex flex-col gap-3">
            {sortingOptions.map((option) => {
              const sortKey = `${option.columnId}-${option.desc ? 'desc' : 'asc'}`;
              const isActive = activeSortKey === sortKey;
              const handleSortChange = (checked: boolean) => {
                if (checked) {
                  const column = table.getColumn(option.columnId);
                  column?.toggleSorting(option.desc);
                }
              };
              return (
                <label
                  key={sortKey}
                  className="flex cursor-pointer items-start gap-3"
                >
                  <Checkbox
                    checked={isActive}
                    onCheckedChange={(checked) => handleSortChange(checked === true)}
                  />
                  <span className="font-body text-sm font-normal leading-5 tracking-[-0.07px] text-black">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
      {/* Faceted Filters Section */}
      {hasFilters && facetedFilters.map((filter, index) => {
        const column = table.getColumn(filter.columnId);
        const selectedValues = new Set(
          column?.getFilterValue() as string[] | undefined,
        );
        const handleChange = (value: string, checked: boolean) => {
          if (checked) {
            selectedValues.add(value);
          } else {
            selectedValues.delete(value);
          }
          const filterValues = Array.from(selectedValues);
          column?.setFilterValue(
            filterValues.length ? filterValues : undefined,
          );
        };
        return (
          <div key={filter.columnId}>
            {(index > 0 || hasSortingOptions) && <div className="mb-6 h-px w-full bg-[#e6eaeb]" />}
            <div className="flex flex-col gap-5">
              {filter.title && (
                <h3 className="font-body text-[13px] font-bold uppercase leading-4 tracking-[0.26px] text-black/50">
                  {filter.title}
                </h3>
              )}
              <div className="flex flex-col gap-3">
                {filter.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3"
                  >
                    <Checkbox
                      checked={selectedValues.has(option.value)}
                      onCheckedChange={(checked) =>
                        handleChange(option.value, checked === true)
                      }
                    />
                    <span className="font-body text-sm font-normal leading-5 tracking-[-0.07px] text-black">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
      })}
      {(hasActiveFilters || hasSorting) && (
        <>
          <div className="h-px w-full bg-[#e6eaeb]" />
          <Button variant="outline" onClick={handleReset} className="w-full">
            <IconX className="mr-2 h-5 w-5" />
            {resetLabel}
          </Button>
        </>
      )}
    </aside>
  );
}
export const renderMagazineCollectionToolbar = ({
  table,
  filtersConfiguration,
}: CollectionRenderProps<Article>) => (
  <>
    {/* Mobile Filter Trigger */}
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2">
            <IconFilter className="h-4 w-4" />
            Filtrer et trier
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] overflow-y-auto px-5">
          <SheetHeader className="mb-6 text-left">
            <SheetTitle>Filtres</SheetTitle>
          </SheetHeader>
          <ContentFilter
            table={table}
            facetedFilters={filtersConfiguration?.facetedFilters}
            className="flex flex-col gap-6"
          />
        </SheetContent>
      </Sheet>
    </div>
    {/* Desktop Sidebar */}
    <div className="hidden md:block">
      <ContentFilter
        table={table}
        facetedFilters={filtersConfiguration?.facetedFilters}
      />
    </div>
  </>
);
export const renderMagazineCollectionLayout = ({
  toolbar,
  content,
  pagination,
}: {
  toolbar: ReactNode;
  content: ReactNode;
  pagination: ReactNode;
}) => (
  <div className="flex flex-col gap-5 md:flex-row">
    {/* Sidebar */}
    {toolbar}
    {/* Main Content */}
    <div className="flex min-w-0 flex-1 flex-col gap-10">
      {content}
      {pagination}
    </div>
  </div>
);
export const renderMagazineCollectionPagination = ({
                                   state,
                                   totalCount,
                                 }: CollectionRenderProps<Article>) => {
  const totalPages = Math.ceil(totalCount / state.pagination.pageSize);
  return (
    <Pagination
      currentPage={state.pagination.pageIndex}
      totalPages={totalPages}
      onPageChange={(page) =>
        state.setPagination({ ...state.pagination, pageIndex: page })
      }
    />
  );
};
