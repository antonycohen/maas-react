import {
  FeedArticleData,
  FeedArticleItem,
  TitleAndDescriptionHero,
} from '@maas/web-components';
import { Collection, CollectionRenderProps } from '@maas/web-collection';
import { useGetArticles } from '@maas/core-api';
import { Article } from '@maas/core-api-models';
import { ColumnDef } from '@tanstack/react-table';
import {
  renderMagazineCollectionLayout,
  renderMagazineCollectionPagination,
  renderMagazineCollectionToolbar,
} from '../../components/magazine-collection';

function mapIssueToFeedArticle(article: Article): FeedArticleData {
  return {
    type: 'article',
    image: article.cover?.downloadUrl || '/placeholder.jpg',
    title: article.title || 'Sans titre',
    category: article.categories?.[0].name || 'Magazine',
    subcategory: undefined,
    author: article.author?.firstName || 'Tangente',
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : '',
    link: `/articles/${article.id}`,
  };
}

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
    <div className="flex flex-col gap-tg-xl px-5 xl:px-0">
      <div className="container mx-auto">
        <TitleAndDescriptionHero
          title="Histoire & Culture"
          description="Découvrez comment les grands mathématiciens ont façonné notre monde, explorez les liens entre les maths et les autres domaines comme l'art, la musique ou même la philosophie, et revivez les moments clés qui ont marqué leur évolution."
        />
      </div>
      <div className="container mx-auto pb-10 md:pt-5">
        <Collection
          columns={columns}
          useLocationAsState
          filtersConfiguration={{
            facetedFilters: [
              {
                columnId: 'categories',
                queryParamName: 'issueId',
                title: 'Category',
                options: [
                  {
                    label: 'Hello',
                    value: 'cool',
                  },
                ],
              },
            ],
          }}
          useQueryFn={useGetArticles}
          queryFields={{
            id: null,
            title: null,
            description: null,
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
