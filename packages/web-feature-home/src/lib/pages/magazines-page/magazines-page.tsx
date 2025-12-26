import { useState } from 'react';
import { TitleAndDescriptionHero, Pagination } from '@maas/web-components';
import { MagazineFilters } from './components/magazine-filters';
import { MagazineCard } from './components/magazine-card';
import { MOCK_MAGAZINES } from './data';

const ALL_MAGAZINES = Array.from({ length: 50 }).map((_, i) => ({
  ...MOCK_MAGAZINES[i % MOCK_MAGAZINES.length],
  id: `mag-${i}`,
  title: `Tangente n°${290 - i}`,
}));

const ITEMS_PER_PAGE = 15;

export const MagazinesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('recent');
  const [currentPage, setCurrentPage] = useState(0);

  const filteredMagazines = ALL_MAGAZINES.filter((_mag) => {
    if (activeCategory === 'all') return true;
    return true;
  });

  const totalPages = Math.ceil(filteredMagazines.length / ITEMS_PER_PAGE);
  const paginatedMagazines = filteredMagazines.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof globalThis.window !== 'undefined') {
      globalThis.window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col gap-[40px] pb-[40px] px-5">
      <div className="w-full max-w-[1220px] mx-auto">
        <TitleAndDescriptionHero
          title="Magazine"
          description="Découvrez comment les grands mathématiciens ont façonné notre monde, explorez les liens entre les maths et les autres domaines comme l’art, la musique ou même la philosophie, et revivez les moments clés qui ont marqué leur évolution."
        />
      </div>

      <div className="w-full max-w-[1220px] mx-auto flex flex-col gap-[40px]">
        <MagazineFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />

        <div className="grid grid-cols-2 md:grid-cols-5 gap-[20px]">
          {paginatedMagazines.map((magazine) => (
            <MagazineCard key={magazine.id} magazine={magazine} />
          ))}
        </div>

        <div className="flex justify-center mt-[20px]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
