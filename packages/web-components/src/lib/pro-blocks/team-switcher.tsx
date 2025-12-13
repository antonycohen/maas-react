'use client';

import * as React from 'react';
import {useMemo} from 'react';
import {CheckIcon, ChevronsUpDown, MonitorIcon, Plus, Settings} from 'lucide-react';
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from '../ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {Link, useNavigate} from 'react-router-dom';

export type TeamSwitcherProps = {
  selectedWorkspaceId?: string;
  settingsUrl?: string;
  workspaces: {
    name: string;
    logo: React.ElementType;
    id: string;
    urlPrefix: string;
  }[];
};

export function TeamSwitcher({
  selectedWorkspaceId,
  settingsUrl,
  workspaces,
}: TeamSwitcherProps) {
  const activeTeam = useMemo(() => {
    return (
      workspaces.find((team) => team.id === selectedWorkspaceId) ||
      workspaces[0]
    );
  }, [selectedWorkspaceId, workspaces]);

  const navigate = useNavigate();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <activeTeam.logo className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeTeam.name}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="end"
            side={'bottom'}
            sideOffset={4}
          >
            {settingsUrl && (
              <DropdownMenuItem asChild>
                <Link to={settingsUrl}>
                  <Settings className="size-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <MonitorIcon />
                Switch workspace
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className={'min-w-[224px]'}>
                  {workspaces.map((team, index) => (
                    <DropdownMenuItem
                      key={team.name}
                      onClick={() => navigate(team.urlPrefix)}
                      className="gap-2 p-2 min-w-"
                      asChild
                    >
                      <Link
                        to={team.urlPrefix}
                        className="flex items-center gap-2 w-full"
                      >
                        <div className="flex size-6 items-center justify-center rounded-sm border">
                          <team.logo className="w-6 h-6 relative rounded-lg" />
                        </div>
                        <span className="flex-1">{team.name}</span>
                        {selectedWorkspaceId === team.id && (<CheckIcon />)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <Plus className="size-4" />
              <div className="text-muted-foreground font-medium">
                Create a new workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
