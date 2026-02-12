import { ArticlesHighlight, CategoryArticles, ContentFeed } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import { fakeArticles, fakeCategoryArticles, fakeFeedItems } from '../mock';

export const HomePage = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col">
            {/* Articles Highlight Section */}
            <div className="container mx-auto">
                <ArticlesHighlight articles={fakeArticles} />
            </div>

            {/* Content Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                <ContentFeed items={fakeFeedItems} />
            </div>

            {/* Jeux & Défis Section - Dark Background */}
            <div className="bg-zinc-900">
                <div className="container mx-auto flex flex-col gap-5 px-5 pt-10 pb-10 xl:px-0">
                    <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                        <span className="text-white">{t('home.discover')}</span>
                        <span className="text-brand-secondary">{t('home.gamesChallenges')}</span>
                    </h2>
                    <CategoryArticles
                        articles={fakeCategoryArticles}
                        viewAllLabel={t('home.viewAllGamesChallenges')}
                        viewAllLink="/categories/jeux-et-defis"
                    />
                </div>
            </div>

            {/* Content Feed Section */}
            <div className="container mx-auto flex flex-col gap-5 px-5 pt-5 pb-10 xl:px-0">
                <h2 className="font-heading text-2xl leading-[40px] font-semibold tracking-[-0.85px] md:text-[34px]">
                    <span className="text-brand-primary">{t('home.latestMathNews')}</span>
                    <span className="text-black">{t('home.continuous')}</span>
                </h2>
                <ContentFeed items={fakeFeedItems} />
            </div>
        </div>
    );
};
