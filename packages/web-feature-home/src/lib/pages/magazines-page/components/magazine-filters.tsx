import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@maas/web-components';
import { cn } from '@maas/core-utils';
import { Table } from '@tanstack/react-table';

interface MagazineFiltersProps<T> {
  table: Table<T>;
}

export function MagazineFilters<T>({ table }: MagazineFiltersProps<T>) {
  if (!table) {
    return null;
  }
  const categoryColumn = table.getColumn('term');
  const activeCategory = (categoryColumn?.getFilterValue() as string) || 'all';

  const onCategoryChange = (val: string) => {
    if (val === 'all') {
      categoryColumn?.setFilterValue(undefined);
    } else {
      categoryColumn?.setFilterValue(val);
    }
  };

  const categories = [
    { id: 'all', label: 'Tout' },
    { id: 'tangente', label: 'Tangente numéros' },
    { id: 'hors-series', label: 'Hors-séries' },
  ];

  const setSortOrder = (order: string) => {
    if (order === 'recent') {
      table.getColumn('publishedAt')?.toggleSorting(true); // desc
    } else if (order === 'oldest') {
      table.getColumn('publishedAt')?.toggleSorting(false); // asc
    }
  };

  const sorting = table.getState().sorting;
  const currentSort = sorting[0];
  const sortOrder =
    currentSort?.id === 'publishedAt'
      ? currentSort.desc
        ? 'recent'
        : 'oldest'
      : 'recent';

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:flex justify-between items-start w-full h-[40px]">
        {/* Left: Category Filter */}
        <div className="flex items-center gap-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'flex items-center px-[12px] py-[4px] h-[40px] rounded-[4px] text-[14px] leading-[20px] tracking-[-0.07px] whitespace-nowrap transition-colors',
                activeCategory === category.id
                  ? 'border-2 border-black text-black font-normal'
                  : 'border border-[#e0e0e0] text-black/50 font-normal hover:bg-gray-50',
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Right: Sort Filter */}
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-black/50 font-bold uppercase tracking-[0.26px]">
            Trier par
          </span>
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-[180px] h-[40px] px-3 py-2 text-[14px] bg-white border border-[#e0e0e0] rounded-[4px] focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Les plus récents</SelectItem>
              <SelectItem value="oldest">Les plus anciens</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mobile View */}
      <div className="flex md:hidden w-full gap-[12px]">
        <div className="flex-1">
          <Select value={activeCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full h-[40px] bg-[#f5f5f5] border-[#e0e0e0] rounded-[4px] px-[12px] py-[4px] text-[14px] text-black">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full h-[40px] bg-[#f5f5f5] border-[#e0e0e0] rounded-[4px] px-[12px] py-[4px] text-[14px] text-black">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Les + récents</SelectItem>
              <SelectItem value="oldest">Les + anciens</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  );
}
