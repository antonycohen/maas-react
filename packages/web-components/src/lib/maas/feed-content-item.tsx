import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export interface FeedArticleData {
  type: 'article';
  image: string;
  title: string;
  category: string;
  author: string;
  date: string;
  link: string;
}

interface FeedArticleItemProps {
  item: FeedArticleData;
}

export const FeedArticleItem = ({ item }: FeedArticleItemProps) => {
  return (
    <Link
      to={item.link}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 w-fit rounded border border-red-500 px-2 py-0.5 text-xs font-medium uppercase text-red-500">
          {item.category}
        </span>
        <h3 className="mb-auto text-base font-semibold text-gray-900">
          {item.title}
        </h3>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium text-gray-700">{item.author}</span>
          <span>{item.date}</span>
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
      className="group relative flex aspect-[3/4] flex-col overflow-hidden rounded-lg"
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="relative mt-auto flex flex-col p-4">
        <div className="mb-2 flex flex-wrap gap-2">
          <span className="w-fit rounded bg-red-500 px-2 py-0.5 text-xs font-semibold uppercase text-white">
            {item.category}
          </span>
          <span className="w-fit rounded bg-gray-800 px-2 py-0.5 text-xs font-semibold uppercase text-white">
            {item.edition}
          </span>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-white">{item.title}</h3>
        <span className="text-sm text-gray-300">{item.date}</span>
      </div>
    </Link>
  );
};


export interface FeedFolderData {
  type: 'folder';
  image: string;
  title: string;
  category: string;
  articleCount: number;
  date: string;
  link: string;
}

interface FeedFolderItemProps {
  item: FeedFolderData;
}

export const FeedFolderItem = ({ item }: FeedFolderItemProps) => {
  return (
    <Link
      to={item.link}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 w-fit rounded border border-red-500 px-2 py-0.5 text-xs font-medium uppercase text-red-500">
          {item.category}
        </span>
        <h3 className="mb-auto text-base font-semibold text-gray-900">
          {item.title}
        </h3>
        <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
          <FileText className="h-4 w-4" />
          <span>{item.articleCount} articles</span>
          <span>{item.date}</span>
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
