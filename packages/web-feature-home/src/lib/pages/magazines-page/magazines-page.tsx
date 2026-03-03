import React from 'react';
import { SEO } from '@maas/core-seo';
import { Collection, CollectionRenderProps } from '@maas/web-collection';
import { TitleAndDescriptionHero, Pagination, Skeleton } from '@maas/web-components';
import { useGetIssues } from '@maas/core-api';
import { Issue } from '@maas/core-api-models';
import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from '@maas/core-translations';
import { MagazineFilters } from './components/magazine-filters';
import { MagazineCard } from './components/magazine-card';

// Columns definition (mostly needed for sorting state)
const columns: ColumnDef<Issue>[] = [
    {
        id: 'publishedAt',
        accessorKey: 'publishedAt',
        enableSorting: true,
    },
    {
        id: 'title',
        accessorKey: 'title',
    },
    {
        id: 'brandId',
    },
];

export const MagazinesPage = () => {
    const { t } = useTranslation();
    const renderContent = ({ items, isFetching }: CollectionRenderProps<Issue>) => {
        if (isFetching && items.length === 0) {
            return (
                <div className="grid grid-cols-2 gap-[20px] md:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="flex w-full flex-col items-start">
                            <Skeleton className="mb-5 aspect-[270/380] w-full rounded-t-[4px]" />
                            <div className="flex w-full flex-col gap-1">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-[18px] w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }
        if (items.length === 0) {
            return (
                <div className="flex h-50 items-center justify-center">
                    <p className="text-black/50">{t('home.noMagazinesFound')}</p>
                </div>
            );
        }
        return (
            <div className="grid grid-cols-2 gap-[20px] md:grid-cols-5">
                {items.map((magazine) => (
                    <MagazineCard key={magazine.id} magazine={magazine} />
                ))}
            </div>
        );
    };

    const renderPagination = ({ state, totalCount }: CollectionRenderProps<Issue>) => {
        const totalPages = Math.ceil(totalCount / state.pagination.pageSize);
        return (
            <Pagination
                currentPage={state.pagination.pageIndex}
                totalPages={totalPages}
                onPageChange={(page) => state.setPagination({ ...state.pagination, pageIndex: page })}
            />
        );
    };

    const renderToolbar = ({ table }: CollectionRenderProps<Issue>) => <MagazineFilters table={table} />;

    const renderLayout = ({
        toolbar,
        content,
        pagination,
    }: {
        toolbar: React.ReactNode;
        content: React.ReactNode;
        pagination: React.ReactNode;
    }) => (
        <div className="max-w-tangente mx-auto flex w-full flex-col gap-[40px]">
            {toolbar}
            {content}
            <div className="mt-[20px] flex justify-center">{pagination}</div>
        </div>
    );
    return (
        <div className="flex flex-col gap-[40px] px-5 pb-[40px]">
            <SEO title={t('home.magazine')} description={t('home.magazineDescription')} />
            <div className="max-w-tangente mx-auto w-full">
                <TitleAndDescriptionHero title={t('home.magazine')} description={t('home.magazineDescription')} />
            </div>

            <Collection
                columns={columns}
                useQueryFn={useGetIssues}
                useLocationAsState
                defaultPageSize={20}
                staticParams={{ filters: { isPublished: true } }}
                filtersConfiguration={{
                    facetedFilters: [
                        {
                            columnId: 'brandId' as any,
                            queryParamName: 'brandId',
                            title: t('home.category'),
                            options: [
                                { label: t('home.all'), value: 'all' },
                                { label: t('home.tangentNumbers'), value: '019c76d0-d0fc-7d73-9c71-258c1bbf1061' },
                                { label: t('home.specialIssues'), value: '019c76d1-0321-745e-bff9-2dde3650876a' },
                            ],
                        },
                    ],
                }}
                queryFields={{
                    id: null,
                    slug: null,
                    title: null,
                    description: null,
                    publishedAt: null,
                    issueNumber: null,
                    brand: null,
                    cover: {
                        fields: {
                            resizedImages: null,
                            downloadUrl: null,
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
