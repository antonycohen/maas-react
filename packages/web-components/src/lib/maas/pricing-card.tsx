import { cn } from '@maas/core-utils';
import { Check } from 'lucide-react';

// Types
export interface PricingFeature {
    text: string;
}

export type TagStyle = 'Light' | 'Accent';

export interface SecondaryPrice {
    label: string;
    amount: number;
}

export interface PricingCardProps {
    title: string;
    titleSuffix?: string;
    price: number;
    priceLabel?: string;
    secondaryPrices?: SecondaryPrice[];
    description: string;
    features: PricingFeature[];
    tags?: { label: string; style?: TagStyle }[];
    isHighlighted?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    buttonText?: string;
}

// Sub-components
function PricingCardTags({ tags }: { tags?: { label: string; style?: TagStyle }[] }) {
    return (
        <div className="flex min-h-[24px] flex-wrap gap-0.5">
            {tags?.map((tag, index) => (
                <div
                    key={index}
                    className={cn(
                        'flex h-6 items-center justify-center rounded px-2 py-0 text-[10px] font-semibold tracking-[0.33px] uppercase',
                        tag.style === 'Light' && 'bg-background border-border text-foreground border',
                        tag.style === 'Accent' && 'bg-brand-primary text-white'
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
    priceLabel,
    secondaryPrices,
    description,
}: {
    title: string;
    titleSuffix?: string;
    price: number;
    priceLabel?: string;
    secondaryPrices?: SecondaryPrice[];
    description: string;
}) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
                <h3 className="font-heading text-foreground text-[26px] leading-8 font-semibold tracking-[-0.52px]">
                    {title} {titleSuffix && <span className="text-brand-primary">{titleSuffix}</span>}
                </h3>
                <div className="flex flex-col">
                    <span className="text-text-secondary text-[13px]">À partir de</span>
                    <div className="font-heading text-foreground flex items-baseline font-semibold">
                        <span className="text-[48px] leading-[52px] tracking-[-1.32px]">{price}</span>
                        <span className="text-[34px] leading-[40px] tracking-[-0.85px]">€</span>
                        {priceLabel && (
                            <span className="text-text-secondary ml-1 text-base font-normal">{priceLabel}</span>
                        )}
                    </div>
                    {secondaryPrices && secondaryPrices.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5">
                            {secondaryPrices.map((sp, i) => (
                                <span key={i} className="text-text-secondary text-xs">
                                    {sp.amount}€ {sp.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <p className="text-foreground line-clamp-3 h-[66px] text-base">{description}</p>
        </div>
    );
}

function PricingCardButton({ text, isHighlighted }: { text: string; isHighlighted?: boolean }) {
    return (
        <button
            className={cn(
                'flex h-10 w-full cursor-pointer items-center justify-center rounded px-4 py-2 text-sm font-semibold text-white transition-colors',
                isHighlighted ? 'bg-brand-primary hover:bg-brand-primary/90' : 'bg-[#141414] hover:bg-[#141414]/90'
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
                <div key={index} className="flex items-start gap-2">
                    <div className="bg-success/10 text-success flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    <p className="text-text-secondary text-sm leading-5">{feature.text}</p>
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
    priceLabel,
    secondaryPrices,
    description,
    features,
    tags,
    isHighlighted,
    isSelected,
    onSelect,
    buttonText = "Je m'abonne",
}: PricingCardProps) {
    return (
        <div
            onClick={onSelect}
            className={cn(
                'bg-background flex flex-col gap-0 rounded-xl p-3 transition-all',
                onSelect && 'cursor-pointer',
                isSelected
                    ? 'border-brand-primary border-2 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.06),3px_8px_20px_0px_rgba(0,0,0,0.1)]'
                    : isHighlighted
                      ? 'border-brand-primary border-2 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.06),3px_8px_20px_0px_rgba(0,0,0,0.1)]'
                      : 'border-border border'
            )}
        >
            <div className="flex flex-col gap-6 p-2">
                <PricingCardTags tags={tags} />
                <PricingCardHeader
                    title={title}
                    titleSuffix={titleSuffix}
                    price={price}
                    priceLabel={priceLabel}
                    secondaryPrices={secondaryPrices}
                    description={description}
                />
                <PricingCardButton text={buttonText} isHighlighted={isHighlighted || isSelected} />
                <div className="bg-border h-px w-full" />
                <PricingCardFeatures features={features} />
            </div>
        </div>
    );
}
