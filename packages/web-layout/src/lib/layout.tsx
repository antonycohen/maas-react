import { Outlet } from 'react-router-dom';
import { Footer } from '@maas/web-components';
import { User } from '@maas/core-api-models';
import { LayoutTopbar } from './layout-topbar';
import { LayoutMainMenu, MenuItem } from './layout-main-menu';

type LayoutProps = {
  connectedUser: User | null;
  menuItems?: MenuItem[];
};

export function Layout(props: LayoutProps) {
  const { connectedUser, menuItems } = props;

  return (
    <div className={'tangente'}>
      <LayoutTopbar connectedUser={connectedUser} />
      <LayoutMainMenu items={menuItems} />
      <Outlet />
      <Footer />
    </div>
  );
}
