import { PricingList } from '../../components/pricing-list';
import { PricingBottomSection } from '../../components/pricing-bottom-section';


export const PricingPage = () => {
  return (
    <div className="flex flex-col w-full">
      <PricingList />
      <PricingBottomSection />
    </div>
  );
}
