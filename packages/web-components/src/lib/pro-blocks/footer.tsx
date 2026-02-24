import { useMemo } from 'react';
import { Link } from 'react-router';
import { PUBLIC_ROUTES, publicUrlBuilders } from '@maas/core-routes';
import { useTranslation } from '@maas/core-translations';
import { useGetHomepage } from '@maas/core-api';
import { HomepageNewsItem } from '@maas/core-api-models';

interface FooterLink {
    label: string;
    url: string;
    children?: FooterLink[];
}

function extractRecentArticles(news: HomepageNewsItem[]): FooterLink[] {
    return news
        .filter((item): item is Extract<HomepageNewsItem, { type: 'article' }> => item.type === 'article')
        .slice(0, 5)
        .map((item) => ({
            label: item.article.title,
            url: publicUrlBuilders.article(item.article.slug),
        }));
}

interface FooterProps {
    logo?: {
        src: string;
        alt: string;
    };
}

const linkClass =
    'font-body truncate text-[14px] leading-5 font-normal tracking-[-0.07px] text-white/70 transition-colors hover:text-white';
const subLinkClass =
    'font-body truncate text-[13px] leading-5 font-normal tracking-[-0.07px] text-white/50 transition-colors hover:text-white';
const sectionTitleClass = 'font-body text-[13px] leading-4 font-bold tracking-[0.26px] text-white uppercase';

const Footer = ({
    logo = {
        src: '/logo-tangente-full.png',
        alt: 'Tangente',
    },
}: FooterProps) => {
    const { t } = useTranslation();
    const { data: homepage } = useGetHomepage({
        articleFields: 'id,title,slug',
    });

    const recentArticles = useMemo(() => {
        if (!homepage?.news) return [];
        return extractRecentArticles(homepage.news);
    }, [homepage]);

    const mathThemes: FooterLink[] = useMemo(
        () => [
            { label: t('nav.public.geometry'), url: publicUrlBuilders.mathematicalTheme('geometry') },
            { label: t('nav.public.algebra'), url: publicUrlBuilders.mathematicalTheme('algebra') },
            { label: t('nav.public.analysis'), url: publicUrlBuilders.mathematicalTheme('analysis') },
            { label: t('nav.public.arithmetic'), url: publicUrlBuilders.mathematicalTheme('arithmetic') },
            { label: t('nav.public.numerical'), url: publicUrlBuilders.mathematicalTheme('numerical') },
            { label: t('nav.public.logic'), url: publicUrlBuilders.mathematicalTheme('logic') },
            {
                label: t('nav.public.combinatoricsAndGames'),
                url: publicUrlBuilders.mathematicalTheme('combinatorics_and_games'),
            },
            {
                label: t('nav.public.appliedMathematics'),
                url: publicUrlBuilders.mathematicalTheme('applied_mathematics'),
            },
            {
                label: t('nav.public.probabilityAndStatistics'),
                url: publicUrlBuilders.mathematicalTheme('probability_and_statistics'),
            },
        ],
        [t]
    );

    const categories: FooterLink[] = useMemo(
        () => [
            {
                label: t('nav.public.gamesChallenges'),
                url: publicUrlBuilders.category('jeux-et-defi'),
                children: [
                    { label: t('nav.public.problems'), url: publicUrlBuilders.category('problemes') },
                    { label: t('nav.public.shortStory'), url: publicUrlBuilders.category('nouvelle') },
                    { label: t('nav.public.recremaths'), url: publicUrlBuilders.category('recremaths') },
                    {
                        label: t('nav.public.myFavoriteProblems'),
                        url: publicUrlBuilders.category('mes-problemes-preferes'),
                    },
                    { label: t('nav.public.amazingMath'), url: publicUrlBuilders.category('maths-etonnantes') },
                    { label: t('nav.public.logicMatters'), url: publicUrlBuilders.category('affaires-de-logique') },
                ],
            },
            {
                label: t('nav.public.historyCulture'),
                url: publicUrlBuilders.category('histoire-et-cultures'),
                children: [
                    { label: t('nav.public.interview'), url: publicUrlBuilders.category('interview') },
                    {
                        label: t('nav.public.famousPersonalities'),
                        url: publicUrlBuilders.category('personnages-celebres'),
                    },
                    { label: t('nav.public.mathAndHistory'), url: publicUrlBuilders.category('maths-et-histoire') },
                    {
                        label: t('nav.public.mathAndPhilosophy'),
                        url: publicUrlBuilders.category('maths-et-philosophie'),
                    },
                    { label: t('nav.public.mathAndArt'), url: publicUrlBuilders.category('maths-et-art') },
                ],
            },
        ],
        [t]
    );

    const quickLinks: FooterLink[] = useMemo(
        () => [
            { label: t('nav.public.magazines'), url: publicUrlBuilders.magazines() },
            { label: t('nav.public.articles'), url: publicUrlBuilders.articles() },
            { label: t('nav.public.folders'), url: publicUrlBuilders.dossiers() },
        ],
        [t]
    );

    return (
        <section className="flex items-center justify-center bg-[#141414] px-5">
            <div className="container mx-auto flex flex-col gap-20 py-10">
                {/* Top Block - Logo, Tagline, Subscribe */}
                <div className="flex flex-col items-center gap-5">
                    <div className="h-14 w-[150px]">
                        <img src={logo.src} alt={logo.alt} className="h-full w-full object-contain" />
                    </div>
                    <p className="font-heading max-w-[596px] text-center text-2xl leading-[40px] font-semibold tracking-[-0.85px] text-white md:text-[34px]">
                        {t('footer.tagline')}
                    </p>
                    <Link
                        to={PUBLIC_ROUTES.PRICING}
                        className="bg-brand-primary font-body hover:bg-brand-primary/90 flex h-10 items-center justify-center gap-1 rounded px-4 py-2 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-white transition-colors"
                    >
                        {t('footer.subscribe')}
                    </Link>
                </div>

                {/* Bottom Block - Links */}
                <div className="flex flex-col gap-8 md:flex-row md:gap-5">
                    {/* Recent Articles Column */}
                    {recentArticles.length > 0 && (
                        <div className="flex w-full shrink-0 flex-col gap-4 md:w-[228px]">
                            <h3 className={sectionTitleClass}>{t('footer.recentArticles')}</h3>
                            <div className="flex flex-col gap-2">
                                {recentArticles.map((link) => (
                                    <Link key={link.url} to={link.url} className={linkClass}>
                                        {link.label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Mathematical Themes Column */}
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <h3 className={sectionTitleClass}>{t('footer.mathThemes')}</h3>
                        <div className="flex flex-col gap-2">
                            {mathThemes.map((link) => (
                                <Link key={link.url} to={link.url} className={linkClass}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Categories Column */}
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <h3 className={sectionTitleClass}>{t('footer.categories')}</h3>
                        <div className="flex flex-col gap-4">
                            {categories.map((cat) => (
                                <div key={cat.url} className="flex flex-col gap-2">
                                    <Link to={cat.url} className={linkClass}>
                                        {cat.label}
                                    </Link>
                                    {cat.children && (
                                        <div className="flex flex-col gap-1.5 pl-3">
                                            {cat.children.map((child) => (
                                                <Link key={child.url} to={child.url} className={subLinkClass}>
                                                    {child.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        <h3 className={sectionTitleClass}>{t('footer.explore')}</h3>
                        <div className="flex flex-col gap-2">
                            {quickLinks.map((link) => (
                                <Link key={link.url} to={link.url} className={linkClass}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export { Footer };
