import { cn } from '@maas/core-utils';
import { User } from '@maas/core-api-models';
import { Search, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@maas/core-translations';

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
    const { t } = useTranslation();
    return (
        <header className={cn('flex items-center justify-center px-4 xl:px-0', className)}>
            <div className="container mx-auto flex items-center justify-center py-3">
                <div className="flex w-full items-center justify-between gap-3 md:justify-center">
                    {/* Left - Logo */}
                    <div className="flex items-start md:flex-1">
                        <Link to="/" className="h-10 w-[100px] md:h-14 md:w-[150px]">
                            <img
                                src="/logo-tangente-full.png"
                                alt="Tangente"
                                className="h-full w-full object-contain"
                            />
                        </Link>
                    </div>

                    {/* Center - Search Bar (Desktop) */}
                    <button
                        onClick={onSearchClick}
                        className="hidden h-10 w-[480px] items-center justify-center gap-2 rounded border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-2 transition-colors hover:bg-[#ebebeb] lg:flex"
                    >
                        <Search className="h-5 w-5 text-black/50" />
                        <span className="font-body text-[14px] leading-5 font-normal tracking-[-0.07px] text-black/50">
                            {t('home.searchOnTangente')}
                        </span>
                    </button>

                    {/* Right - Actions */}
                    <div className="flex items-center justify-end gap-2 md:flex-1">
                        {/* Search Button (Mobile/Tablet) */}
                        <button
                            onClick={onSearchClick}
                            className="flex h-10 w-10 items-center justify-center rounded border border-[#e0e0e0] bg-white transition-colors hover:bg-gray-50 lg:hidden"
                            aria-label={t('common.search')}
                        >
                            <Search className="h-5 w-5 text-black" />
                        </button>

                        {connectedUser ? (
                            /* Connected User - Show Avatar/Profile */
                            <Link
                                to="/account"
                                className="flex h-10 items-center justify-center gap-1 rounded border border-[#e0e0e0] bg-white px-2 py-2 transition-colors hover:bg-gray-50 md:px-4"
                            >
                                <UserCircle className="h-5 w-5 text-black" />
                                <span className="font-body hidden px-1 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-black sm:inline">
                                    {connectedUser.firstName || t('layout.myAccount')}
                                </span>
                            </Link>
                        ) : (
                            /* Not Connected - Show Login Button */
                            <button
                                onClick={onLoginClick}
                                className="flex h-10 items-center justify-center gap-1 rounded border border-[#e0e0e0] bg-white px-2 py-2 transition-colors hover:bg-gray-50 md:px-4"
                            >
                                <UserCircle className="h-5 w-5 text-black" />
                                <span className="font-body hidden px-1 text-[14px] leading-5 font-semibold tracking-[-0.07px] text-black sm:inline">
                                    {t('layout.signIn')}
                                </span>
                            </button>
                        )}

                        {/* Subscribe Button */}
                        <button
                            onClick={onSubscribeClick}
                            className="bg-brand-primary hover:bg-brand-primary/90 flex h-10 items-center justify-center gap-1 rounded px-3 py-2 transition-colors md:px-4"
                        >
                            <span className="font-body px-1 text-[12px] leading-5 font-semibold tracking-[-0.07px] text-white md:text-[14px]">
                                {t('home.subscribe')}
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
