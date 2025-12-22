import { cn } from '@maas/core-utils';
import { User } from '@maas/core-api-models';
import { Search, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

type LayoutTopbarProps = {
  connectedUser: User | null;
  onSearchClick?: () => void;
  onLoginClick?: () => void;
  onSubscribeClick?: () => void;
  className?: string;
};

export function LayoutTopbar({
  connectedUser,
  onSearchClick,
  onLoginClick,
  onSubscribeClick,
  className,
}: LayoutTopbarProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-center',
        className,
      )}
    >
      <div className="container mx-auto flex items-center justify-center py-3">
        <div className="flex w-full items-center justify-center">
          {/* Left - Logo */}
          <div className="flex flex-1 items-start">
            <Link to="/" className="h-14 w-[150px]">
              <img
                src="/logo-tangente-full.png"
                alt="Tangente"
                className="h-full w-full object-contain"
              />
            </Link>
          </div>

          {/* Center - Search Bar */}
          <button
            onClick={onSearchClick}
            className="flex h-10 w-[480px] items-center justify-center gap-2 rounded border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-2 transition-colors hover:bg-[#ebebeb]"
          >
            <Search className="h-5 w-5 text-black/50" />
            <span className="font-body text-[14px] font-normal leading-5 tracking-[-0.07px] text-black/50">
              Rechercher sur Tangente
            </span>
          </button>

          {/* Right - Actions */}
          <div className="flex flex-1 items-center justify-end gap-2">
            {connectedUser ? (
              /* Connected User - Show Avatar/Profile */
              <Link
                to="/account"
                className="flex h-10 items-center justify-center gap-1 rounded border border-[#e0e0e0] bg-white px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <UserCircle className="h-5 w-5 text-black" />
                <span className="px-1 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-black">
                  {connectedUser.firstName || 'Mon compte'}
                </span>
              </Link>
            ) : (
              /* Not Connected - Show Login Button */
              <button
                onClick={onLoginClick}
                className="flex h-10 items-center justify-center gap-1 rounded border border-[#e0e0e0] bg-white px-4 py-2 transition-colors hover:bg-gray-50"
              >
                <UserCircle className="h-5 w-5 text-black" />
                <span className="px-1 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-black">
                  Se connecter
                </span>
              </button>
            )}

            {/* Subscribe Button */}
            <button
              onClick={onSubscribeClick}
              className="flex h-10 items-center justify-center gap-1 rounded bg-brand-primary px-4 py-2 transition-colors hover:bg-brand-primary/90"
            >
              <span className="px-1 font-body text-[14px] font-semibold leading-5 tracking-[-0.07px] text-white">
                Je m'abonne
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
