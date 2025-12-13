import { Collection } from '@maas/web-collection';
import { useArticlesListColumns } from './hooks/use-articles-list-columns';
import { useGetArticles } from '@maas/core-api';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';

export function ArticlesListManagerPage() {
  const columns = useArticlesListColumns();

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Articles' }]}
        />
      </header>
      <LayoutContent>
        <LayoutHeader
          pageTitle="Articles"
          actions={
            <Button asChild>
              <Link to="/articles/new">
                <IconPlus className="mr-2 h-4 w-4" />
                New Article
              </Link>
            </Button>
          }
        />
        <Collection
          useLocationAsState
          columns={columns}
          filtersConfiguration={{
            textFilter: {
              placeholder: 'Search articles...',
              queryParamName: 'term',
            },
          }}
          useQueryFn={useGetArticles}
          queryFields={{
            id: null,
            title: null,
            description: null,
            type: null,
            isPublished: null,
            isFeatured: null,
            featuredImage: null,
            cover: null,
            issue: {
              fields: {
                id: null,
                title: null,
              },
            },
            folder: {
              fields: {
                id: null,
                name: null,
              },
            },
          }}
        />
      </LayoutContent>
    </div>
  );
}
