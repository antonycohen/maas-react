import { cn } from '@maas/core-utils';

export interface PricingCardButtonProps {
  text: string;
  isHighlighted?: boolean;
}

export function PricingCardButton({ text, isHighlighted }: PricingCardButtonProps) {
  return (
    <button
      className={cn(
        'flex h-10 w-full items-center justify-center rounded px-4 py-2 text-sm font-semibold text-white transition-colors cursor-pointer',
        isHighlighted ? 'bg-brand-primary hover:bg-brand-primary/90' : 'bg-[#141414] hover:bg-[#141414]/90'
      )}
    >
      {text}
    </button>
  );
}
