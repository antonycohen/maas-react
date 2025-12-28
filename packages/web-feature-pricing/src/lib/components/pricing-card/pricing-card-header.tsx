export interface PricingCardHeaderProps {
  title: string;
  titleSuffix?: string;
  price: number;
  description: string;
}

export function PricingCardHeader({ title, titleSuffix, price, description }: PricingCardHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="font-heading text-[26px] font-semibold leading-8 tracking-[-0.52px] text-foreground">
          {title} {titleSuffix && <span className="text-brand-primary">{titleSuffix}</span>}
        </h3>
        <div className="flex flex-col">
          <span className="text-[13px] text-text-secondary">À partir de</span>
          <div className="flex items-start font-heading font-semibold text-foreground">
            <span className="text-[48px] leading-[52px] tracking-[-1.32px]">{price}</span>
            <span className="text-[34px] leading-[40px] tracking-[-0.85px]">€</span>
          </div>
        </div>
      </div>
      <p className="h-[66px] text-base text-foreground line-clamp-3">
        {description}
      </p>
    </div>
  );
}
