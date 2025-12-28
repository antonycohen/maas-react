import { cn } from '@maas/core-utils';
import { PricingCardTags } from './pricing-card-tags';
import { PricingCardHeader } from './pricing-card-header';
import { PricingCardButton } from './pricing-card-button';
import { PricingCardFeatures, PricingFeature } from './pricing-card-features';
import { TagStyle } from '../tag';

export interface PricingCardProps {
  title: string;
  titleSuffix?: string;
  price: number;
  description: string;
  features: PricingFeature[];
  tags?: { label: string; style?: TagStyle }[];
  isHighlighted?: boolean;
  buttonText?: string;
}

export function PricingCard({
  title,
  titleSuffix,
  price,
  description,
  features,
  tags,
  isHighlighted,
  buttonText = "Je m’abonne",
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0 rounded-xl bg-background p-3',
        isHighlighted
          ? 'border-2 border-brand-primary shadow-[0px_0px_8px_0px_rgba(0,0,0,0.06),3px_8px_20px_0px_rgba(0,0,0,0.1)]'
          : 'border border-border'
      )}
    >
      <div className="flex flex-col gap-6 p-2">
        <PricingCardTags tags={tags} />
        <PricingCardHeader
          title={title}
          titleSuffix={titleSuffix}
          price={price}
          description={description}
        />
        <PricingCardButton text={buttonText} isHighlighted={isHighlighted} />
        <div className="h-px w-full bg-border" />
        <PricingCardFeatures features={features} />
      </div>
    </div>
  );
}
