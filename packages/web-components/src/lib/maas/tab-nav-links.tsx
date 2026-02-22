'use client';

import { NavLink } from 'react-router';
import { cn } from '@maas/core-utils';

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
        <div className={cn('border-border flex items-start border-b px-3', className)}>
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
            <div className="flex cursor-not-allowed items-center justify-center py-1.5 opacity-50">
                <div className="flex items-center justify-center rounded-md px-2.5 py-2">
                    <span className="text-muted-foreground text-sm whitespace-nowrap">{item.title}</span>
                </div>
            </div>
        );
    }

    return (
        <NavLink to={item.url} end>
            {({ isActive }) => (
                <div
                    className={cn('flex items-center justify-center py-1.5', {
                        'border-primary border-b-2': isActive,
                        'border-b-2 border-transparent': !isActive,
                    })}
                >
                    <div
                        className={cn(
                            'flex items-center justify-center rounded-md px-2.5 py-2 transition-colors',
                            !isActive && 'hover:bg-accent'
                        )}
                    >
                        <span
                            className={cn(
                                'text-sm whitespace-nowrap transition-colors',
                                isActive ? 'text-foreground' : 'text-muted-foreground hover:text-accent-foreground'
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
