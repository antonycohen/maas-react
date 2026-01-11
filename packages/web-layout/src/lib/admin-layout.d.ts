import { NavItem, SidebarNavigationProps, TeamSwitcherProps } from '@maas/web-components';
import { User } from '@maas/core-api-models';
type LayoutProps = {
    connectedUser: User;
    mainNavigationGroups?: SidebarNavigationProps[];
    workspaces?: TeamSwitcherProps;
    settingsUrl?: string;
    footerNavigationGroups?: SidebarNavigationProps[];
    navUserItems?: NavItem[];
    backUrl?: string;
};
export declare function AdminLayout(props: LayoutProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=admin-layout.d.ts.map