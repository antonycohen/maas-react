'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@maas/web-components';

import { useDialogState } from '@maas/core-utils';

import { Link } from 'react-router-dom';
import { ComponentType } from 'react';

interface CommonAction {
  className?: string;
  label: string;
  group?: string;
  icon: ComponentType<{ size?: number }>;
}

interface LinkAction<T> extends CommonAction {
  linkTo: (row: T) => string;
}

interface DialogAction<T> extends CommonAction {
  dialog: {
    id: string;
    component: ComponentType<{
      row: T;
      open: boolean;
      onOpenChange: (open: boolean) => void;
    }>;
  };
}

type Action<T> = LinkAction<T> | DialogAction<T>;

const isDialogAction = <T,>(action: Action<T>): action is DialogAction<T> => {
  return (action as DialogAction<T>).dialog !== undefined;
};

const filterDialogActions = <T,>(actions: Action<T>[]): DialogAction<T>[] => {
  return actions.filter(isDialogAction);
};

interface Props<T> {
  row: Row<T>;
  actions: Action<T>[];
}

export function CollectionRowActions<T>({ row, actions }: Props<T>) {
  const [open, setOpen] = useDialogState<string>(null);

  const renderDialogActionMenuItem = (
    action: DialogAction<T>,
    index: number,
  ) => {
    const Icon = action.icon;
    return (
      <DropdownMenuItem
        className={action.className}
        key={index}
        onClick={() => setOpen(action.dialog.id)}
      >
        {action.label}
        <DropdownMenuShortcut>
          <Icon size={16} />
        </DropdownMenuShortcut>
      </DropdownMenuItem>
    );
  };

  const renderLinkActionMenuItem = (action: LinkAction<T>, index: number) => {
    const Icon = action.icon;
    return (
      <DropdownMenuItem className={action.className} key={index} asChild>
        <Link to={action.linkTo(row.original)}>
          {action.label}
          <DropdownMenuShortcut>
            <Icon size={16} />
          </DropdownMenuShortcut>
        </Link>
      </DropdownMenuItem>
    );
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          {actions.map((action, index) => {
            const needsSeparator =
              index > 0 && action.group !== actions[index - 1].group;
            return (
              <>
                {needsSeparator && (
                  <DropdownMenuSeparator key={`separator-${index}`} />
                )}
                {isDialogAction(action)
                  ? renderDialogActionMenuItem(action, index)
                  : renderLinkActionMenuItem(action, index)}
              </>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {filterDialogActions(actions).map((action, index) => {
        const DialogComponent = action.dialog.component;
        return (
          <DialogComponent
            key={`${action.dialog.id}-${index}`}
            row={row.original}
            open={open === action.dialog.id}
            onOpenChange={() => setOpen(action.dialog.id)}
          />
        );
      })}
    </>
  );
}
