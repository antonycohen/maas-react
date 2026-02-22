'use client';

import { ChevronRight, type LucideIcon } from 'lucide-react';
import { NavLink } from 'react-router';

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '../ui/sidebar';

export type SidebarNavigationProps = {
    sectionName?: string;
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
};

export function SidebarNavigation({ sectionName, items }: SidebarNavigationProps) {
    return (
        <SidebarGroup>
            {sectionName && <SidebarGroupLabel>{sectionName}</SidebarGroupLabel>}
            <SidebarMenu>
                {items.map((item) =>
                    item.items && item.items.length > 0 ? (
                        <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton tooltip={item.title}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => (
                                            <SidebarMenuSubItem key={subItem.title}>
                                                <NavLink to={subItem.url}>
                                                    {({ isActive }) => (
                                                        <SidebarMenuSubButton isActive={isActive}>
                                                            <span>{subItem.title}</span>
                                                        </SidebarMenuSubButton>
                                                    )}
                                                </NavLink>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <NavLink to={item.url}>
                                {({ isActive }) => (
                                    <SidebarMenuButton tooltip={item.title} isActive={isActive}>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                )}
                            </NavLink>
                        </SidebarMenuItem>
                    )
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
