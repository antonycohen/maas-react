import { Badge } from '@maas/web-components';
import { Article } from '@maas/core-api-models';
import { Separator } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';

export const Thematiques = ({
    categories,
    withSeparator = true,
}: {
    categories?: Article['categories'];
    withSeparator?: boolean;
}) => {
    const { t } = useTranslation();
    if (categories?.length === 0) return null;
    return (
        <>
            <div className="flex flex-col gap-5">
                <h2
                    className={
                        'font-body text-left text-[13px] leading-4 font-bold tracking-[0.26px] text-black/50 uppercase transition-colors'
                    }
                >
                    {t('home.themes')}
                </h2>
                <div className={'flex flex-row flex-wrap gap-1'}>
                    {categories?.map((cat, index) => (
                        <Badge
                            key={index}
                            variant={'outline'}
                            className={
                                'font-body rounded-[4px] border-[#E0E0E0] bg-white px-2 py-1 text-[11px] font-semibold tracking-[0.33px] text-black uppercase hover:bg-gray-50'
                            }
                        >
                            {cat.name}
                        </Badge>
                    ))}
                </div>
            </div>
            {withSeparator && <Separator />}
        </>
    );
};
