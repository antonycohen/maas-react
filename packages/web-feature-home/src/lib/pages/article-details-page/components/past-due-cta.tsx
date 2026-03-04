import { useTranslation } from '@maas/core-translations';
import { Link } from 'react-router';
import { PUBLIC_ROUTES } from '@maas/core-routes';
import { AlertTriangle } from 'lucide-react';

export const PastDueCTA = () => {
    const { t } = useTranslation();

    return (
        <div className="mx-auto mt-10 flex w-full max-w-[600px] flex-col items-center gap-6">
            <div className="flex items-center gap-3">
                <AlertTriangle className="size-6 shrink-0 text-amber-500" />
                <h2 className="font-heading text-center text-2xl leading-tight font-semibold tracking-tight text-black md:text-3xl">
                    {t('home.pastDueTitle')}
                </h2>
            </div>
            <p className="font-body text-center text-[16px] leading-[22px] tracking-[-0.12px] text-black/70">
                {t('home.pastDueDescription')}
            </p>
            <Link
                to={PUBLIC_ROUTES.ACCOUNT_SUBSCRIPTION}
                className="font-body flex h-[40px] w-full items-center justify-center rounded-[4px] bg-[#E31B22] px-4 py-2 text-[14px] leading-[20px] font-semibold tracking-[-0.07px] text-white transition-colors hover:bg-[#c4161c]"
            >
                {t('home.renewSubscription')}
            </Link>
        </div>
    );
};
