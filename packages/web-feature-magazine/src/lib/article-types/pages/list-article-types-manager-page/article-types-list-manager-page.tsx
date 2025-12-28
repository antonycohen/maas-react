import { Collection } from '@maas/web-collection';
import { useArticleTypesListColumns } from './hooks/use-article-types-list-columns';
import { useGetArticleTypes } from '@maas/core-api';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function ArticleTypesListManagerPage() {
  const columns = useArticleTypesListColumns();
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[{ label: 'Home', to: '/' }, { label: 'Article Types' }]}
        />
      </header>
      <LayoutContent>
        <LayoutHeader
          pageTitle="Article Types"
          actions={
            <Button asChild>
              <Link to={`${workspaceBaseUrl}/article-types/new`}>
                <IconPlus className="mr-2 h-4 w-4" />
                New Article Type
              </Link>
            </Button>
          }
        />
        <Collection
          useLocationAsState
          columns={columns}
          filtersConfiguration={{
            textFilter: {
              placeholder: 'Search article types...',
              queryParamName: 'name',
            },
          }}
          useQueryFn={useGetArticleTypes}
          queryFields={{
            id: null,
            name: null,
            key: null,
            fields: null,
            isActive: null,
          }}
        />
      </LayoutContent>
    </div>
  );
}
