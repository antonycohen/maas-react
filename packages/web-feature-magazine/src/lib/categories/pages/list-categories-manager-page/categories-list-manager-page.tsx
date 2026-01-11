import { Collection } from '@maas/web-collection';
import { useCategoriesListColumns } from './hooks/use-categories-list-columns';
import { useGetCategories } from '@maas/core-api';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function CategoriesListManagerPage() {
  const columns = useCategoriesListColumns();
  const currentWorkspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: `${currentWorkspaceBaseUrl}` },
            { label: 'Categories' },
          ]}
        />
      </header>
      <LayoutContent>
        <LayoutHeader
          pageTitle="Categories"
          actions={
            <Button asChild>
              <Link to={`${currentWorkspaceBaseUrl}/categories/new`}>
                <IconPlus className="mr-2 h-4 w-4" />
                New Category
              </Link>
            </Button>
          }
        />
        <Collection
          useLocationAsState
          columns={columns}
          filtersConfiguration={{
            textFilter: {
              placeholder: 'Search categories...',
              queryParamName: 'name',
            },
          }}
          useQueryFn={useGetCategories}
          queryFields={{
            id: null,
            name: null,
            description: null,
            cover: null,
            parent: {
              fields: {
                id: null,
                name: null,
              },
            },
            childrenCount: null,
          }}
        />
      </LayoutContent>
    </div>
  );
}
