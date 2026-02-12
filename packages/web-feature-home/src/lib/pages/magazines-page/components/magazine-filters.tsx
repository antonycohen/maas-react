import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@maas/web-components';
import { cn } from '@maas/core-utils';
import { useTranslation } from '@maas/core-translations';
import { Table } from '@tanstack/react-table';

interface MagazineFiltersProps<T> {
    table: Table<T>;
}

export function MagazineFilters<T>({ table }: MagazineFiltersProps<T>) {
    const { t } = useTranslation();
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
        { id: 'all', label: t('home.all') },
        { id: 'tangente', label: t('home.tangentNumbers') },
        { id: 'hors-series', label: t('home.specialIssues') },
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
    const sortOrder = currentSort?.id === 'publishedAt' ? (currentSort.desc ? 'recent' : 'oldest') : 'recent';

    return (
        <>
            {/* Desktop View */}
            <div className="hidden h-[40px] w-full items-start justify-between md:flex">
                {/* Left: Category Filter */}
                <div className="flex items-center gap-1">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => onCategoryChange(category.id)}
                            className={cn(
                                'flex h-[40px] items-center rounded-[4px] px-[12px] py-[4px] text-[14px] leading-[20px] tracking-[-0.07px] whitespace-nowrap transition-colors',
                                activeCategory === category.id
                                    ? 'border-2 border-black font-normal text-black'
                                    : 'border border-[#e0e0e0] font-normal text-black/50 hover:bg-gray-50'
                            )}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Right: Sort Filter */}
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold tracking-[0.26px] text-black/50 uppercase">
                        {t('home.sortBy')}
                    </span>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="h-[40px] w-[180px] rounded-[4px] border border-[#e0e0e0] bg-white px-3 py-2 text-[14px] focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder={t('home.select')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">{t('home.mostRecent')}</SelectItem>
                            <SelectItem value="oldest">{t('home.oldest')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Mobile View */}
            <div className="flex w-full gap-[12px] md:hidden">
                <div className="flex-1">
                    <Select value={activeCategory} onValueChange={onCategoryChange}>
                        <SelectTrigger className="h-[40px] w-full rounded-[4px] border-[#e0e0e0] bg-[#f5f5f5] px-[12px] py-[4px] text-[14px] text-black">
                            <SelectValue placeholder={t('home.category')} />
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
                        <SelectTrigger className="h-[40px] w-full rounded-[4px] border-[#e0e0e0] bg-[#f5f5f5] px-[12px] py-[4px] text-[14px] text-black">
                            <SelectValue placeholder={t('home.sortBy')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="recent">{t('home.mostRecent')}</SelectItem>
                            <SelectItem value="oldest">{t('home.oldest')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </>
    );
}
