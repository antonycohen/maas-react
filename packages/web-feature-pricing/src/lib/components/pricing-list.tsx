import { PricingCard, PricingCardProps } from './pricing-card';
const PRICING_DATA: PricingCardProps[] = [
  {
    title: 'Tangente',
    titleSuffix: 'Plus',
    price: 39,
    description: 'L’accès illimité aux articles du site et Tangente magazine au format papier.',
    tags: [{ label: 'Papier + numérique', style: 'Light' }],
    features: [
      { text: 'Accès illimité à tous les contenus Tangente Magazine' },
      { text: '6 numéros de Tangente en version papier' },
      { text: 'Résiliable à tout moment.' },
    ],
  },
  {
    title: 'Tangente',
    titleSuffix: 'Super +',
    price: 59,
    description: 'L’accès illimité aux articles du site et les magazines Tangente et Hors-Séries au format papier.',
    tags: [{ label: 'Populaire', style: 'Accent' }, { label: 'Papier + numérique', style: 'Light' }],
    features: [
      { text: 'Accès illimité à tous les contenus Tangente Magazine' },
      { text: '6 numéros de Tangente en version papier' },
      { text: '6 numéros de Tangente Hors-série en version papier' },
      { text: 'Résiliable à tout moment.' },
    ],
  },
  {
    title: 'Tangente',
    titleSuffix: 'Soutien',
    price: 79,
    description: 'L’accès illimité aux articles du site et les magazines Tangente et Hors-Séries au format papier.',
    tags: [{ label: 'Recommandé', style: 'Accent' }, { label: 'Papier + numérique', style: 'Light' }],
    isHighlighted: true,
    features: [
      { text: 'Accès illimité à tous les contenus Tangente Magazine' },
      { text: '6 numéros de Tangente en version papier' },
      { text: '6 numéros de Tangente Hors-série en version papier' },
      { text: 'Résiliable à tout moment.' },
    ],
  },
  {
    title: 'Tangente',
    titleSuffix: 'Numérique',
    price: 39,
    description: 'L’accès illimité aux articles du site et Tangente magazine au format numérique.',
    tags: [{ label: '100% numérique', style: 'Light' }],
    features: [
      { text: 'Accès illimité à tous les contenus Tangente Magazine' },
      { text: '6 numéros de Tangente en version papier' },
      { text: 'Résiliable à tout moment.' },
    ],
  },
];

export function PricingList() {

  return (
    <div className="flex flex-col items-center gap-6 py-10 w-full container mx-auto px-5 xl:px-0">
      <h2 className="font-heading text-[48px] font-semibold leading-[52px] tracking-[-1.32px] text-center mb-4">
        <span className="text-foreground">Toutes les formules </span>
        <span className="text-brand-primary">Tangente Magazine</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
        {PRICING_DATA.map((card, index) => (
          <PricingCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}
