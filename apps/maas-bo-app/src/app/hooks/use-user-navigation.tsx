import {CircleUserIcon, ContrastIcon, HandCoinsIcon, LogOutIcon, UserPlusIcon, ZapIcon} from "lucide-react";
import {NavItem} from "@maas/web-components";

export const useUserNavigation = (baseWorkspaceUrl: string, suffixUrl?: string) : NavItem[] => {

  const baseUrl = suffixUrl ? `${baseWorkspaceUrl}${suffixUrl}` : baseWorkspaceUrl;

  return [
    { type: 'link', title: 'Profile', to: `${baseUrl}/account/profile`, icon: <CircleUserIcon /> },
    { type: 'link', title: 'Invite Member', to: `${baseWorkspaceUrl}/settings/teams`, icon: <UserPlusIcon /> },
    { type: 'link', title: 'Upgrade to Tint pro', to: `${baseUrl}/account/profile`, icon: <ZapIcon /> },
    { type: 'link', title: 'Get free credits', to: `${baseUrl}/account/profile`, icon: <HandCoinsIcon /> },
    { type: 'dropdown', title: 'Appearance', items: [
        { type: 'link', title: 'Light mode', to: '#' },
        { type: 'link', title: 'Dark mode', to: '#' },
        { type: 'link', title: 'System default', to: '#' },
      ], icon: <ContrastIcon />},
    { type: "separator"},
    { type: 'link', title: 'Sign out', to: '/logout', icon: <LogOutIcon /> },
  ]
}
