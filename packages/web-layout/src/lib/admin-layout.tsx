import { Outlet, useNavigate } from 'react-router';
import {
    Button,
    NavItem,
    NavUser,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarNavigation,
    SidebarNavigationProps,
    SidebarProvider,
    SidebarRail,
    TeamSwitcher,
    TeamSwitcherProps,
} from '@maas/web-components';
import { User } from '@maas/core-api-models';
import { ArrowLeftIcon, Badge, BellIcon } from 'lucide-react';
import { useTranslation } from '@maas/core-translations';
import { AdminLayoutTopbar } from './admin-layout-topbar';

type LayoutProps = {
    connectedUser: User;
    mainNavigationGroups?: SidebarNavigationProps[];
    workspaces?: TeamSwitcherProps;
    settingsUrl?: string;
    footerNavigationGroups?: SidebarNavigationProps[];
    navUserItems?: NavItem[];
    backUrl?: string;
};

export function AdminLayout(props: LayoutProps) {
    const {
        connectedUser,
        mainNavigationGroups,
        workspaces,
        footerNavigationGroups = [],
        navUserItems = [],
        backUrl,
    } = props;

    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('../../');
    };

    return (
        <div>
            <SidebarProvider>
                <Sidebar collapsible="icon" className="sidebar-height">
                    <SidebarHeader>
                        {backUrl && (
                            <div>
                                <Button
                                    variant={'outline'}
                                    size={'icon'}
                                    onClick={handleBack}
                                    className="size-auto px-2 py-1 group-data-[collapsible=icon]:size-8"
                                >
                                    <ArrowLeftIcon />
                                    <span className="group-data-[collapsible=icon]:hidden">{t('layout.back')}</span>
                                </Button>
                            </div>
                        )}
                        {workspaces && <TeamSwitcher {...workspaces} />}
                    </SidebarHeader>
                    <SidebarContent>
                        {mainNavigationGroups &&
                            mainNavigationGroups.map((navGroup, index) => (
                                <SidebarNavigation
                                    key={index}
                                    sectionName={navGroup.sectionName}
                                    items={navGroup.items}
                                />
                            ))}
                    </SidebarContent>
                    <SidebarFooter className={'p-0'}>
                        {footerNavigationGroups &&
                            footerNavigationGroups.map((navGroup, index) => (
                                <SidebarNavigation
                                    key={index}
                                    sectionName={navGroup.sectionName}
                                    items={navGroup.items}
                                />
                            ))}
                        <div className={'p-2'}>
                            <NavUser
                                user={{
                                    name:
                                        `${connectedUser?.firstName || ''} ${connectedUser?.lastName || ''}`.trim() ||
                                        t('layout.guestUser'),
                                    avatar: connectedUser?.profileImage?.url ?? undefined,
                                    email: connectedUser?.email || '',
                                }}
                                items={navUserItems}
                            />
                        </div>
                    </SidebarFooter>
                    <SidebarRail />
                </Sidebar>
                <SidebarInset>
                    <header>
                        <AdminLayoutTopbar
                            className={'border-b'}
                            buttons={[
                                <div className="relative">
                                    <Button variant="ghost" size="icon" aria-label={t('layout.notifications')}>
                                        <BellIcon className="size-4" />
                                    </Button>
                                    <Badge className="absolute -top-1.5 -right-1 h-5 min-w-5 px-1.5 text-xs">10</Badge>
                                </div>,
                            ]}
                        />
                    </header>
                    <Outlet />
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
