import { Outlet } from 'react-router-dom';
import { Footer } from '@maas/web-components';
import { User } from '@maas/core-api-models';
import { LayoutHeaderBar, MenuItem } from './layout-header-bar';

type LayoutProps = {
  connectedUser: User | null;
  menuItems?: MenuItem[];
};

export function Layout(props: LayoutProps) {
  const { connectedUser, menuItems } = props;

  return (
    <div className={'tangente'}>
      <LayoutHeaderBar connectedUser={connectedUser} menuItems={menuItems} />
      <Outlet />
      <Footer />
    </div>
  );
}
