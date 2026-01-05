import { NavLink } from 'react-router-dom';
import { User, Lock, Settings, LogOut } from 'lucide-react';

interface AccountSidebarProps {
  baseUrl: string;
}

export function AccountSidebar({ baseUrl }: AccountSidebarProps) {
  const navItems = [
    { title: 'Mon compte', url: `${baseUrl}/account/profile`, icon: User },
    { title: 'Connexion', url: `${baseUrl}/account/connexion`, icon: Lock },
    { title: 'Préférences', url: `${baseUrl}/account/preferences`, icon: Settings },
  ];

  return (
    <div className="flex flex-col gap-6 w-[290px] shrink-0 border-r border-gray-200 pr-5">
      <div className="flex flex-col gap-1 w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-md w-full transition-colors ${
                isActive
                  ? 'bg-[#f5f5f5] text-black font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm">{item.title}</span>
          </NavLink>
        ))}
      </div>

      <div className="h-px bg-gray-200 w-full" />

      <div className="flex flex-col w-full">
        <NavLink
          to="/logout"
          className="flex items-center gap-3 px-3 py-3 rounded-md w-full text-gray-600 hover:bg-gray-50 transition-colors text-left"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-semibold">Se déconnecter</span>
        </NavLink>
      </div>
    </div>
  );
}
