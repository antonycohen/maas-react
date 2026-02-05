import {
    Bell,
    BookCopy,
    Building2,
    CreditCard,
    FileText,
    FolderTree,
    LayoutDashboard,
    List,
    Newspaper,
    Route,
    ShieldCheck,
    SlidersHorizontal,
    Tags,
    Users,
} from 'lucide-react';
import { SidebarNavigationProps } from '@maas/web-components';
import { useRoutes } from '@maas/core-workspace';

export const useMainNavigation = (): SidebarNavigationProps[] => {
    const routes = useRoutes();

    return [
        {
            sectionName: 'Overview',
            items: [
                {
                    title: 'Dashboard',
                    url: routes.root(),
                    icon: LayoutDashboard,
                },
            ],
        },
        {
            sectionName: 'Content',
            items: [
                {
                    title: 'Magazines',
                    url: routes.brands(),
                    icon: Newspaper,
                },
                {
                    title: 'Issues',
                    url: routes.issues(),
                    icon: BookCopy,
                },
                {
                    title: 'Folders',
                    url: routes.folders(),
                    icon: FolderTree,
                },
                {
                    title: 'Articles',
                    url: routes.articles(),
                    icon: FileText,
                },
                {
                    title: 'Categories',
                    url: routes.categories(),
                    icon: Tags,
                },
                {
                    title: 'Enums',
                    url: routes.enums(),
                    icon: List,
                },
                {
                    title: 'Article Types',
                    url: routes.articleTypes(),
                    icon: FolderTree,
                },
            ],
        },
        {
            sectionName: 'Customers',
            items: [
                {
                    title: 'Users',
                    url: routes.users(),
                    icon: Users,
                },
                {
                    title: 'Organizations',
                    url: routes.organizations(),
                    icon: Building2,
                },
                {
                    title: 'Subscriptions',
                    url: routes.subscriptions(),
                    icon: CreditCard,
                },
            ],
        },
        {
            sectionName: 'Engagement',
            items: [
                {
                    title: 'Notifications',
                    url: routes.notifications(),
                    icon: Bell,
                },
            ],
        },
        {
            sectionName: 'Administration',
            items: [
                {
                    title: 'Admins',
                    url: routes.teams(),
                    icon: ShieldCheck,
                },
                {
                    title: 'App Settings',
                    url: routes.settings(),
                    icon: SlidersHorizontal,
                },
                {
                    title: 'Routing Files',
                    url: routes.routingFiles(),
                    icon: Route,
                },
            ],
        },
    ];
};
