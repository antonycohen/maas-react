import { Collection } from '@maas/web-collection';
import { useBrandsListColumns } from './hooks/use-brands-list-columns';
import { useGetBrands } from '@maas/core-api';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import { Button } from '@maas/web-components';
import { Link } from 'react-router-dom';
import { IconPlus } from '@tabler/icons-react';

export function BrandsListManagerPage() {
  const columns = useBrandsListColumns();

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Brands' },
          ]}
        />
        <LayoutHeader
          pageTitle="Brands"
          actions={
            <Button asChild>
              <Link to="/brands/new">
                <IconPlus className="mr-2 h-4 w-4" />
                New Brand
              </Link>
            </Button>
          }
        />
      </header>
      <LayoutContent>
        <Collection
          useLocationAsState
          columns={columns}
          filtersConfiguration={{
            textFilter: {
              placeholder: 'Search brands...',
              queryParamName: 'term',
            },
          }}
          useQueryFn={useGetBrands}
          queryFields={{
            id: null,
            name: null,
            description: null,
            isActive: null,
            issueCount: null,
            logo: null
          }}
        />
      </LayoutContent>
    </div>
  );
}
