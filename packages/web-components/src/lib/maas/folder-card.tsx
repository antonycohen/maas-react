import { Folder, Article } from '@maas/core-api-models';
import { ChevronRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FolderCardProps {
  folder: Folder;
  link?: string;
  viewAllLabel?: string;
  maxArticles?: number;
}

const FolderTag = ({ label }: { label: string }) => {
  return (
    <div className="flex h-6 items-center justify-center rounded border border-[#e0e0e0] bg-white px-2">
      <span className="font-body text-[11px] font-semibold uppercase leading-4 tracking-[0.33px] text-black">
        {label}
      </span>
    </div>
  );
};

interface ArticleItemProps {
  article: Article;
  link?: string;
}

const ArticleItem = ({ article, link }: ArticleItemProps) => {
  const content = (
    <>
      {/* Thumbnail */}
      <div className="h-10 w-[60px] shrink-0 overflow-hidden rounded">
        {article.featuredImage?.url ? (
          <img
            src={article.featuredImage.url}
            alt={article.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100">
            <FileText className="h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col">
        <p className="line-clamp-1 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-black">
          {article.title}
        </p>
        <div className="flex h-5 items-center">
          <span className="font-body text-[13px] font-normal leading-[18px] text-black/70">
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

  return (
    <div className="flex items-center gap-4 border-t border-[#e0e0e0] px-0 py-3">
      {content}
    </div>
  );
};

export const FolderCard = ({
  folder,
  link,
  viewAllLabel = 'Voir le dossier complet',
  maxArticles = 2,
}: FolderCardProps) => {
  const articles = folder.articles || [];
  const displayedArticles = articles.slice(0, maxArticles);

  return (
    <div className="flex flex-col md:flex-row gap-5 rounded-xl border border-[#e0e0e0] bg-white p-3">
      {/* Left - Cover Image */}
      <div className="relative aspect-[588/420] flex-1 overflow-hidden rounded">
        {folder.cover?.url ? (
          <img
            src={folder.cover.url}
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
              {folder.type && <FolderTag label={folder.type} />}
            </div>
            <h3 className="truncate font-heading text-[26px] font-semibold leading-8 tracking-[-0.52px] text-black">
              {folder.name}
            </h3>
          </div>

          {/* Description */}
          {folder.description && (
            <p className="line-clamp-3 font-body text-[16px] font-normal leading-[22px] tracking-[-0.12px] text-black">
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
              <span className="font-body text-[13px] font-semibold leading-[18px] text-black/70">
                {folder.articleCount ?? articles.length} articles
              </span>
            </div>

            {/* Article list */}
            {displayedArticles.map((article) => (
              <ArticleItem
                key={article.id}
                article={article}
                link={`/articles/${article.id}`}
              />
            ))}
          </div>

          {/* View All Button */}
          {link ? (
            <Link
              to={link}
              className="flex h-10 items-center justify-center gap-1 rounded bg-[#141414] px-4 py-2 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-white transition-colors hover:bg-[#2a2a2a]"
            >
              {viewAllLabel}
            </Link>
          ) : (
            <button className="flex h-10 items-center justify-center gap-1 rounded bg-[#141414] px-4 py-2 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-white transition-colors hover:bg-[#2a2a2a]">
              {viewAllLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
