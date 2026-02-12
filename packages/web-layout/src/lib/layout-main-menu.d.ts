/** @deprecated Use MenuItem from layout-header-bar instead */
export interface MainMenuItem {
    label: string;
    href: string;
}
/** @deprecated Use MenuItem from layout-header-bar instead */
export type MenuItem = MainMenuItem;
type LayoutMainMenuProps = {
    items?: MenuItem[];
    className?: string;
};
export declare function LayoutMainMenu({
    items,
    className,
}: LayoutMainMenuProps): import('react/jsx-runtime').JSX.Element;
export {};
//# sourceMappingURL=layout-main-menu.d.ts.map
