import { Outlet } from 'react-router-dom';
import { LayoutContent } from '@maas/web-layout';
import { useGetUserForAccountSettingsPage } from './hooks/use-get-user-for-account-settings-page';
import { useConnectedUser } from '@maas/core-store-session';
import { EditUserOutletContext } from './types';
import { AccountSidebar } from './components/account-sidebar';
import { AccountMobileNav } from './components/account-mobile-nav';

export function AccountSettingsPage({ baseUrl }: { baseUrl: string }) {
  const connectedUser = useConnectedUser();
  const connectedUserId = connectedUser?.id as string;
  const { user, isLoading } = useGetUserForAccountSettingsPage(connectedUserId);

  const outletContext: EditUserOutletContext = {
    user,
    isLoading,
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <LayoutContent className={'gap-8 container mx-auto pb-24 md:pb-0'}>
      <div className="flex gap-10 items-start w-full">
        <div className="hidden md:flex shrink-0">
          <AccountSidebar baseUrl={baseUrl} />
        </div>

        <AccountMobileNav baseUrl={baseUrl} />

        <div className="flex-1 w-full max-w-[600px] mx-auto">
          <Outlet context={outletContext} />
        </div>
      </div>
    </LayoutContent>
  );
}
