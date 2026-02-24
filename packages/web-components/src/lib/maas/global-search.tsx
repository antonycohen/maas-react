import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, X, Loader2, FileText, BookOpen, FolderOpen } from 'lucide-react';
import { cn } from '@maas/core-utils';
import { useTranslation } from '@maas/core-translations';
import { useSearch } from '@maas/core-api';
import { SearchResult } from '@maas/core-api-models';
import { publicUrlBuilders } from '@maas/core-routes';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { FeedContentItem, FeedContentItemData } from './feed-content-item';

type EntityFilter = 'all' | 'article' | 'folder' | 'issue';

function mapSearchResultToFeedItem(result: SearchResult): FeedContentItemData {
    const formatDate = (dateStr?: string | null) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    switch (result.entityType) {
        case 'article':
            return {
                type: 'article',
                image:
                    result.coverUrl ||
                    'https://images.unsplash.com/photo-1623039405147-547794f92e9e?q=80&w=640&auto=format&fit=crop',
                title: result.title,
                category: result.categoryNames?.[0] || 'Magazine',
                subcategory: result.categoryNames?.[1],
                author: result.authorName || 'Tangente',
                date: formatDate(result.publishedAt),
                link: publicUrlBuilders.article(result.slug ?? result.id),
            };
        case 'folder':
            return {
                type: 'folder',
                image:
                    result.coverUrl ||
                    'https://images.unsplash.com/photo-1623039405147-547794f92e9e?q=80&w=640&auto=format&fit=crop',
                title: result.title,
                category: 'Dossier',
                articleCount: result.articleCount || 0,
                date: formatDate(result.updatedAt),
                link: publicUrlBuilders.folder(result.slug ?? result.id),
            };
        case 'issue':
            return {
                type: 'magazine',
                image:
                    result.coverUrl ||
                    'https://images.unsplash.com/photo-1623039405147-547794f92e9e?q=80&w=640&auto=format&fit=crop',
                title: result.title,
                category: result.brandName || 'Tangente',
                edition: result.issueNumber ? `N°${result.issueNumber}` : '',
                date: formatDate(result.publishedAt),
                link: publicUrlBuilders.magazine(result.slug ?? result.id),
            };
    }
}

const filterTabs: { key: EntityFilter; icon: typeof Search }[] = [
    { key: 'all', icon: Search },
    { key: 'article', icon: FileText },
    { key: 'issue', icon: BookOpen },
    { key: 'folder', icon: FolderOpen },
];

interface GlobalSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
    const { t } = useTranslation();
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<EntityFilter>('all');
    const inputRef = useRef<HTMLInputElement>(null);

    const { data, isLoading, isFetching } = useSearch(debouncedQuery);

    // Debounce query
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    const handleOpenChange = useCallback(
        (nextOpen: boolean) => {
            onOpenChange(nextOpen);
        },
        [onOpenChange]
    );

    // Focus input on open
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [open]);

    // Keyboard shortcut to open
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                handleOpenChange(true);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleOpenChange]);

    const handleClose = useCallback(() => handleOpenChange(false), [handleOpenChange]);

    const filteredResults = useMemo(() => {
        if (!data?.results) return [];
        const results =
            activeFilter === 'all' ? data.results : data.results.filter((r) => r.entityType === activeFilter);
        return results.map(mapSearchResultToFeedItem);
    }, [data, activeFilter]);

    const filterCounts = useMemo(() => {
        if (!data?.results) return { all: 0, article: 0, folder: 0, issue: 0 };
        return {
            all: data.results.length,
            article: data.results.filter((r) => r.entityType === 'article').length,
            folder: data.results.filter((r) => r.entityType === 'folder').length,
            issue: data.results.filter((r) => r.entityType === 'issue').length,
        };
    }, [data]);

    const filterLabel = (key: EntityFilter) => {
        switch (key) {
            case 'all':
                return t('search.all');
            case 'article':
                return t('search.articles');
            case 'folder':
                return t('search.folders');
            case 'issue':
                return t('search.issues');
        }
    };

    const showLoading = isLoading || isFetching;
    const hasQuery = debouncedQuery.length >= 2;
    const hasResults = filteredResults.length > 0;

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent
                className="flex h-[95vh] max-h-[95vh] w-full max-w-[calc(100%-1rem)] flex-col gap-0 overflow-hidden p-0 sm:h-[85vh] sm:max-h-[85vh] sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl"
                showCloseButton={false}
            >
                <VisuallyHidden>
                    <DialogTitle>{t('home.searchOnTangente')}</DialogTitle>
                </VisuallyHidden>

                {/* Search Input */}
                <div className="flex shrink-0 items-center gap-3 border-b border-[#e0e0e0] px-4 py-3 sm:px-6">
                    <Search className="h-5 w-5 shrink-0 text-black/40" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('search.placeholder')}
                        className="font-body h-10 flex-1 bg-transparent text-base text-black outline-none placeholder:text-black/40"
                    />
                    {showLoading && <Loader2 className="h-5 w-5 shrink-0 animate-spin text-black/40" />}
                    {query && !showLoading && (
                        <button
                            onClick={() => setQuery('')}
                            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
                        >
                            <X className="h-4 w-4 text-black/50" />
                        </button>
                    )}
                    <button
                        onClick={handleClose}
                        className="font-body hidden rounded border border-[#e0e0e0] px-2 py-1 text-xs text-black/50 transition-colors hover:bg-gray-50 sm:block"
                    >
                        ESC
                    </button>
                    <button
                        onClick={handleClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 sm:hidden"
                    >
                        <X className="h-5 w-5 text-black/70" />
                    </button>
                </div>

                {/* Filter Tabs */}
                {hasQuery && data && (
                    <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-[#e0e0e0] px-4 sm:px-6">
                        {filterTabs.map(({ key, icon: Icon }) => {
                            const count = filterCounts[key];
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveFilter(key)}
                                    className={cn(
                                        'font-body flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[13px] font-semibold whitespace-nowrap transition-colors',
                                        activeFilter === key
                                            ? 'border-brand-primary text-black'
                                            : 'border-transparent text-black/50 hover:text-black/70'
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    <span>{filterLabel(key)}</span>
                                    {count > 0 && (
                                        <span
                                            className={cn(
                                                'flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-semibold',
                                                activeFilter === key
                                                    ? 'bg-brand-primary text-white'
                                                    : 'bg-black/5 text-black/50'
                                            )}
                                        >
                                            {count}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Results */}
                <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                    {!hasQuery && (
                        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                            <Search className="h-12 w-12 text-black/10" />
                            <p className="font-body text-sm text-black/40">{t('home.searchOnTangente')}</p>
                        </div>
                    )}

                    {hasQuery && showLoading && !data && (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-black/20" />
                        </div>
                    )}

                    {hasQuery && !showLoading && !hasResults && (
                        <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                            <Search className="h-12 w-12 text-black/10" />
                            <p className="font-body text-base font-semibold text-black/70">{t('search.noResults')}</p>
                            <p className="font-body text-sm text-black/40">{t('search.noResultsDescription')}</p>
                        </div>
                    )}

                    {hasResults && (
                        <div className="flex flex-col gap-4">
                            {data && (
                                <p className="font-body text-sm text-black/50">
                                    {t('search.resultCount', { count: data.total })}
                                </p>
                            )}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredResults.map((item, index) => (
                                    <FeedContentItem key={item.link || index} item={item} onClick={handleClose} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
