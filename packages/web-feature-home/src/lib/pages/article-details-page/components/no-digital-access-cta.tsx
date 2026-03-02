import { useTranslation } from '@maas/core-translations';
import { Info } from 'lucide-react';

export const NoDigitalAccessCTA = () => {
    const { t } = useTranslation();

    return (
        <div className="mx-auto mt-10 flex w-full max-w-[600px] flex-col items-center gap-10">
            <h2 className="font-heading text-center text-4xl leading-[47px] font-semibold tracking-[-1.32px] text-black md:text-[48px] md:leading-[52px]">
                {t('home.noDigitalAccessTitle')}
            </h2>
            <div className="flex items-start gap-3">
                <div className="flex size-5 shrink-0 items-center justify-center">
                    <Info className="size-5 text-amber-600" />
                </div>
                <p className="font-body text-[16px] leading-[22px] tracking-[-0.12px] text-black/70">
                    {t('home.noDigitalAccessDescription')}
                </p>
            </div>
        </div>
    );
};
