import React from 'react';
import { Collection, CollectionRenderProps } from '@maas/web-collection';
import { TitleAndDescriptionHero, Pagination } from '@maas/web-components';
import { useGetIssues } from '@maas/core-api';
import { Issue } from '@maas/core-api-models';
import { ColumnDef } from '@tanstack/react-table';
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
    id: 'term',
    accessorKey: 'term',
  },
];

export const MagazinesPage = () => {
  const renderContent = ({ items }: CollectionRenderProps<Issue>) => {
    if (items.length === 0) {
      return (
        <div className="flex h-[200px] items-center justify-center">
          <p className="text-black/50">Aucun magazine trouvé</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-2 md:grid-cols-5 gap-[20px]">
        {items.map((magazine) => (
          <MagazineCard key={magazine.id} magazine={magazine} />
        ))}
      </div>
    );
  };

  const renderPagination = ({
    state,
    totalCount,
  }: CollectionRenderProps<Issue>) => {
    const totalPages = Math.ceil(totalCount / state.pagination.pageSize);
    return (
      <Pagination
        currentPage={state.pagination.pageIndex}
        totalPages={totalPages}
        onPageChange={(page) =>
          state.setPagination({ ...state.pagination, pageIndex: page })
        }
      />
    );
  };

  const renderToolbar = ({ table }: CollectionRenderProps<Issue>) => (
    <MagazineFilters table={table} />
  );

  const renderLayout = ({
    toolbar,
    content,
    pagination,
  }: {
    toolbar: React.ReactNode;
    content: React.ReactNode;
    pagination: React.ReactNode;
  }) => (
    <div className="w-full max-w-[1220px] mx-auto flex flex-col gap-[40px]">
      {toolbar}
      {content}
      <div className="flex justify-center mt-[20px]">{pagination}</div>
    </div>
  );
  return (
    <div className="flex flex-col gap-[40px] pb-[40px] px-5">
      <div className="w-full max-w-[1220px] mx-auto">
        <TitleAndDescriptionHero
          title="Magazine"
          description="Découvrez comment les grands mathématiciens ont façonné notre monde, explorez les liens entre les maths et les autres domaines comme l’art, la musique ou même la philosophie, et revivez les moments clés qui ont marqué leur évolution."
        />
      </div>

      <Collection
        columns={columns}
        useQueryFn={useGetIssues}
        useLocationAsState
        filtersConfiguration={{
          facetedFilters: [
            {
              columnId: 'term' as any,
              queryParamName: 'term',
              title: 'Catégorie',
              options: [
                { label: 'Tout', value: 'all' },
                { label: 'Tangente numéros', value: 'tangente' },
                { label: 'Hors-séries', value: 'hors-series' },
              ],
            },
          ],
        }}
        queryFields={{
          id: null,
          title: null,
          description: null,
          publishedAt: null,
          issueNumber: null,
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
