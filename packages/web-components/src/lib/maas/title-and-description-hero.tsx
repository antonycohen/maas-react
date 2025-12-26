import { cn } from '@maas/core-utils';

interface FolderHighlightsHeroProps {
  title: string;
  description?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export const TitleAndDescriptionHero = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
}: FolderHighlightsHeroProps) => {
  return (
    <section className="flex w-full items-center justify-center px-0 py-tg-3xl">
      <div className="container mx-auto flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 text-center max-w-[600px]">
          <h1 className={cn("font-heading text-[48px] font-semibold leading-[52px] tracking-[-1.32px] text-brand-primary", titleClassName)}>
            {title}
          </h1>
          {description && (
            <p className={cn("font-body text-lg font-normal leading-[26px] tracking-[-0.18px] text-black", descriptionClassName)}>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
