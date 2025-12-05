import { FeedContentItem, type FeedContentItemData } from './feed-content-item';

interface ContentFeedProps {
  items: FeedContentItemData[];
}

export const ContentFeed = ({ items }: ContentFeedProps) => {
  if (!items.length) return null;

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <FeedContentItem key={index} item={item} />
      ))}
    </div>
  );
};
