import { cn } from '@maas/core-utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from '@maas/core-translations';

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

const defaultMenuItemKeys: { key: string; href: string }[] = [
    { key: 'nav.public.featured', href: '/' },
    { key: 'nav.public.easyMath', href: '/categories/math-faciles' },
    { key: 'nav.public.historyCulture', href: '/categories/histoire-et-cultures' },
    { key: 'nav.public.gamesChallenges', href: '/categories/jeux-et-defi' },
    { key: 'nav.public.magazines', href: '/magazines' },
    { key: 'nav.public.folders', href: '/dossiers' },
    { key: 'nav.public.readingNotes', href: '/categories/note-de-lecture' },
];

interface NavItemProps {
    item: MenuItem;
    isSelected: boolean;
    onClick?: () => void;
}

const NavItem = ({ item, isSelected, onClick }: NavItemProps) => {
    return (
        <Link
            to={item.href}
            onClick={onClick}
            className={cn(
                'flex h-12 items-center justify-center px-3',
                'font-body text-[13px] leading-4 font-bold tracking-[0.26px] uppercase',
                'transition-colors',
                isSelected
                    ? 'border-brand-primary border-b-2 text-black'
                    : 'border-b-2 border-transparent text-black/50 hover:text-black/70'
            )}
        >
            {item.label}
        </Link>
    );
};

const MobileNavItem = ({ item, isSelected, onClick }: NavItemProps) => {
    return (
        <Link
            to={item.href}
            onClick={onClick}
            className={cn(
                'flex w-full items-center px-4 py-3',
                'font-body text-[14px] leading-5 font-bold tracking-[0.26px] uppercase',
                'transition-colors',
                isSelected
                    ? 'border-brand-primary bg-brand-primary/5 border-l-2 text-black'
                    : 'border-l-2 border-transparent text-black/50 hover:bg-gray-50 hover:text-black/70'
            )}
        >
            {item.label}
        </Link>
    );
};

export function LayoutMainMenu({ items, className }: LayoutMainMenuProps) {
    const { t } = useTranslation();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const resolvedItems =
        items ??
        defaultMenuItemKeys.map((item) => ({
            label: t(item.key),
            href: item.href,
        }));

    const isSelected = (href: string) => {
        if (href === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(href);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <nav className={cn('relative', className)}>
            {/* Desktop Menu */}
            <div className="hidden md:flex md:items-center md:justify-center">
                <div className="container mx-auto flex items-center justify-center">
                    <div className="flex items-center justify-center">
                        {resolvedItems.map((item) => (
                            <NavItem key={item.href} item={item} isSelected={isSelected(item.href)} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center justify-between px-4 py-2 md:hidden">
                <span className="font-body text-[14px] font-bold tracking-[0.26px] text-black/70 uppercase">
                    {t('common.menu')}
                </span>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-gray-100"
                    aria-label={isMobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6 text-black/70" />
                    ) : (
                        <Menu className="h-6 w-6 text-black/70" />
                    )}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full right-0 left-0 z-50 border-b border-[#e0e0e0] bg-white shadow-lg md:hidden">
                    <div className="flex flex-col py-2">
                        {resolvedItems.map((item) => (
                            <MobileNavItem
                                key={item.href}
                                item={item}
                                isSelected={isSelected(item.href)}
                                onClick={closeMobileMenu}
                            />
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
