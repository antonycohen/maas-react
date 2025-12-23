import { Issue } from '@maas/core-api-models';
import { Link } from 'react-router-dom';

interface MagazineHighlightsHeroProps {
  issue: Issue;
  link?: string;
}

const MagazineTag = ({ label }: { label: string }) => {
  return (
    <div className="flex h-6 items-center justify-center rounded bg-black/70 px-2 backdrop-blur-md border border-[#333]">
      <span className="font-body text-[11px] font-semibold uppercase leading-4 tracking-[0.33px] text-brand-secondary">
        {label}
      </span>
    </div>
  );
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const MagazineHighlightsHero = ({
  issue,
  link,
}: MagazineHighlightsHeroProps) => {
  const content = (
    <div className="flex w-full items-start justify-center gap-5 ">
      {/* Left - Magazine Cover with Yellow Circle */}
      <div className="relative flex h-[480px] flex-1 items-center justify-center px-2.5 ">
        {/* Yellow Circle Decoration */}
        <div className="absolute h-[480px] w-[480px]">
          <svg
            viewBox="0 0 480 480"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
          >
            <circle
              cx="240"
              cy="240"
              r="238"
              stroke="#FFF132"
              strokeWidth="4"
            />
          </svg>
        </div>

        {/* Magazine Cover */}
        <div className="absolute left-1/2 top-0 h-[480px] w-[341px] -translate-x-1/2 overflow-hidden rounded-xl shadow-tangente-3">
          {issue.cover?.url ? (
            <img
              src={issue.cover.url}
              alt={issue.title}
              className="h-full w-full object-cover rounded-xl "
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-200 rounded-xl">
              <span className="text-gray-400">No cover</span>
            </div>
          )}
        </div>
      </div>

      {/* Right - Content */}
      <div className="flex flex-1 flex-col gap-5 self-stretch justify-center px-5 py-5">
        {/* Header - Tag & Title */}
        <div className="flex flex-col gap-1 justify-center">
          <div className="flex flex-wrap items-start gap-0.5">
            <MagazineTag label="Magazine" />
          </div>
          <h1 className="font-heading text-[48px] font-semibold leading-[52px] tracking-[-1.32px] text-white">
            {issue.title}
          </h1>
        </div>

        {/* Description */}
        {issue.description && (
          <p className="font-body text-[18px] font-normal leading-[26px] tracking-[-0.18px] text-white">
            {issue.description}
          </p>
        )}

        {/* Date */}
        {issue.publishedAt && (
          <div className="flex h-5 items-center">
            <span className="font-body text-[13px] font-normal leading-[18px] text-white">
              {formatDate(issue.publishedAt)}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <section className="flex items-center justify-center bg-brand-primary py-tg-xl">
      <div className="container mx-auto flex h-[480px] items-center justify-center py-10">
        <div className="flex h-full w-full items-center justify-center">
          {link ? (
            <Link to={link} className="group flex w-full " >
              {content}
            </Link>
          ) : (
            content
          )}
        </div>
      </div>
    </section>
  );
};
