import { CheckIcon } from '@radix-ui/react-icons';

export const SubscriptionCTA = () => {
  return (
    <div className="flex flex-col gap-10 items-center w-full max-w-[600px] mx-auto mt-10">
      <h2 className="font-heading text-[48px] font-semibold leading-[52px] tracking-[-1.32px] text-center text-black">
        Devenez membre pour lire cette article, et tout Tangente !
      </h2>
      <div className="flex flex-col gap-3 items-start">
        {[
          'Accès illimité à tous les contenus Tangente Magazine',
          '6 numéros de Tangente en version papier ou numérique',
          '6 numéros de Tangente Hors-série en version papier ou numérique',
          'Résiliable à tout moment.',
        ].map((text, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="shrink-0 size-5 flex items-center justify-center">
              <CheckIcon className={'size-8 stroke-[#079848]'} />
            </div>
            <p className="font-body text-[16px] leading-[22px] text-black/70 tracking-[-0.12px]">
              {text}
            </p>
          </div>
        ))}
      </div>
      <button className="bg-[#E31B22] text-white font-body font-semibold text-[14px] leading-[20px] tracking-[-0.07px] px-4 py-2 rounded-[4px] w-full h-[40px] flex items-center justify-center hover:bg-[#c4161c] transition-colors">
        Je m’abonne
      </button>
    </div>
  );
};
