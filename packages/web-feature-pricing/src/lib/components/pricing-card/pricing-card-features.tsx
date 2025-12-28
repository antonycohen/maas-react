import { Check } from 'lucide-react';

export interface PricingFeature {
  text: string;
}

export interface PricingCardFeaturesProps {
  features: PricingFeature[];
}

export function PricingCardFeatures({ features }: PricingCardFeaturesProps) {
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
