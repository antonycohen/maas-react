import { Outlet } from 'react-router-dom';
import { Footer, Navbar } from '@maas/web-components';
import { User } from '@maas/core-api-models';

type LayoutProps = {
  connectedUser: User | null;
};

export function Layout(props: LayoutProps) {
  const { connectedUser } = props;

  return (
    <div>
      <Navbar connectedUser={connectedUser} />
      <Outlet />
      <Footer />
    </div>
  );
}
