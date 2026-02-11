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
        <LayoutContent className={'container mx-auto min-h-[700px] gap-8 pb-24'}>
            <div className="flex w-full items-start gap-10">
                <div className="hidden shrink-0 md:flex">
                    <AccountSidebar baseUrl={baseUrl} />
                </div>

                <AccountMobileNav baseUrl={baseUrl} />

                <div className="mx-auto w-full max-w-[600px] flex-1">
                    <Outlet context={outletContext} />
                </div>
            </div>
        </LayoutContent>
    );
}
