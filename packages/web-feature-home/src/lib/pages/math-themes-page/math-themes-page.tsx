import React from 'react';
import { SEO } from '@maas/core-seo';
import {
    mapIssueToFeedArticle,
    FeedArticleItem,
    TitleAndDescriptionHero,
    NotFoundPage,
    Pagination,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@maas/web-components';
import { Collection, CollectionRenderProps } from '@maas/web-collection';
import { useGetArticles } from '@maas/core-api';
import { Article } from '@maas/core-api-models';
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router';
import { useTranslation } from '@maas/core-translations';

const VALID_THEMES = [
    'geometry',
    'algebra',
    'analysis',
    'arithmetic',
    'numerical',
    'logic',
    'combinatorics_and_games',
    'applied_mathematics',
    'probability_and_statistics',
] as const;

const columns: ColumnDef<Article>[] = [
    {
        id: 'publishedAt',
        accessorKey: 'publishedAt',
        enableSorting: true,
    },
];

export const MathThemesPage = () => {
    const { theme } = useParams<{ theme?: string }>();
    const { t } = useTranslation();

    if (theme && !VALID_THEMES.includes(theme as (typeof VALID_THEMES)[number])) {
        return <NotFoundPage />;
    }

    const renderContent = ({ items }: CollectionRenderProps<Article>) => {
        if (items.length === 0) {
            return (
                <div className="flex h-[400px] items-center justify-center">
                    <p className="text-black/50">Aucun résultat trouvé</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:grid-cols-4">
                {items.map((article) => (
                    <FeedArticleItem key={article.id} item={mapIssueToFeedArticle(article)} />
                ))}
            </div>
        );
    };

    const renderToolbar = ({ table }: CollectionRenderProps<Article>) => {
        const sorting = table.getState().sorting;
        const currentSort = sorting[0];
        const sortOrder = currentSort?.id === 'publishedAt' ? (currentSort.desc ? 'recent' : 'oldest') : 'recent';

        const setSortOrder = (order: string) => {
            if (order === 'recent') {
                table.getColumn('publishedAt')?.toggleSorting(true);
            } else if (order === 'oldest') {
                table.getColumn('publishedAt')?.toggleSorting(false);
            }
        };

        return (
            <>
                {/* Desktop */}
                <div className="hidden h-[40px] w-full items-center justify-end md:flex">
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
                {/* Mobile */}
                <div className="flex w-full md:hidden">
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
            </>
        );
    };

    const renderPagination = ({ state, totalCount }: CollectionRenderProps<Article>) => {
        const totalPages = Math.ceil(totalCount / state.pagination.pageSize);
        return (
            <Pagination
                currentPage={state.pagination.pageIndex}
                totalPages={totalPages}
                onPageChange={(page) => state.setPagination({ ...state.pagination, pageIndex: page })}
            />
        );
    };

    const renderLayout = ({
        toolbar,
        content,
        pagination,
    }: {
        toolbar: React.ReactNode;
        content: React.ReactNode;
        pagination: React.ReactNode;
    }) => (
        <div className="mx-auto flex w-full max-w-[1220px] flex-col gap-[40px]">
            {toolbar}
            {content}
            <div className="mt-[20px] flex justify-center">{pagination}</div>
        </div>
    );

    return (
        <div className="flex flex-col gap-[40px] px-5 pb-[40px]">
            <SEO title={t('nav.public.mathThemes')} description={t('home.mathThemesDescription')} />
            <div className="mx-auto w-full max-w-[1220px]">
                <TitleAndDescriptionHero
                    title={t('nav.public.mathThemes')}
                    description={t('home.mathThemesDescription')}
                />
            </div>

            <Collection
                columns={columns}
                useLocationAsState
                defaultPageSize={20}
                staticParams={{
                    filters: {
                        isPublished: true,
                        ...(theme ? { theme } : {}),
                    },
                }}
                useQueryFn={useGetArticles}
                queryFields={{
                    id: null,
                    title: null,
                    description: null,
                    categories: null,
                    publishedAt: null,
                    cover: {
                        fields: {
                            resizedImages: null,
                            url: null,
                        },
                    },
                }}
                renderToolbar={renderToolbar}
                renderContent={renderContent}
                renderPagination={renderPagination}
                renderLayout={renderLayout}
            />
        </div>
    );
};
