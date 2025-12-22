import { cn } from '@maas/core-utils';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export interface MenuItem {
  label: string;
  href: string;
}

type LayoutMainMenuProps = {
  items?: MenuItem[];
  className?: string;
};

const defaultMenuItems: MenuItem[] = [
  { label: 'À la une', href: '/' },
  { label: 'Maths faciles', href: '/maths-faciles' },
  { label: 'Thématiques', href: '/thematiques' },
  { label: 'Histoire & Culture', href: '/histoire-culture' },
  { label: 'Jeux & Défis', href: '/jeux-defis' },
  { label: 'Magazines', href: '/magazines' },
  { label: 'Dossiers', href: '/dossiers' },
  { label: 'Vidéos', href: '/videos' },
  { label: 'Notes de lecture', href: '/notes-lecture' },
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
        'font-body text-[13px] font-bold uppercase leading-4 tracking-[0.26px]',
        'transition-colors',
        isSelected
          ? 'border-b-2 border-brand-primary text-black'
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
        'font-body text-[14px] font-bold uppercase leading-5 tracking-[0.26px]',
        'transition-colors',
        isSelected
          ? 'border-l-2 border-brand-primary bg-brand-primary/5 text-black'
          : 'border-l-2 border-transparent text-black/50 hover:bg-gray-50 hover:text-black/70'
      )}
    >
      {item.label}
    </Link>
  );
};

export function LayoutMainMenu({
  items = defaultMenuItems,
  className,
}: LayoutMainMenuProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            {items.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isSelected={isSelected(item.href)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center justify-between px-4 py-2 md:hidden">
        <span className="font-body text-[14px] font-bold uppercase tracking-[0.26px] text-black/70">
          Menu
        </span>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-10 w-10 items-center justify-center rounded transition-colors hover:bg-gray-100"
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
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
        <div className="absolute left-0 right-0 top-full z-50 border-b border-[#e0e0e0] bg-white shadow-lg md:hidden">
          <div className="flex flex-col py-2">
            {items.map((item) => (
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
