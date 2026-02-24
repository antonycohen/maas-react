import { NavLink } from 'react-router';
import { User, Lock, LogOut, CreditCard, FileText, MapPin } from 'lucide-react';

interface AccountSidebarProps {
    baseUrl: string;
}

export function AccountSidebar({ baseUrl }: AccountSidebarProps) {
    const navItems = [
        { title: 'Mon compte', url: `${baseUrl}/account/profile`, icon: User },
        { title: 'Connexion', url: `${baseUrl}/account/connexion`, icon: Lock },
        // { title: 'Préférences', url: `${baseUrl}/account/preferences`, icon: Settings },
        { title: 'Adresses', url: `${baseUrl}/account/addresses`, icon: MapPin },
        { title: 'Abonnement', url: `${baseUrl}/account/subscription`, icon: CreditCard },
        { title: 'Factures', url: `${baseUrl}/account/invoices`, icon: FileText },
    ];

    return (
        <div className="flex w-72.5 shrink-0 flex-col gap-6 border-r border-gray-200 pr-5">
            <div className="flex w-full flex-col gap-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.url}
                        to={item.url}
                        className={({ isActive }) =>
                            `flex w-full items-center gap-3 rounded-md px-3 py-3 transition-colors ${
                                isActive ? 'bg-[#f5f5f5] font-semibold text-black' : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
                    </NavLink>
                ))}
            </div>

            <div className="h-px w-full bg-gray-200" />

            <div className="flex w-full flex-col">
                <NavLink
                    to="/logout"
                    className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-gray-600 transition-colors hover:bg-gray-50"
                >
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-semibold">Se déconnecter</span>
                </NavLink>
            </div>
        </div>
    );
}
