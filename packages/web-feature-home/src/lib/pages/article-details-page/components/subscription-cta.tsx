import { CheckIcon } from '@radix-ui/react-icons';
import { useTranslation } from '@maas/core-translations';

export const SubscriptionCTA = () => {
    const { t } = useTranslation();
    return (
        <div className="mx-auto mt-10 flex w-full max-w-[600px] flex-col items-center gap-10">
            <h2 className="font-heading text-center text-4xl leading-[47px] font-semibold tracking-[-1.32px] text-black md:text-[48px] md:leading-[52px]">
                {t('home.subscribeCta')}
            </h2>
            <div className="flex flex-col items-start gap-3">
                {[
                    t('home.subscribeFeature1'),
                    t('home.subscribeFeature2'),
                    t('home.subscribeFeature3'),
                    t('home.cancelAnytime'),
                ].map((text, index) => (
                    <div key={index} className="flex items-start gap-2">
                        <div className="flex size-5 shrink-0 items-center justify-center">
                            <CheckIcon className={'size-8 stroke-[#079848]'} />
                        </div>
                        <p className="font-body text-[16px] leading-[22px] tracking-[-0.12px] text-black/70">{text}</p>
                    </div>
                ))}
            </div>
            <button className="font-body flex h-[40px] w-full items-center justify-center rounded-[4px] bg-[#E31B22] px-4 py-2 text-[14px] leading-[20px] font-semibold tracking-[-0.07px] text-white transition-colors hover:bg-[#c4161c]">
                {t('home.subscribe')}
            </button>
        </div>
    );
};
