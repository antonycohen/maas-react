import { Outlet } from 'react-router';
import { LayoutContent } from '@maas/web-layout';
import { Skeleton } from '@maas/web-components';
import { useGetUserForAccountSettingsPage } from './hooks/use-get-user-for-account-settings-page';
import { useConnectedUser } from '@maas/core-store-session';
import { EditUserOutletContext } from './types';
import { AccountSidebar } from './components/account-sidebar';
import { AccountMobileNav } from './components/account-mobile-nav';

function AccountSettingsSkeleton() {
    return (
        <LayoutContent className={'container mx-auto min-h-175 gap-8 pb-24'}>
            <div className="flex w-full items-start gap-10">
                {/* Sidebar skeleton */}
                <div className="hidden w-72.5 shrink-0 flex-col gap-3 border-r border-gray-200 pr-5 md:flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-11 w-full rounded-md" />
                    ))}
                </div>

                {/* Content skeleton */}
                <div className="mx-auto w-full max-w-175 flex-1">
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-8 w-48 rounded-md" />
                        <Skeleton className="h-50 w-full rounded-2xl" />
                        <Skeleton className="h-50 w-full rounded-2xl" />
                    </div>
                </div>
            </div>
        </LayoutContent>
    );
}

export function AccountSettingsPage({ baseUrl }: { baseUrl: string }) {
    const connectedUser = useConnectedUser();
    const connectedUserId = connectedUser?.id as string;
    const { user, isLoading } = useGetUserForAccountSettingsPage(connectedUserId);

    const outletContext: EditUserOutletContext = {
        user,
        isLoading,
    };

    if (isLoading) {
        return <AccountSettingsSkeleton />;
    }

    if (!user) {
        return <div>User not found</div>;
    }

    return (
        <LayoutContent className={'container mx-auto min-h-175 gap-8 pb-24'}>
            <div className="flex w-full items-start gap-10">
                <div className="hidden shrink-0 md:flex">
                    <AccountSidebar baseUrl={baseUrl} />
                </div>

                <AccountMobileNav baseUrl={baseUrl} />

                <div className="mx-auto w-full max-w-175 flex-1">
                    <Outlet context={outletContext} />
                </div>
            </div>
        </LayoutContent>
    );
}
