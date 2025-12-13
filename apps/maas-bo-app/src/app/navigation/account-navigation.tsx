import {
  CircleUserIcon,
  ContrastIcon,
  LogOutIcon,
  UserPlusIcon,
} from 'lucide-react';
import { NavItem } from '@maas/web-components';

export const accountNavigation: NavItem[] = [
  {
    type: 'link',
    title: 'Profile',
    to: `/account/profile`,
    icon: <CircleUserIcon />,
  },
  {
    type: 'link',
    title: 'Invite Member',
    to: `/teams`,
    icon: <UserPlusIcon />,
  },
  {
    type: 'dropdown',
    title: 'Appearance',
    items: [
      { type: 'link', title: 'Light mode', to: '#' },
      { type: 'link', title: 'Dark mode', to: '#' },
      { type: 'link', title: 'System default', to: '#' },
    ],
    icon: <ContrastIcon />,
  },
  { type: 'separator' },
  { type: 'link', title: 'Sign out', to: '/logout', icon: <LogOutIcon /> },
];
