import { cn } from '@maas/core-utils';
import { User } from '@maas/core-api-models';
import {
    NavigationMenu as RadixNavigationMenu,
    NavigationMenuList,
    NavigationMenuItem as RadixNavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
} from '@maas/web-components';
import { ChevronDown, Menu, Search, UserCircle, X } from 'lucide-react';
import { useState, useEffect, useRef, useMemo, RefObject, ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { useTranslation } from '@maas/core-translations';
import { publicUrlBuilders, PUBLIC_ROUTES } from '@maas/core-routes';

// =============================================================================
// Types
// =============================================================================

export interface MenuItem {
    label: string;
    href: string;
    children?: MenuItem[];
}

type LayoutHeaderBarProps = {
    connectedUser: User | null;
    menuItems?: MenuItem[];
    onSearchClick?: () => void;
    loginHref?: string;
    subscribeHref?: string;
    className?: string;
};

// =============================================================================
// Constants
// =============================================================================

type MenuItemKeyDef = {
    key: string;
    href: string;
    children?: { key: string; href: string }[];
};

const defaultMenuItemKeys: MenuItemKeyDef[] = [
    { key: 'nav.public.featured', href: publicUrlBuilders.home() },
    {
        key: 'nav.public.mathsForAll',
        href: publicUrlBuilders.category('maths-pour-tous'),
        children: [
            { key: 'nav.public.curiosity', href: publicUrlBuilders.category('curiosite') },
            { key: 'nav.public.dailyMath', href: publicUrlBuilders.category('maths-du-quotidien') },
            { key: 'nav.public.mathForEveryone', href: publicUrlBuilders.category('maths-tous-publics') },
            { key: 'nav.public.readersCorrespondence', href: publicUrlBuilders.category('courrier-des-lecteurs') },
            { key: 'nav.public.knowledge', href: publicUrlBuilders.category('savoirs') },
        ],
    },
    {
        key: 'nav.public.historyCulture',
        href: publicUrlBuilders.category('histoire-et-cultures'),
        children: [
            { key: 'nav.public.interview', href: publicUrlBuilders.category('interview') },
            { key: 'nav.public.famousPersonalities', href: publicUrlBuilders.category('personnages-celebres') },
            { key: 'nav.public.mathAndHistory', href: publicUrlBuilders.category('maths-et-histoire') },
            { key: 'nav.public.mathAndPhilosophy', href: publicUrlBuilders.category('maths-et-philosophie') },
            { key: 'nav.public.mathAndArt', href: publicUrlBuilders.category('maths-et-art') },
        ],
    },
    {
        key: 'nav.public.gamesChallenges',
        href: publicUrlBuilders.category('jeux-et-defi'),
        children: [
            { key: 'nav.public.problems', href: publicUrlBuilders.category('problemes') },
            { key: 'nav.public.shortStory', href: publicUrlBuilders.category('nouvelle') },
            { key: 'nav.public.recremaths', href: publicUrlBuilders.category('recremaths') },
            { key: 'nav.public.myFavoriteProblems', href: publicUrlBuilders.category('mes-problemes-preferes') },
            { key: 'nav.public.amazingMath', href: publicUrlBuilders.category('maths-etonnantes') },
            { key: 'nav.public.logicMatters', href: publicUrlBuilders.category('affaires-de-logique') },
        ],
    },
    {
        key: 'nav.public.mathThemes',
        href: '#',
        children: [
            { key: 'nav.public.geometry', href: publicUrlBuilders.mathematicalTheme('geometry') },
            { key: 'nav.public.algebra', href: publicUrlBuilders.mathematicalTheme('algebra') },
            { key: 'nav.public.analysis', href: publicUrlBuilders.mathematicalTheme('analysis') },
            { key: 'nav.public.arithmetic', href: publicUrlBuilders.mathematicalTheme('arithmetic') },
            { key: 'nav.public.numerical', href: publicUrlBuilders.mathematicalTheme('numerical') },
            { key: 'nav.public.logic', href: publicUrlBuilders.mathematicalTheme('logic') },
            {
                key: 'nav.public.combinatoricsAndGames',
                href: publicUrlBuilders.mathematicalTheme('combinatorics_and_games'),
            },
            { key: 'nav.public.appliedMathematics', href: publicUrlBuilders.mathematicalTheme('applied_mathematics') },
            {
                key: 'nav.public.probabilityAndStatistics',
                href: publicUrlBuilders.mathematicalTheme('probability_and_statistics'),
            },
        ],
    },
    { key: 'nav.public.magazines', href: publicUrlBuilders.magazines() },
    { key: 'nav.public.folders', href: publicUrlBuilders.dossiers() },
];

function resolveMenuItems(keys: MenuItemKeyDef[], t: (key: string) => string): MenuItem[] {
    return keys.map((item) => ({
        label: t(item.key),
        href: item.href,
        children: item.children?.map((child) => ({
            label: t(child.key),
            href: child.href,
        })),
    }));
}

const styles = {
    iconButton:
        'flex h-10 w-10 items-center justify-center rounded border border-[#e0e0e0] bg-white transition-colors hover:bg-gray-50',
    subscribeButton:
        'flex h-10 items-center justify-center rounded bg-brand-primary transition-colors hover:bg-brand-primary/90',
    subscribeText: 'px-1 font-body font-semibold leading-5 tracking-[-0.07px] text-white',
    bodyText: 'font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-black',
    navItem: 'font-body text-xs leading-4 font-bold tracking-[0.26px] uppercase xl:text-[13px]',
    navTrigger: cn(
        'flex h-12 items-center justify-center gap-1 px-3',
        'font-body text-xs leading-4 font-bold tracking-[0.26px] uppercase xl:text-[13px]',
        'transition-colors rounded-none bg-transparent',
        'border-b-2 border-transparent text-black/50 hover:text-black/70 hover:bg-transparent',
        'data-[state=open]:text-black data-[state=open]:border-brand-primary data-[state=open]:bg-transparent',
        'focus:bg-transparent focus:outline-none focus-visible:ring-0'
    ),
    dropdownLink: cn(
        'block w-full px-5 py-3 text-left',
        'font-body text-xs font-semibold leading-4 tracking-[0.26px] uppercase',
        'text-black/60 transition-colors hover:bg-gray-50 hover:text-black',
        'rounded-none'
    ),
} as const;

// =============================================================================
// Hooks
// =============================================================================

function useHeaderScroll(topBarRef: RefObject<HTMLDivElement | null>) {
    const [isMobileScrolled, setIsMobileScrolled] = useState(false);
    const [isDesktopScrolled, setIsDesktopScrolled] = useState(false);
    const [topBarHeight, setTopBarHeight] = useState(0);

    useEffect(() => {
        const updateHeight = () => {
            if (topBarRef.current) {
                setTopBarHeight(topBarRef.current.offsetHeight);
            }
        };

        const handleScroll = () => {
            updateHeight();
            setIsMobileScrolled(window.scrollY > 0);
            setIsDesktopScrolled(window.scrollY > (topBarRef.current?.offsetHeight ?? 80));
        };

        updateHeight();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', updateHeight);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', updateHeight);
        };
    }, [topBarRef]);

    return { isMobileScrolled, isDesktopScrolled, topBarHeight };
}

// =============================================================================
// Sub-components
// =============================================================================

function IconButton({
    onClick,
    ariaLabel,
    children,
    className,
}: {
    onClick?: () => void;
    ariaLabel: string;
    children: ReactNode;
    className?: string;
}) {
    return (
        <button onClick={onClick} className={cn(styles.iconButton, className)} aria-label={ariaLabel}>
            {children}
        </button>
    );
}

function SubscribeButton({ href, compact = false }: { href?: string; compact?: boolean }) {
    const { t } = useTranslation();
    return (
        <Link to={href ?? PUBLIC_ROUTES.PRICING} className={cn(styles.subscribeButton, compact ? 'px-3' : 'px-4')}>
            <span className={cn(styles.subscribeText, compact ? 'text-[10px] md:text-[14px]' : 'text-[14px]')}>
                {t('home.subscribe')}
            </span>
        </Link>
    );
}

function Logo({ variant = 'full', className }: { variant?: 'full' | 'icon'; className?: string }) {
    const src = variant === 'icon' ? '/logo-tangente-icon.png' : '/logo-tangente-full.png';

    return (
        <Link to={PUBLIC_ROUTES.HOME} className={className}>
            <img src={src} alt="Tangente" className="h-full w-full object-contain" />
        </Link>
    );
}

function SearchBar({ onClick }: { onClick?: () => void }) {
    const { t } = useTranslation();
    return (
        <button
            onClick={onClick}
            className="hidden h-10 w-[480px] items-center justify-center gap-2 rounded border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-2 transition-colors hover:bg-[#ebebeb] lg:flex"
        >
            <Search className="h-5 w-5 text-black/50" />
            <span className="font-body text-[14px] leading-5 font-normal tracking-[-0.07px] text-black/50">
                {t('home.searchOnTangente')}
            </span>
        </button>
    );
}

function DesktopNavMenu({ items, className }: { items: MenuItem[]; className?: string }) {
    return (
        <RadixNavigationMenu viewport={false} className={cn('max-w-none', className)}>
            <NavigationMenuList className="gap-0">
                {items.map((item) =>
                    item.children && item.children.length > 0 ? (
                        <RadixNavigationMenuItem key={item.href}>
                            <NavigationMenuTrigger className={styles.navTrigger}>
                                <Link to={item.href} onClick={(e) => e.stopPropagation()} className="outline-none">
                                    {item.label}
                                </Link>
                            </NavigationMenuTrigger>
                            <NavigationMenuContent className="z-40 min-w-[240px] rounded-md border border-[#e0e0e0] bg-white py-2 shadow-lg">
                                {item.children.map((child) => (
                                    <NavigationMenuLink key={child.href} asChild>
                                        <Link to={child.href} className={styles.dropdownLink}>
                                            {child.label}
                                        </Link>
                                    </NavigationMenuLink>
                                ))}
                            </NavigationMenuContent>
                        </RadixNavigationMenuItem>
                    ) : (
                        <RadixNavigationMenuItem key={item.href}>
                            <NavLink
                                to={item.href}
                                end={item.href === PUBLIC_ROUTES.HOME}
                                className={({ isActive }) =>
                                    cn(
                                        'flex h-12 items-center justify-center px-3',
                                        'font-body text-xs leading-4 font-bold tracking-[0.26px] uppercase xl:text-[13px]',
                                        'transition-colors',
                                        isActive
                                            ? 'border-brand-primary border-b-2 text-black'
                                            : 'border-b-2 border-transparent text-black/50 hover:text-black/70'
                                    )
                                }
                            >
                                {item.label}
                            </NavLink>
                        </RadixNavigationMenuItem>
                    )
                )}
            </NavigationMenuList>
        </RadixNavigationMenu>
    );
}

function MobileNavItem({ item, onClick }: { item: MenuItem; onClick?: () => void }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (item.children && item.children.length > 0) {
        return (
            <div>
                <div
                    className={cn(
                        'flex w-full items-center',
                        'transition-colors',
                        isExpanded
                            ? 'border-brand-primary bg-brand-primary/5 border-l-2'
                            : 'border-l-2 border-transparent hover:bg-gray-50'
                    )}
                >
                    <NavLink
                        to={item.href}
                        onClick={onClick}
                        className={cn(
                            'flex flex-1 items-center px-4 py-3',
                            'font-body text-[14px] leading-5 font-bold tracking-[0.26px] uppercase',
                            isExpanded ? 'text-black' : 'text-black/50 hover:text-black/70'
                        )}
                    >
                        {item.label}
                    </NavLink>
                    <button
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="flex h-full items-center px-4 py-3"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-black/50 transition-transform duration-200',
                                isExpanded && 'rotate-180'
                            )}
                        />
                    </button>
                </div>
                {isExpanded && (
                    <div className="bg-gray-50/30 py-1">
                        {item.children.map((child) => (
                            <NavLink
                                key={child.href}
                                to={child.href}
                                onClick={onClick}
                                className={({ isActive }) =>
                                    cn(
                                        'flex w-full items-center py-3 pr-4 pl-10',
                                        'font-body text-xs leading-4 font-semibold tracking-[0.26px] uppercase',
                                        'transition-colors',
                                        isActive ? 'text-brand-primary' : 'text-black/50 hover:text-black/70'
                                    )
                                }
                            >
                                {child.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.href}
            end={item.href === PUBLIC_ROUTES.HOME}
            onClick={onClick}
            className={({ isActive }) =>
                cn(
                    'flex w-full items-center px-4 py-3',
                    'font-body text-[14px] leading-5 font-bold tracking-[0.26px] uppercase',
                    'transition-colors',
                    isActive
                        ? 'border-brand-primary bg-brand-primary/5 border-l-2 text-black'
                        : 'border-l-2 border-transparent text-black/50 hover:bg-gray-50 hover:text-black/70'
                )
            }
        >
            {item.label}
        </NavLink>
    );
}

function UserButton({
    connectedUser,
    loginHref,
    showLabel = false,
    className,
}: {
    connectedUser: User | null;
    loginHref?: string;
    showLabel?: boolean;
    className?: string;
}) {
    const { t } = useTranslation();
    if (connectedUser) {
        return (
            <Link
                to={PUBLIC_ROUTES.ACCOUNT}
                className={cn(
                    'flex h-10 items-center justify-center gap-1 rounded border border-[#e0e0e0] bg-white transition-colors hover:bg-gray-50',
                    showLabel ? 'px-2 md:px-4' : 'w-10',
                    className
                )}
                aria-label={t('layout.myAccount')}
            >
                <UserCircle className="h-5 w-5 text-black" />
                {showLabel && (
                    <span className="font-body hidden px-1 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-black sm:inline">
                        {connectedUser.firstName || t('layout.myAccount')}
                    </span>
                )}
            </Link>
        );
    }

    return (
        <Link
            to={loginHref ?? PUBLIC_ROUTES.LOGIN}
            className={cn(
                'flex h-10 items-center justify-center gap-1 rounded border border-[#e0e0e0] bg-white transition-colors hover:bg-gray-50',
                showLabel ? 'hidden px-4 sm:flex' : 'w-10',
                className
            )}
            aria-label={t('layout.signIn')}
        >
            <UserCircle className="h-5 w-5 text-black" />
            {showLabel && (
                <span className="font-body px-1 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-black">
                    {t('layout.signIn')}
                </span>
            )}
        </Link>
    );
}

// =============================================================================
// Main Component
// =============================================================================

export function LayoutHeaderBar({
    connectedUser,
    menuItems,
    onSearchClick,
    loginHref,
    subscribeHref,
    className,
}: LayoutHeaderBarProps) {
    const { t } = useTranslation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const resolvedMenuItems = useMemo(() => menuItems ?? resolveMenuItems(defaultMenuItemKeys, t), [menuItems, t]);
    const topBarRef = useRef<HTMLDivElement>(null);

    const { isMobileScrolled, isDesktopScrolled, topBarHeight } = useHeaderScroll(topBarRef);

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    return (
        <header className={cn('relative', className)}>
            {/* Spacer to prevent content jump when mobile header becomes fixed */}
            {isMobileScrolled && <div className="lg:hidden" style={{ height: topBarHeight }} aria-hidden="true" />}

            {/* Top Bar - Fixed on mobile when scrolled, scrolls on desktop */}
            <div
                ref={topBarRef}
                className={cn(
                    'flex items-center justify-center bg-white px-4 xl:px-0',
                    isMobileScrolled && 'fixed top-0 right-0 left-0 z-50 shadow-md md:shadow-none lg:relative'
                )}
            >
                <div className="container mx-auto flex items-center justify-center py-3">
                    <div className="flex w-full items-center justify-between gap-3 md:justify-center">
                        {/* Left - Logo + Mobile Menu Button */}
                        <div className="flex items-center gap-2 md:flex-1">
                            <button
                                onClick={toggleMobileMenu}
                                className="flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-gray-100 lg:hidden"
                                aria-label={isMobileMenuOpen ? t('common.closeMenu') : t('common.openMenu')}
                            >
                                {isMobileMenuOpen ? (
                                    <X className="h-6 w-6 text-black/70" />
                                ) : (
                                    <Menu className="h-6 w-6 text-black/70" />
                                )}
                            </button>

                            <Logo className="h-10 w-[100px] md:h-14 md:w-[150px]" />
                        </div>

                        <SearchBar onClick={onSearchClick} />

                        {/* Right - Actions */}
                        <div className="flex items-center justify-end gap-2 md:flex-1">
                            <IconButton onClick={onSearchClick} ariaLabel={t('common.search')} className="lg:hidden">
                                <Search className="h-5 w-5 text-black" />
                            </IconButton>

                            <UserButton connectedUser={connectedUser} loginHref={loginHref} showLabel />

                            <SubscribeButton href={subscribeHref} compact />
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop Navigation Menu - Static */}
            <div className="hidden bg-white lg:flex lg:justify-center">
                <DesktopNavMenu items={resolvedMenuItems} />
            </div>

            {/* Fixed Navigation Bar - Desktop only, appears when scrolled */}
            <div
                className={cn(
                    'fixed top-0 right-0 left-0 z-50 hidden border-b border-[#e0e0e0] bg-white shadow-md transition-transform duration-300 ease-out lg:block',
                    isDesktopScrolled ? 'translate-y-0' : '-translate-y-full'
                )}
            >
                <div className="flex items-center justify-center px-4">
                    <div className="container mx-auto flex items-center justify-between">
                        <DesktopNavMenu items={resolvedMenuItems} className="flex-1 justify-center" />

                        <div className="flex shrink-0 items-center gap-2">
                            <SubscribeButton href={subscribeHref} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div
                    className={cn(
                        'absolute right-0 left-0 z-40 h-screen border-b border-[#e0e0e0] bg-white shadow-lg lg:hidden',
                        isMobileScrolled ? 'fixed top-[64px]' : 'top-full'
                    )}
                >
                    <div className="flex flex-col py-2">
                        {resolvedMenuItems.map((item) => (
                            <MobileNavItem key={item.href} item={item} onClick={closeMobileMenu} />
                        ))}

                        {!connectedUser && (
                            <Link
                                to={loginHref ?? PUBLIC_ROUTES.LOGIN}
                                onClick={closeMobileMenu}
                                className="mx-4 mt-3 flex h-10 items-center justify-center gap-2 rounded border border-[#e0e0e0] bg-white px-4 py-2 transition-colors hover:bg-gray-50"
                            >
                                <UserCircle className="h-5 w-5 text-black" />
                                <span className={styles.bodyText}>{t('layout.signIn')}</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
