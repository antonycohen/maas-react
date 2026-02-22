import { Issue } from '@maas/core-api-models';
import { Link } from 'react-router';
import { useResizedImage } from '../hooks';

interface MagazineHighlightsHeroProps {
    issue?: Issue;
    link?: string;
}

const MagazineTag = ({ label }: { label: string }) => {
    return (
        <div className="flex h-6 items-center justify-center rounded border border-[#333] bg-black/70 px-2 backdrop-blur-md">
            <span className="font-body text-brand-secondary text-[11px] leading-4 font-semibold tracking-[0.33px] uppercase">
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

export const MagazineHighlightsHero = ({ issue, link }: MagazineHighlightsHeroProps) => {
    const { resizedImage } = useResizedImage({
        width: 640,
        images: issue?.cover?.resizedImages,
    });

    const content = (
        <div className="flex w-full flex-col items-start justify-center gap-5 md:flex-row">
            {/* Left - Magazine Cover with Yellow Circle */}
            <div className="relative flex h-[480px] w-full items-center justify-center px-2.5 md:w-auto md:flex-1">
                {/* Yellow Circle Decoration */}
                <div className="absolute h-[480px] w-full px-5 md:w-[480px]">
                    <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-full w-full">
                        <circle cx="240" cy="240" r="238" stroke="#FFF132" strokeWidth="4" />
                    </svg>
                </div>

                {/* Magazine Cover */}
                <div className="shadow-tangente-3 absolute top-0 left-1/2 h-[480px] w-[341px] -translate-x-1/2 overflow-hidden rounded-xl">
                    {resizedImage?.url ? (
                        <img
                            src={resizedImage?.url}
                            alt={issue?.title}
                            className="h-full w-full rounded-xl object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-200">
                            <span className="text-gray-400">No cover</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right - Content */}
            <div className="flex flex-1 flex-col justify-center gap-5 self-stretch px-5 py-5">
                {/* Header - Tag & Title */}
                <div className="flex flex-col justify-center gap-1">
                    <div className="flex flex-wrap items-start gap-0.5">
                        <MagazineTag label="Magazine" />
                    </div>
                    <h1 className="font-heading text-4xl font-semibold tracking-[-1.32px] text-white md:text-[48px] md:leading-[46px] md:leading-[52px]">
                        {issue?.title}
                    </h1>
                </div>

                {/* Description */}
                {issue?.description && (
                    <p className="font-body text-[18px] leading-[26px] font-normal tracking-[-0.18px] text-white">
                        {issue?.description}
                    </p>
                )}

                {/* Date */}
                {issue?.publishedAt && (
                    <div className="flex h-5 items-center">
                        <span className="font-body text-[13px] leading-[18px] font-normal text-white">
                            {formatDate(issue?.publishedAt)}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <section className="py-tg-xl flex items-center justify-center">
            <div className="container mx-auto flex items-center justify-center py-10 md:h-[480px]">
                <div className="flex h-full w-full items-center justify-center">
                    {link ? (
                        <Link to={link} className="group flex w-full">
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
