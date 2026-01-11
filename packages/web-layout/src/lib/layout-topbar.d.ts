import { User } from '@maas/core-api-models';
type LayoutTopbarProps = {
    connectedUser: User | null;
    onSearchClick?: () => void;
    onLoginClick?: () => void;
    onSubscribeClick?: () => void;
    className?: string;
};
export declare function LayoutTopbar({ connectedUser, onSearchClick, onLoginClick, onSubscribeClick, className, }: LayoutTopbarProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=layout-topbar.d.ts.map