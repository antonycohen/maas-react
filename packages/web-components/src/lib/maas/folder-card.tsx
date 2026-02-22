import { Folder, Article } from '@maas/core-api-models';
import { ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router';
import { useResizedImage } from '../hooks';
import { Skeleton } from '../ui/skeleton';
import { publicUrlBuilders } from '@maas/core-routes';

interface FolderCardProps {
    folder: Folder;
    link?: string;
    viewAllLabel?: string;
    maxArticles?: number;
}

interface ArticleItemProps {
    article: Article;
    link?: string;
}

const ArticleItem = ({ article, link }: ArticleItemProps) => {
    const { resizedImage: image } = useResizedImage({
        images: article.cover?.resizedImages,
        width: 320,
    });
    const content = (
        <>
            {/* Thumbnail */}
            <div className="h-10 w-[60px] shrink-0 overflow-hidden rounded">
                {image?.url ? (
                    <img src={image?.url} alt={article.title} className="h-full w-full object-cover" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <FileText className="h-4 w-4 text-gray-400" />
                    </div>
                )}
            </div>

            {/* Text */}
            <div className="flex flex-1 flex-col">
                <p className="font-body line-clamp-1 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-black">
                    {article.title}
                </p>
                <div className="flex h-5 items-center">
                    <span className="font-body text-[13px] leading-[18px] font-normal text-black/70">
                        {article.author?.firstName} {article.author?.lastName}
                    </span>
                </div>
            </div>

            {/* Chevron */}
            <ChevronRight className="h-5 w-5 shrink-0 text-black/50" />
        </>
    );

    if (link) {
        return (
            <Link
                to={link}
                className="flex items-center gap-4 border-t border-[#e0e0e0] px-0 py-3 transition-colors hover:bg-gray-50"
            >
                {content}
            </Link>
        );
    }

    return <div className="flex items-center gap-4 border-t border-[#e0e0e0] px-0 py-3">{content}</div>;
};

const ArticleItemSkeleton = () => (
    <div className="flex items-center gap-4 border-t border-[#e0e0e0] px-0 py-3">
        <Skeleton className="h-10 w-[60px] shrink-0 rounded" />
        <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3.5 w-1/3" />
        </div>
        <Skeleton className="h-5 w-5 shrink-0 rounded-full" />
    </div>
);

export const FolderCardSkeleton = () => (
    <div className="flex flex-col gap-5 rounded-xl border border-[#e0e0e0] bg-white p-3 md:flex-row">
        <Skeleton className="aspect-[588/420] flex-1 rounded" />
        <div className="flex flex-1 flex-col justify-between p-5">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-8 w-2/3" />
                </div>
                <div className="flex flex-col gap-1">
                    <Skeleton className="h-[22px] w-full" />
                    <Skeleton className="h-[22px] w-4/5" />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1 py-2">
                        <Skeleton className="h-5 w-24" />
                    </div>
                    <ArticleItemSkeleton />
                    <ArticleItemSkeleton />
                </div>
                <Skeleton className="h-10 w-full rounded" />
            </div>
        </div>
    </div>
);

export const FolderCard = ({
    folder,
    link,
    viewAllLabel = 'Voir le dossier complet',
    maxArticles = 2,
}: FolderCardProps) => {
    const articles = folder.articles || [];
    const displayedArticles = articles.slice(0, maxArticles);
    const { resizedImage } = useResizedImage({
        width: 640,
        images: folder?.cover?.resizedImages,
    });

    return (
        <div className="flex flex-col gap-5 rounded-xl border border-[#e0e0e0] bg-white p-3 md:flex-row">
            {/* Left - Cover Image */}
            <div className="relative aspect-[588/420] flex-1 overflow-hidden rounded">
                {resizedImage?.url ? (
                    <img
                        src={resizedImage?.url}
                        alt={folder.name}
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <FileText className="h-12 w-12 text-gray-300" />
                    </div>
                )}
            </div>

            {/* Right - Description */}
            <div className="flex flex-1 flex-col justify-between p-5">
                {/* Top section */}
                <div className="flex flex-col gap-3">
                    {/* Tag & Title */}
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-start gap-0.5">
                            {/* {folder.type && <FolderTag label={folder.type} />} */}
                        </div>
                        <h3 className="font-heading truncate text-[26px] leading-8 font-semibold tracking-[-0.52px] text-black">
                            {folder.name}
                        </h3>
                    </div>

                    {/* Description */}
                    {folder.description && (
                        <p className="font-body line-clamp-3 text-[16px] leading-[22px] font-normal tracking-[-0.12px] text-black">
                            {folder.description}
                        </p>
                    )}
                </div>

                {/* Bottom section */}
                <div className="flex flex-col gap-3">
                    {/* Article count & list */}
                    <div className="flex flex-col">
                        {/* Article count */}
                        <div className="flex items-center gap-1 py-2">
                            <FileText className="h-5 w-5 text-black/70" />
                            <span className="font-body text-[13px] leading-[18px] font-semibold text-black/70">
                                {folder.articleCount ?? articles.length} articles
                            </span>
                        </div>

                        {/* Article list */}
                        {displayedArticles.map((article) => (
                            <ArticleItem
                                key={article.id}
                                article={article}
                                link={publicUrlBuilders.article(article.id)}
                            />
                        ))}
                    </div>

                    {/* View All Button */}
                    {link ? (
                        <Link
                            to={link}
                            className="font-body flex h-10 items-center justify-center gap-1 rounded bg-[#141414] px-4 py-2 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-white transition-colors hover:bg-[#2a2a2a]"
                        >
                            {viewAllLabel}
                        </Link>
                    ) : (
                        <button className="font-body flex h-10 items-center justify-center gap-1 rounded bg-[#141414] px-4 py-2 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-white transition-colors hover:bg-[#2a2a2a]">
                            {viewAllLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
