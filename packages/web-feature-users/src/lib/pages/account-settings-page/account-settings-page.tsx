import { Outlet } from 'react-router-dom';
import { LayoutContent } from '@maas/web-layout';
import { useGetUserForAccountSettingsPage } from './hooks/use-get-user-for-account-settings-page';
import { useConnectedUser } from '@maas/core-store-session';
import { EditUserOutletContext } from './types';
import { AccountSidebar } from './components/account-sidebar';

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
    <LayoutContent className={'gap-8 container mx-auto'}>
      <div className="flex gap-10 items-start w-full">
        <AccountSidebar baseUrl={baseUrl} />
        <div className="flex-1 w-full max-w-[600px]">
          <Outlet context={outletContext} />
        </div>
      </div>
    </LayoutContent>
  );
}
