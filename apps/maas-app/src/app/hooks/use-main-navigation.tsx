import {
    Bell,
    BookCopy,
    Building2,
    CircleDollarSignIcon,
    CreditCard,
    FileText,
    FileTextIcon,
    FolderTree,
    LayoutDashboard,
    List,
    Newspaper,
    Route,
    ShieldCheck,
    ShoppingCartIcon,
    SlidersHorizontal,
    Tags,
    UserRoundSearch,
    Users,
} from 'lucide-react';
import { SidebarNavigationProps } from '@maas/web-components';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

export const useMainNavigation = (): SidebarNavigationProps[] => {
    const routes = useRoutes();
    const { t } = useTranslation();

    return [
        {
            sectionName: t('nav.overview'),
            items: [
                {
                    title: t('nav.dashboard'),
                    url: routes.root(),
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            sectionName: t('nav.content'),
            items: [
                {
                    title: t('nav.magazines'),
                    url: routes.brands(),
                    icon: Newspaper,
                },
                {
                    title: t('nav.issues'),
                    url: routes.issues(),
                    icon: BookCopy,
                },
                {
                    title: t('nav.folders'),
                    url: routes.folders(),
                    icon: FolderTree,
                },
                {
                    title: t('nav.articles'),
                    url: routes.articles(),
                    icon: FileText,
                },
                {
                    title: t('nav.categories'),
                    url: routes.categories(),
                    icon: Tags,
                },
                {
                    title: t('nav.enums'),
                    url: routes.enums(),
                    icon: List,
                },
                {
                    title: t('nav.articleTypes'),
                    url: routes.articleTypes(),
                    icon: FolderTree,
                },
            ],
        },
        {
            sectionName: t('nav.customers'),
            items: [
                {
                    title: t('nav.customers'),
                    url: routes.customers(),
                    icon: UserRoundSearch,
                },
                // {
                //     title: t('nav.users'),
                //     url: routes.users(),
                //     icon: Users,
                // },
                // {
                //     title: t('nav.organizations'),
                //     url: routes.organizations(),
                //     icon: Building2,
                // },
                {
                    title: t('nav.subscriptions'),
                    url: routes.subscriptions(),
                    icon: CreditCard,
                },
            ],
        },
        {
            sectionName: t('nav.productsAndPlans'),
            items: [
                {
                    title: t('nav.plans'),
                    url: routes.pmsPlans(),
                    icon: FileTextIcon,
                },
                {
                    title: t('nav.products'),
                    url: routes.pmsProducts(),
                    icon: ShoppingCartIcon,
                },
                {
                    title: t('nav.prices'),
                    url: routes.pmsPrices(),
                    icon: CircleDollarSignIcon,
                },
            ],
        },
        {
            sectionName: t('nav.engagement'),
            items: [
                {
                    title: t('nav.notifications'),
                    url: routes.notifications(),
                    icon: Bell,
                },
            ],
        },
        {
            sectionName: t('nav.administration'),
            items: [
                {
                    title: t('nav.admins'),
                    url: routes.teams(),
                    icon: ShieldCheck,
                },
                {
                    title: t('nav.appSettings'),
                    url: routes.settings(),
                    icon: SlidersHorizontal,
                },
                {
                    title: t('nav.routingFiles'),
                    url: routes.routingFiles(),
                    icon: Route,
                },
            ],
        },
    ];
};
