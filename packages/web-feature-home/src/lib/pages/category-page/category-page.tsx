import { mapIssueToFeedArticle, FeedArticleItem, TitleAndDescriptionHero } from '@maas/web-components';
import { Collection, CollectionRenderProps } from '@maas/web-collection';
import { useGetArticles, useGetCategories } from '@maas/core-api';
import { Article } from '@maas/core-api-models';
import { ColumnDef } from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import {
    renderMagazineCollectionLayout,
    renderMagazineCollectionPagination,
    renderMagazineCollectionToolbar,
} from '../../components/magazine-collection';

// Column definitions for filtering (accessor columns enable filter state)
const columns: ColumnDef<Article>[] = [
    {
        id: 'categories',
        accessorFn: (row) => row.categories,
        enableColumnFilter: true,
    },
    {
        id: 'publishedAt',
        accessorKey: 'publishedAt',
        enableSorting: true,
        meta: {
            descendingLabel: 'Les plus récents',
        },
    },
    {
        id: 'viewCount',
        accessorKey: 'viewCount',
        enableSorting: true,
        meta: {
            descendingLabel: 'Les plus populaires',
        },
    },
];

export const CategoryPage = () => {
    const { slug } = useParams<{ slug: string }>();

    const { data: categoriesData } = useGetCategories(
        {
            offset: 0,
            limit: 1,
            filters: { slug },
            fields: { id: null, name: null, description: null },
        },
        { enabled: !!slug }
    );

    const category = categoriesData?.data?.[0];

    const renderContent = ({ items }: CollectionRenderProps<Article>) => {
        if (items.length === 0) {
            return (
                <div className="flex h-[400px] items-center justify-center">
                    <p className="text-black/50">Aucun résultat trouvé</p>
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((issue) => (
                    <FeedArticleItem key={issue.id} item={mapIssueToFeedArticle(issue)} />
                ))}
            </div>
        );
    };

    return (
        <div className="gap-tg-xl flex flex-col px-5 xl:px-0">
            <div className="container mx-auto">
                <TitleAndDescriptionHero title={category?.name ?? ''} description={category?.description ?? ''} />
            </div>
            <div className="container mx-auto pb-10 md:pt-5">
                <Collection
                    columns={columns}
                    useLocationAsState
                    staticParams={{ filters: { isPublished: true, categorySlug: slug } }}
                    filtersConfiguration={{}}
                    useQueryFn={useGetArticles}
                    queryFields={{
                        id: null,
                        title: null,
                        description: null,
                        categories: null,
                        cover: {
                            fields: {
                                resizedImages: null,
                                url: null,
                            },
                        },
                    }}
                    renderToolbar={renderMagazineCollectionToolbar}
                    renderContent={renderContent}
                    renderPagination={renderMagazineCollectionPagination}
                    renderLayout={renderMagazineCollectionLayout}
                />
            </div>
        </div>
    );
};
