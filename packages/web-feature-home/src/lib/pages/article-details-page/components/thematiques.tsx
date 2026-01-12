import { Badge } from '@maas/web-components';
import { Article } from '@maas/core-api-models';

export const Thematiques = ({
  categories,
}: {
  categories?: Article['categories'];
}) => {
  if (categories?.length === 0) return null;
  return (
    <div className="flex flex-col gap-5">
      <h2
        className={
          'uppercase text-left font-body text-[13px] font-bold leading-4 text-black/50 tracking-[0.26px] transition-colors'
        }
      >
        Thématiques
      </h2>
      <div className={'flex flex-row flex-wrap gap-1'}>
        {categories?.map((cat, index) => (
          <Badge
            key={index}
            variant={'outline'}
            className={
              'font-body uppercase px-2 py-1 rounded-[4px] text-[11px] font-semibold tracking-[0.33px] border-[#E0E0E0] text-black bg-white hover:bg-gray-50'
            }
          >
            {cat.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};
