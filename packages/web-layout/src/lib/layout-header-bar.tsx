import { cn } from '@maas/core-utils';
import { User } from '@maas/core-api-models';
import { Menu, Search, UserCircle, X } from 'lucide-react';
import { useState, useEffect, useRef, RefObject, ReactNode } from 'react';
import { Link, NavLink } from 'react-router-dom';

// =============================================================================
// Types
// =============================================================================

export interface MenuItem {
  label: string;
  href: string;
}

type LayoutHeaderBarProps = {
  connectedUser: User | null;
  menuItems?: MenuItem[];
  onSearchClick?: () => void;
  onLoginClick?: () => void;
  onSubscribeClick?: () => void;
  className?: string;
};

// =============================================================================
// Constants
// =============================================================================

const defaultMenuItems: MenuItem[] = [
  { label: 'À la une', href: '/' },
  { label: 'Maths faciles', href: '/categories/maths-faciles' },
  { label: 'Thématiques', href: '/categories/thematiques' },
  { label: 'Histoire & Culture', href: '/categories/histoire-culture' },
  { label: 'Jeux & Défis', href: '/categories/jeux-defis' },
  { label: 'Magazines', href: '/magazines' },
  { label: 'Dossiers', href: '/dossiers' },
  { label: 'Vidéos', href: '/categories/videos' },
  { label: 'Notes de lecture', href: '/categories/notes-lecture' },
];

const styles = {
  iconButton:
    'flex h-10 w-10 items-center justify-center rounded border border-[#e0e0e0] bg-white transition-colors hover:bg-gray-50',
  subscribeButton:
    'flex h-10 items-center justify-center rounded bg-brand-primary transition-colors hover:bg-brand-primary/90',
  subscribeText:
    'px-1 font-body font-semibold leading-5 tracking-[-0.07px] text-white',
  bodyText:
    'font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-black',
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
      setIsDesktopScrolled(
        window.scrollY > (topBarRef.current?.offsetHeight ?? 80)
      );
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
    <button
      onClick={onClick}
      className={cn(styles.iconButton, className)}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

function SubscribeButton({
  onClick,
  compact = false,
}: {
  onClick?: () => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(styles.subscribeButton, compact ? 'px-3' : 'px-4')}
    >
      <span
        className={cn(
          styles.subscribeText,
          compact ? 'text-[13px] md:text-[14px]' : 'text-[14px]'
        )}
      >
        Je m'abonne
      </span>
    </button>
  );
}

function Logo({
  variant = 'full',
  className,
}: {
  variant?: 'full' | 'icon';
  className?: string;
}) {
  const src =
    variant === 'icon' ? '/logo-tangente-icon.png' : '/logo-tangente-full.png';

  return (
    <Link to="/" className={className}>
      <img
        src={src}
        alt="Tangente"
        className="h-full w-full object-contain"
      />
    </Link>
  );
}

function SearchBar({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="hidden h-10 w-[480px] items-center justify-center gap-2 rounded border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-2 transition-colors hover:bg-[#ebebeb] lg:flex"
    >
      <Search className="h-5 w-5 text-black/50" />
      <span className="font-body text-[14px] font-normal leading-5 tracking-[-0.07px] text-black/50">
        Rechercher sur Tangente
      </span>
    </button>
  );
}

function NavItem({ item }: { item: MenuItem }) {
  return (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      className={({ isActive }) =>
        cn(
          'flex h-12 items-center justify-center px-3',
          'font-body text-xs xl:text-[13px] font-bold uppercase leading-4 tracking-[0.26px]',
          'transition-colors',
          isActive
            ? 'border-b-2 border-brand-primary text-black'
            : 'border-b-2 border-transparent text-black/50 hover:text-black/70'
        )
      }
    >
      {item.label}
    </NavLink>
  );
}

function MobileNavItem({
  item,
  onClick,
}: {
  item: MenuItem;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={item.href}
      end={item.href === '/'}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          'flex w-full items-center px-4 py-3',
          'font-body text-[14px] font-bold uppercase leading-5 tracking-[0.26px]',
          'transition-colors',
          isActive
            ? 'border-l-2 border-brand-primary bg-brand-primary/5 text-black'
            : 'border-l-2 border-transparent text-black/50 hover:bg-gray-50 hover:text-black/70'
        )
      }
    >
      {item.label}
    </NavLink>
  );
}

function NavigationMenu({
  items,
  className,
}: {
  items: MenuItem[];
  className?: string;
}) {
  return (
    <nav className={className}>
      <div className="flex items-center justify-center">
        {items.map((item) => (
          <NavItem key={item.href} item={item} />
        ))}
      </div>
    </nav>
  );
}

function UserButton({
  connectedUser,
  onLoginClick,
  showLabel = false,
  className,
}: {
  connectedUser: User | null;
  onLoginClick?: () => void;
  showLabel?: boolean;
  className?: string;
}) {
  if (connectedUser) {
    return (
      <Link
        to="/account"
        className={cn(
          'flex h-10 items-center justify-center gap-1 rounded border border-[#e0e0e0] bg-white transition-colors hover:bg-gray-50',
          showLabel ? 'px-2 md:px-4' : 'w-10',
          className
        )}
        aria-label="Mon compte"
      >
        <UserCircle className="h-5 w-5 text-black" />
        {showLabel && (
          <span className="hidden px-1 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-black sm:inline">
            {connectedUser.firstName || 'Mon compte'}
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={onLoginClick}
      className={cn(
        'flex h-10 items-center justify-center gap-1 rounded border border-[#e0e0e0] bg-white transition-colors hover:bg-gray-50',
        showLabel ? 'hidden px-4 sm:flex' : 'w-10',
        className
      )}
      aria-label="Se connecter"
    >
      <UserCircle className="h-5 w-5 text-black" />
      {showLabel && (
        <span className="px-1 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-black">
          Se connecter
        </span>
      )}
    </button>
  );
}

// =============================================================================
// Main Component
// =============================================================================

export function LayoutHeaderBar({
  connectedUser,
  menuItems = defaultMenuItems,
  onSearchClick,
  onLoginClick,
  onSubscribeClick,
  className,
}: LayoutHeaderBarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const topBarRef = useRef<HTMLDivElement>(null);

  const { isMobileScrolled, isDesktopScrolled, topBarHeight } =
    useHeaderScroll(topBarRef);

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className={cn('relative', className)}>
      {/* Spacer to prevent content jump when mobile header becomes fixed */}
      {isMobileScrolled && (
        <div
          className="lg:hidden"
          style={{ height: topBarHeight }}
          aria-hidden="true"
        />
      )}

      {/* Top Bar - Fixed on mobile when scrolled, scrolls on desktop */}
      <div
        ref={topBarRef}
        className={cn(
          'flex items-center justify-center bg-white px-4 xl:px-0',
          isMobileScrolled &&
            'fixed left-0 right-0 top-0 z-50 shadow-md lg:relative md:shadow-none',
        )}
      >
        <div className="container mx-auto flex items-center justify-center py-3">
          <div className="flex w-full items-center justify-between gap-3 md:justify-center">
            {/* Left - Logo + Mobile Menu Button */}
            <div className="flex items-center gap-2 md:flex-1">
              <button
                onClick={toggleMobileMenu}
                className="flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-gray-100 lg:hidden"
                aria-label={
                  isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'
                }
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
              <IconButton
                onClick={onSearchClick}
                ariaLabel="Rechercher"
                className="lg:hidden"
              >
                <Search className="h-5 w-5 text-black" />
              </IconButton>

              <UserButton
                connectedUser={connectedUser}
                onLoginClick={onLoginClick}
                showLabel
              />

              <SubscribeButton onClick={onSubscribeClick} compact />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navigation Menu - Static */}
      <NavigationMenu
        items={menuItems}
        className="hidden bg-white lg:flex lg:justify-center"
      />

      {/* Fixed Navigation Bar - Desktop only, appears when scrolled */}
      <div
        className={cn(
          'fixed left-0 right-0 top-0 z-50 hidden border-b border-[#e0e0e0] bg-white shadow-md transition-transform duration-300 ease-out lg:block',
          isDesktopScrolled ? 'translate-y-0' : '-translate-y-full',
        )}
      >
        <div className="flex items-center justify-center px-4">
          <div className="container mx-auto flex items-center justify-between">

            <NavigationMenu
              items={menuItems}
              className="flex flex-1 items-center justify-center"
            />

            <div className="flex shrink-0 items-center gap-2">
              <SubscribeButton onClick={onSubscribeClick} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className={cn(
            'absolute left-0 right-0 z-40 border-b border-[#e0e0e0] bg-white shadow-lg lg:hidden',
            isMobileScrolled ? 'fixed top-[64px]' : 'top-full',
          )}
        >
          <div className="flex flex-col py-2">
            {menuItems.map((item) => (
              <MobileNavItem
                key={item.href}
                item={item}
                onClick={closeMobileMenu}
              />
            ))}

            {!connectedUser && (
              <button
                onClick={() => {
                  closeMobileMenu();
                  onLoginClick?.();
                }}
                className="mx-4 mt-3 flex h-10 items-center justify-center gap-2 rounded border border-[#e0e0e0] bg-white px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <UserCircle className="h-5 w-5 text-black" />
                <span className={styles.bodyText}>Se connecter</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
