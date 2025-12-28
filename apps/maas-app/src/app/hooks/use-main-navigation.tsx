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

export const useMainNavigation = (
  workspaceBaseUrl: string,
): SidebarNavigationProps[] => {
  return [
    {
      sectionName: 'Overview',
      items: [
        {
          title: 'Dashboard',
          url: `${workspaceBaseUrl}/`,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      sectionName: 'Content',
      items: [
        {
          title: 'Magazines',
          url: `${workspaceBaseUrl}/brands`,
          icon: Newspaper,
        },
        {
          title: 'Issues',
          url: `${workspaceBaseUrl}/issues`,
          icon: BookCopy,
        },
        {
          title: 'Folders',
          url: `${workspaceBaseUrl}/folders`,
          icon: FolderTree,
        },
        {
          title: 'Articles',
          url: `${workspaceBaseUrl}/articles`,
          icon: FileText,
        },
        {
          title: 'Categories',
          url: `${workspaceBaseUrl}/categories`,
          icon: Tags,
        },
        {
          title: 'Enums',
          url: `${workspaceBaseUrl}/enums`,
          icon: List,
        },
      ],
    },
    {
      sectionName: 'Customers',
      items: [
        {
          title: 'Users',
          url: `${workspaceBaseUrl}/users`,
          icon: Users,
        },
        {
          title: 'Organizations',
          url: `${workspaceBaseUrl}/organizations`,
          icon: Building2,
        },
        {
          title: 'Subscriptions',
          url: `${workspaceBaseUrl}/subscriptions`,
          icon: CreditCard,
        },
      ],
    },
    {
      sectionName: 'Engagement',
      items: [
        {
          title: 'Notifications',
          url: `${workspaceBaseUrl}/notifications`,
          icon: Bell,
        },
      ],
    },
    {
      sectionName: 'Administration',
      items: [
        {
          title: 'Admins',
          url: `${workspaceBaseUrl}/teams`,
          icon: ShieldCheck,
        },
        {
          title: 'App Settings',
          url: `${workspaceBaseUrl}/settings`,
          icon: SlidersHorizontal,
        },
        {
          title: 'Routing Files',
          url: `${workspaceBaseUrl}/routing-files`,
          icon: Route,
        },
      ],
    },
  ];
};
