import { cn } from '@maas/core-utils';
import { Check } from 'lucide-react';

// Types
export interface PricingFeature {
  text: string;
}

export type TagStyle = 'Light' | 'Accent';

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

// Sub-components
function PricingCardTags({
  tags,
}: {
  tags?: { label: string; style?: TagStyle }[];
}) {
  return (
    <div className="flex flex-wrap gap-0.5 min-h-[24px]">
      {tags?.map((tag, index) => (
        <div
          key={index}
          className={cn(
            'flex h-6 items-center justify-center rounded px-2 py-0 text-[10px] font-semibold uppercase tracking-[0.33px]',
            tag.style === 'Light' &&
              'bg-background border border-border text-foreground',
            tag.style === 'Accent' && 'bg-brand-primary text-white',
          )}
        >
          {tag.label}
        </div>
      ))}
    </div>
  );
}

function PricingCardHeader({
  title,
  titleSuffix,
  price,
  description,
}: {
  title: string;
  titleSuffix?: string;
  price: number;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-[26px] font-semibold leading-8 tracking-[-0.52px] text-foreground">
          {title}{' '}
          {titleSuffix && (
            <span className="text-brand-primary">{titleSuffix}</span>
          )}
        </h3>
        <div className="flex flex-col">
          <span className="text-[13px] text-text-secondary">À partir de</span>
          <div className="flex items-start font-heading font-semibold text-foreground">
            <span className="text-[48px] leading-[52px] tracking-[-1.32px]">
              {price}
            </span>
            <span className="text-[34px] leading-[40px] tracking-[-0.85px]">
              €
            </span>
          </div>
        </div>
      </div>
      <p className="h-[66px] text-base text-foreground line-clamp-3">
        {description}
      </p>
    </div>
  );
}

function PricingCardButton({
  text,
  isHighlighted,
}: {
  text: string;
  isHighlighted?: boolean;
}) {
  return (
    <button
      className={cn(
        'flex h-10 w-full items-center justify-center rounded px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer',
        isHighlighted
          ? 'bg-brand-primary hover:bg-brand-primary/90'
          : 'bg-[#141414] hover:bg-[#141414]/90',
      )}
    >
      {text}
    </button>
  );
}

function PricingCardFeatures({ features }: { features: PricingFeature[] }) {
  return (
    <div className="flex flex-col gap-3">
      {features.map((feature, index) => (
        <div key={index} className="flex gap-2 items-start">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
            <Check size={12} strokeWidth={3} />
          </div>
          <p className="text-sm text-text-secondary leading-5">
            {feature.text}
          </p>
        </div>
      ))}
    </div>
  );
}

// Main component
export function PricingCard({
  title,
  titleSuffix,
  price,
  description,
  features,
  tags,
  isHighlighted,
  buttonText = "Je m'abonne",
}: PricingCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-0 rounded-xl bg-background p-3',
        isHighlighted
          ? 'border-2 border-brand-primary shadow-[0px_0px_8px_0px_rgba(0,0,0,0.06),3px_8px_20px_0px_rgba(0,0,0,0.1)]'
          : 'border border-border',
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
