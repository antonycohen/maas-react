import {
  Bell,
  BookCopy,
  Building2,
  CreditCard,
  FileText,
  FolderTree,
  LayoutDashboard,
  Newspaper,
  Route,
  ShieldCheck,
  SlidersHorizontal,
  Tags,
  Users,
} from 'lucide-react';

export const mainNavigation = [
  {
    name: 'Overview',
    items: [
      {
        title: 'Dashboard',
        url: '/',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    name: 'Content',
    items: [
      {
        title: 'Magazines',
        url: '/brands',
        icon: Newspaper,
      },
      {
        title: 'Issues',
        url: '/issues',
        icon: BookCopy,
      },
      {
        title: 'Folders',
        url: '/folders',
        icon: FolderTree,
      },
      {
        title: 'Articles',
        url: '/articles',
        icon: FileText,
      },
      {
        title: 'Categories',
        url: '/categories',
        icon: Tags,
      },
    ],
  },
  {
    name: 'Customers',
    items: [
      {
        title: 'Users',
        url: '/users',
        icon: Users,
      },
      {
        title: 'Organizations',
        url: '/organizations',
        icon: Building2,
      },
      {
        title: 'Subscriptions',
        url: '/subscriptions',
        icon: CreditCard,
      },
    ],
  },
  {
    name: 'Engagement',
    items: [
      {
        title: 'Notifications',
        url: '/notifications',
        icon: Bell,
      },
    ],
  },
  {
    name: 'Administration',
    items: [
      {
        title: 'Admins',
        url: '/admins',
        icon: ShieldCheck,
      },
      {
        title: 'App Settings',
        url: '/settings',
        icon: SlidersHorizontal,
      },
      {
        title: 'Routing Files',
        url: '/routing-files',
        icon: Route,
      },
    ],
  },
];
