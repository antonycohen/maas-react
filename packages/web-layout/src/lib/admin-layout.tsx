import { Outlet } from 'react-router-dom';
import {
  NavMain,
  NavMainProps,
  NavUser,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  TeamSwitcher,
  TeamSwitcherProps,
} from '@maas/web-components';
import { User } from '@maas/core-api-models';

type LayoutProps = {
  connectedUser: User;
  navMain?: NavMainProps;
  teams?: TeamSwitcherProps;
};

export function AdminLayout(props: LayoutProps) {
  const { connectedUser, navMain, teams } = props;

  return (
    <div>
      <SidebarProvider>
        <Sidebar collapsible="icon" className="sidebar-height">
          <SidebarHeader>{teams && <TeamSwitcher {...teams} />}</SidebarHeader>
          <SidebarContent>{navMain && <NavMain {...navMain} />}</SidebarContent>
          <SidebarFooter>
            <NavUser
              user={{
                name:
                  `${connectedUser?.firstName || ''} ${connectedUser?.lastName || ''}`.trim() ||
                  'Guest User',
                avatar: connectedUser?.profileImage?.url ?? undefined,
                email: connectedUser?.email || '',
              }}
            />
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
