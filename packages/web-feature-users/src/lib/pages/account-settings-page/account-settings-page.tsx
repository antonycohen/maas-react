import {Outlet} from 'react-router-dom';
import {TabNavLinks} from '@maas/web-components';
import {LayoutContent, LayoutHeader} from "@maas/web-layout";
import {useGetUserForAccountSettingsPage} from "./hooks/use-get-user-for-account-settings-page";
import {useConnectedUser} from "@maas/core-store-session";
import {EditUserOutletContext} from "./types";

const getTabItems = (baseUrl: string) => [
  { title: 'Profile', url: `${baseUrl}/account/profile` },
  { title: 'Connexion', url: `${baseUrl}/account/connexion` },
  { title: 'Preferences', url: `${baseUrl}/account/preferences` },
];

export function AccountSettingsPage({baseUrl} : {baseUrl: string}) {
  const connectedUser = useConnectedUser();
  const connectedUserId = connectedUser?.id as string;
  const { user, isLoading } =
    useGetUserForAccountSettingsPage(connectedUserId);

  const outletContext: EditUserOutletContext = {
    user,
    isLoading,
  };

  if(!user) {
    return <div>User not found</div>;
  }

  const displayName = user.firstName ?? 'My account';

  return (
      <LayoutContent className={'gap-8'}>
        <LayoutHeader
          pageTitle={displayName}
        />
        <TabNavLinks items={getTabItems(baseUrl)} />
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <Outlet context={outletContext} />
          </div>
        </div>
      </LayoutContent>
  );
}
