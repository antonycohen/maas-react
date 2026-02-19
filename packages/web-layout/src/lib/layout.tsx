import { useState, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer, GlobalSearch } from '@maas/web-components';
import { User } from '@maas/core-api-models';
import { LayoutHeaderBar, MenuItem } from './layout-header-bar';

type LayoutProps = {
    connectedUser: User | null;
    menuItems?: MenuItem[];
};

export function Layout(props: LayoutProps) {
    const { connectedUser, menuItems } = props;
    const [searchOpen, setSearchOpen] = useState(false);

    const handleSearchClick = useCallback(() => setSearchOpen(true), []);

    return (
        <div className={'tangente'}>
            <LayoutHeaderBar
                connectedUser={connectedUser}
                menuItems={menuItems}
                onSearchClick={handleSearchClick}
                loginHref="/login"
                subscribeHref="/pricing"
            />
            <Outlet />
            <Footer />
            <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
        </div>
    );
}
