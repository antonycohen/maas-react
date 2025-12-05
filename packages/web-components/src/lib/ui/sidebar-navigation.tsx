import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number | string;
  disabled?: boolean;
}

export interface SidebarNavigationProps {
  items: NavItem[];
  iconSize?: number;
  showLabels?: boolean;
  onItemClick?: (item: NavItem) => void;
}

export function SidebarNavigation(props: SidebarNavigationProps) {

  const {
    items,
    iconSize = 20,
    showLabels = true,
    onItemClick,
  } = props;

  const handleClick = (item: NavItem) => {
    if (onItemClick && !item.disabled) {
      onItemClick(item);
    }
  };

  return (
    <nav>
      <ul className={'flex flex-col space-y-2'}>
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <li key={item.id}>
              {item.disabled ? (
                <span
                  className={`'flex items-center space-x-2 p-2 rounded hover:bg-gray-200 transition-colors text-gray-600 opacity-50 cursor-not-allowed`}
                >
                  <Icon size={iconSize} />
                  {showLabels && <span>{item.label}</span>}
                  {item.badge !== undefined && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </span>
              ) : (
                <NavLink
                  to={item.href}
                  onClick={() => handleClick(item)}
                  className={({ isActive }) => `flex items-center space-x-2 p-2 rounded hover:bg-gray-200 transition-colors ${
                    isActive ? 'text-blue-600' : 'text-gray-600'
                  }`}
                >
                  <Icon size={iconSize} />
                  {showLabels && <span>{item.label}</span>}
                  {item.badge !== undefined && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default SidebarNavigation;
