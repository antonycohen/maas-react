import { FolderCard, FolderCardSkeleton, TitleAndDescriptionHero, Button } from '@maas/web-components';
import { getFolders, FieldQuery } from '@maas/core-api';
import { Folder } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';
import { publicUrlBuilders } from '@maas/core-routes';
import { SEO } from '@maas/core-seo';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

const PAGE_SIZE = 10;

const FOLDER_FIELDS: FieldQuery<Folder> = {
    id: null,
    slug: null,
    name: null,
    description: null,
    type: null,
    articleCount: null,
    cover: {
        fields: {
            resizedImages: null,
        },
    },
    articles: {
        fields: {
            title: null,
            id: null,
            slug: null,
            cover: {
                fields: {
                    resizedImages: null,
                },
            },
            publishedAt: null,
            author: {
                fields: {
                    firstName: null,
                    lastName: null,
                },
            },
        },
    },
};

export const FoldersPage = () => {
    const { t } = useTranslation();

    const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
        queryKey: ['folders', 'infinite'],
        queryFn: ({ pageParam = 0 }) =>
            getFolders({
                limit: PAGE_SIZE,
                offset: pageParam,
                fields: FOLDER_FIELDS,
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            const nextOffset = lastPage.pagination.offset + lastPage.pagination.limit;
            return nextOffset < lastPage.pagination.count ? nextOffset : undefined;
        },
    });

    const folders = data?.pages.flatMap((page) => page.data) ?? [];
    console.log('🚀 ~ file: folders-page.tsx:92 ~ FoldersPage ~ folders:', folders);
    return (
        <div className="gap-tg-xl flex flex-col px-5 xl:px-0">
            <SEO title={t('home.foldersTitle')} description={t('home.foldersDescription')} />
            <div className="container mx-auto">
                <TitleAndDescriptionHero title={t('home.foldersTitle')} description={t('home.foldersDescription')} />
            </div>
            <div className="gap-tg-lg py-tg-xl container mx-auto flex flex-col pb-8">
                {isLoading
                    ? Array.from({ length: 3 }).map((_, i) => <FolderCardSkeleton key={i} />)
                    : folders.map((folder) => (
                          <FolderCard
                              key={`folder-${folder.id}`}
                              folder={folder}
                              link={publicUrlBuilders.folder(folder.slug ?? folder.id)}
                          />
                      ))}

                {hasNextPage && (
                    <div className="flex justify-center pt-4">
                        <Button variant="outline" onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
                            {isFetchingNextPage ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {t('common.loadMore')}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
