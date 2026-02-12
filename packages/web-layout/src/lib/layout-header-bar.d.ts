import { User } from '@maas/core-api-models';
export interface MenuItem {
    label: string;
    href: string;
}
type LayoutHeaderBarProps = {
    connectedUser: User | null;
    menuItems?: MenuItem[];
    onSearchClick?: () => void;
    loginHref?: string;
    subscribeHref?: string;
    className?: string;
};
export declare function LayoutHeaderBar({
    connectedUser,
    menuItems,
    onSearchClick,
    loginHref,
    subscribeHref,
    className,
}: LayoutHeaderBarProps): import('react/jsx-runtime').JSX.Element;
export {};
//# sourceMappingURL=layout-header-bar.d.ts.map
