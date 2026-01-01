import { Badge } from '@maas/web-components';

export const Thematiques = ({ tags }: { tags: string[] }) => {
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
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant={'outline'}
            className={
              'font-body uppercase px-2 py-1 rounded-[4px] text-[11px] font-semibold tracking-[0.33px] border-[#E0E0E0] text-black bg-white hover:bg-gray-50'
            }
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};
