'use client';

import {NavLink} from 'react-router-dom';
import {cn} from '@maas/core-utils';

export type TabNavLinkItem = {
  title: string;
  url: string;
  disabled?: boolean;
};

export type TabNavLinksProps = {
  items: TabNavLinkItem[];
  className?: string;
};

export function TabNavLinks({ items, className }: TabNavLinksProps) {
  return (
    <div
      className={cn(
        'flex items-start border-b border-border px-3',
        className
      )}
    >
      <div className="flex items-center">
        {items.map((item) => (
          <TabNavLink key={item.url} item={item} />
        ))}
      </div>
    </div>
  );
}

type TabNavLinkProps = {
  item: TabNavLinkItem;
};

function TabNavLink({ item }: TabNavLinkProps) {
  if (item.disabled) {
    return (
      <div
        className="flex items-center justify-center py-1.5 opacity-50 cursor-not-allowed"
      >
        <div className="flex items-center justify-center px-2.5 py-2 rounded-md">
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            {item.title}
          </span>
        </div>
      </div>
    );
  }

  return (
    <NavLink to={item.url} end>
      {({ isActive }) => (
        <div
          className={cn(
            'flex items-center justify-center py-1.5',
            {
              'border-b-2 border-primary' : isActive,
              'border-b-2 border-transparent' : !isActive,
            }
          )}
        >
          <div
            className={cn(
              'flex items-center justify-center px-2.5 py-2 rounded-md transition-colors',
              !isActive && 'hover:bg-accent'
            )}
          >
            <span
              className={cn(
                'text-sm whitespace-nowrap transition-colors',
                isActive
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-accent-foreground'
              )}
            >
              {item.title}
            </span>
          </div>
        </div>
      )}
    </NavLink>
  );
}
