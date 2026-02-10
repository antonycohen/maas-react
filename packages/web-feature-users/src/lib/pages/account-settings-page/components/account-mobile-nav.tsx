import { NavLink } from 'react-router-dom';
import { User, Lock, Settings, LogOut, CreditCard } from 'lucide-react';
interface AccountMobileNavProps {
    baseUrl: string;
}
export function AccountMobileNav({ baseUrl }: AccountMobileNavProps) {
    const navItems = [
        { title: 'Mon compte', url: `${baseUrl}/account/profile`, icon: User },
        { title: 'Connexion', url: `${baseUrl}/account/connexion`, icon: Lock },
        { title: 'Préférences', url: `${baseUrl}/account/preferences`, icon: Settings },
        { title: 'Abonnement', url: `${baseUrl}/account/subscription`, icon: CreditCard },
    ];
    return (
        <div className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
            <div className="flex items-center justify-between px-4 py-3">
                {navItems.map((item) => (
                    <NavLink
                        key={item.url}
                        to={item.url}
                        className={({ isActive }) =>
                            `flex flex-col items-center gap-1 ${isActive ? 'text-black' : 'text-gray-400'}`
                        }
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="text-[10px] font-medium sm:text-xs">{item.title}</span>
                    </NavLink>
                ))}
                <NavLink to="/logout" className="flex flex-col items-center gap-1 text-gray-400">
                    <LogOut className="h-6 w-6" />
                    <span className="text-[10px] font-medium sm:text-xs">Déco.</span>
                </NavLink>
            </div>
        </div>
    );
}
