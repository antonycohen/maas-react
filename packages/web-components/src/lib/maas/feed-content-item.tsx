import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export interface FeedArticleData {
  type: 'article';
  image: string;
  title: string;
  category: string;
  subcategory?: string;
  author: string;
  date: string;
  link: string;
}

interface FeedArticleItemProps {
  item: FeedArticleData;
}

interface FeedTagProps {
  label: string;
  variant?: 'accent' | 'default';
}

const FeedTag = ({ label, variant = 'default' }: FeedTagProps) => {
  return (
    <div className="flex h-6 items-center justify-center rounded bg-white border border-[#e0e0e0] px-2">
      <span
        className={`
          font-body text-[11px] font-semibold uppercase leading-4 tracking-[0.33px]
          ${variant === 'accent' ? 'text-brand-primary' : 'text-black'}
        `}
      >
        {label}
      </span>
    </div>
  );
};

export const FeedArticleItem = ({ item }: FeedArticleItemProps) => {
  return (
    <Link
      to={item.link}
      className="group flex flex-col gap-3 rounded-[12px] border border-[#e0e0e0] bg-white p-3 transition-shadow hover:shadow-md"
    >
      {/* Image */}
      <div className="relative aspect-[266/188] w-full overflow-hidden rounded">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 p-2">
        {/* Tags & Title */}
        <div className="flex flex-col gap-1">
          {/* Tags */}
          <div className="flex flex-wrap items-start gap-0.5">
            <FeedTag label={item.category} variant="accent" />
            {item.subcategory && <FeedTag label={item.subcategory} />}
          </div>

          {/* Title */}
          <h3 className="font-heading text-[20px] font-semibold leading-6 tracking-[-0.3px] text-black line-clamp-3 h-[72px]">
            {item.title}
          </h3>
        </div>

        {/* Author & Date */}
        <div className="flex h-5 items-center gap-2  justify-between text-[13px] leading-[18px] text-black/70">
          <span className="font-body font-semibold">{item.author}</span>
          <span className="font-body font-normal w-24">{item.date}</span>
        </div>
      </div>
    </Link>
  );
};


export type FeedContentItemData =
  | FeedArticleData
  | FeedFolderData
  | FeedMagazineData;

interface FeedContentItemProps {
  item: FeedContentItemData;
}

export interface FeedMagazineData {
  type: 'magazine';
  image: string;
  title: string;
  category: string;
  edition: string;
  date: string;
  link: string;
}

interface FeedMagazineItemProps {
  item: FeedMagazineData;
}

export const FeedMagazineItem = ({ item }: FeedMagazineItemProps) => {
  return (
    <Link
      to={item.link}
      className="group relative h-[450px] md:h-auto flex flex-col items-start justify-end overflow-clip rounded-[12px] bg-brand-primary"
    >
      {/* Magazine Cover Image - positioned bottom right */}
      <div className="absolute inset-0 flex items-end justify-end">
        <div className="h-[340px] w-[242px] shrink-0 rounded shadow-tangente-3">
          <img
            src={item.image}
            alt={item.title}
            className="h-full w-full object-cover rounded transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content with gradient overlay */}
      <div className="relative flex w-full flex-col gap-5 bg-gradient-to-b from-transparent to-black/70 to-50% px-5 py-5">
        {/* Tags & Title */}
        <div className="flex flex-col gap-1">
          {/* Tag */}
          <div className="flex flex-wrap items-start gap-0.5">
            <div className="flex h-6 items-center justify-center rounded bg-black/70 border border-[#333] px-2 backdrop-blur-md">
              <span className="font-body text-[11px] font-semibold uppercase leading-4 tracking-[0.33px] text-brand-secondary">
                {item.category}
              </span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-heading text-[20px] font-semibold leading-6 tracking-[-0.3px] text-white line-clamp-2 h-[48px]">
            {item.title}
          </h3>
        </div>

        {/* Date */}
        <div className="flex h-5 items-center">
          <span className="font-body text-[13px] font-normal leading-[18px] text-white">
            {item.date}
          </span>
        </div>
      </div>
    </Link>
  );
};


export interface FeedFolderData {
  type: 'folder';
  image: string;
  title: string;
  category: string;
  subcategory?: string;
  articleCount: number;
  date: string;
  link: string;
  articles?: FeedArticleData[];
}

interface FeedFolderItemProps {
  item: FeedFolderData;
}

export const FeedFolderItem = ({ item }: FeedFolderItemProps) => {
  // Get up to 3 images from articles for the stack effect
  const articleImages = item.articles?.slice(0, 3).map(a => a.image) || [];
  const [backImg, midImg, frontImg] = [
    articleImages[2] || articleImages[1] || articleImages[0] || item.image,
    articleImages[1] || articleImages[0] || item.image,
    articleImages[0] || item.image
  ];


  return (
    <Link
      to={item.link}
      className="group flex flex-col gap-3 rounded-[12px] border border-[#e0e0e0] bg-white p-3 transition-shadow hover:shadow-md h-full"
    >
      {/* Stacked Images */}
      <div className="relative aspect-[266/188] w-full">
        {/* Back image (top, darkest overlay) */}
        <div className="absolute left-[24px] right-[24px] top-0 aspect-[234/164] rounded-[4px] overflow-hidden shadow-[0px_0px_4px_0px_rgba(0,0,0,0.06),2px_4px_8px_0px_rgba(0,0,0,0.04)]">
          <img
            src={backImg}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/70 rounded-[4px]" />
        </div>

        {/* Middle image (centered, medium overlay) */}
        <div className="absolute left-[12px] right-[12px] top-[12px] aspect-[250/164] rounded-[4px] overflow-hidden border border-white/15 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.06),2px_6px_16px_0px_rgba(0,0,0,0.08)]">
          <img
            src={midImg}
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 rounded-[4px]" />
        </div>

        {/* Front image (bottom, no overlay) */}
        <div className="absolute top-6 md:bottom-0 left-0 right-0 aspect-[266/164] rounded-[4px] overflow-hidden border border-white/15 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.06),3px_8px_20px_0px_rgba(0,0,0,0.1)]">
          <img
            src={frontImg}
            alt={item.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 p-1 md:p-2">
        {/* Tags & Title */}
        <div className="flex flex-col gap-1">
          {/* Tags */}
          <div className="flex flex-wrap items-start gap-0.5">
            <FeedTag label={item.category} variant="accent" />
            {item.subcategory && <FeedTag label={item.subcategory} />}
          </div>

          {/* Title */}
          <h3 className="font-heading text-[20px] font-semibold leading-6 tracking-[-0.3px] text-black line-clamp-2 md:line-clamp-3 h-[48px] md:h-[72px]">
            {item.title}
          </h3>
        </div>

        {/* Article Count & Date */}
        <div className="flex h-5 items-center justify-between gap-2 text-[13px] leading-[18px] text-black/70">
          <div className="flex items-center gap-1">
            <FileText className="h-5 w-5" />
            <span className="font-body font-semibold">{item.articleCount} articles</span>
          </div>
          <span className="font-body font-normal w-24">{item.date}</span>
        </div>
      </div>
    </Link>
  );
};

export const FeedContentItem = ({ item }: FeedContentItemProps) => {
  switch (item.type) {
    case 'article':
      return <FeedArticleItem item={item} />;
    case 'folder':
      return <FeedFolderItem item={item} />;
    case 'magazine':
      return <FeedMagazineItem item={item} />;
    default:
      return null;
  }
};
