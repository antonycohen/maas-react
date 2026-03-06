import { LogOutIcon } from 'lucide-react';
import { NavItem } from '@maas/web-components';
import { PUBLIC_ROUTES } from '@maas/core-routes';

export const useUserNavigation = (): NavItem[] => {
    return [
        // {
        //     type: 'link',
        //     title: 'Profile',
        //     to: routes.accountProfile(),
        //     icon: <CircleUserIcon />,
        // },
        // {
        //     type: 'link',
        //     title: 'Invite Member',
        //     to: routes.settingsTeams(),
        //     icon: <UserPlusIcon />,
        // },
        // {
        //     type: 'link',
        //     title: 'Upgrade to Tint pro',
        //     to: routes.accountProfile(),
        //     icon: <ZapIcon />,
        // },
        // {
        //     type: 'link',
        //     title: 'Get free credits',
        //     to: routes.accountProfile(),
        //     icon: <HandCoinsIcon />,
        // },
        // {
        //     type: 'dropdown',
        //     title: 'Appearance',
        //     items: [
        //         { type: 'link', title: 'Light mode', to: '#' },
        //         { type: 'link', title: 'Dark mode', to: '#' },
        //         { type: 'link', title: 'System default', to: '#' },
        //     ],
        //     icon: <ContrastIcon />,
        // },
        // { type: 'separator' },
        {
            type: 'link',
            title: 'Sign out',
            to: PUBLIC_ROUTES.LOGOUT,
            icon: <LogOutIcon />,
        },
    ];
};
