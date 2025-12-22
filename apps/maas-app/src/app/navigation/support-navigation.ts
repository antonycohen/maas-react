import { BookOpenIcon, LifeBuoyIcon, NewspaperIcon } from 'lucide-react';
import { SidebarNavigationProps } from '@maas/web-components';

export const supportNavigation: SidebarNavigationProps[] = [
  {
    sectionName: 'Support',
    items: [
      {
        title: 'Documentation',
        icon: BookOpenIcon,
        url: 'https://help.maas.com',
      },
      {
        title: "What's new",
        icon: NewspaperIcon,
        url: 'https://maas.com/blog',
      },
      {
        title: 'Message support',
        icon: LifeBuoyIcon,
        url: 'https://maas.com/blog',
      },
    ],
  },
];
