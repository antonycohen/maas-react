import { NavLink } from 'react-router-dom';
import { User, Lock, Settings, LogOut } from 'lucide-react';
interface AccountMobileNavProps {
  baseUrl: string;
}
export function AccountMobileNav({ baseUrl }: AccountMobileNavProps) {
  const navItems = [
    { title: 'Mon compte', url: `${baseUrl}/account/profile`, icon: User },
    { title: 'Connexion', url: `${baseUrl}/account/connexion`, icon: Lock },
    { title: 'Préférences', url: `${baseUrl}/account/preferences`, icon: Settings },
  ];
  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-between items-center px-4 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 ${
                isActive ? 'text-black' : 'text-gray-400'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-[10px] sm:text-xs font-medium">{item.title}</span>
          </NavLink>
        ))}
        <NavLink
            to="/logout"
            className="flex flex-col items-center gap-1 text-gray-400"
          >
            <LogOut className="w-6 h-6" />
            <span className="text-[10px] sm:text-xs font-medium">Déco.</span>
          </NavLink>
      </div>
    </div>
  );
}
