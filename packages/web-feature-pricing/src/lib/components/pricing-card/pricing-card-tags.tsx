import { Tag, TagStyle } from '../tag';

export interface PricingCardTagsProps {
  tags?: { label: string; style?: TagStyle }[];
}

export function PricingCardTags({ tags }: PricingCardTagsProps) {
  return (
    <div className="flex flex-wrap gap-0.5 min-h-[24px]">
      {tags?.map((tag, index) => (
        <Tag key={index} label={tag.label} style={tag.style} />
      ))}
    </div>
  );
}
