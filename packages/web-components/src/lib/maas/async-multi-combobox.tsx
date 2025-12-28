import { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';

import { cn } from '@maas/core-utils';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export type AsyncMultiComboboxOption = {
  id: string;
  label: string;
};

export type AsyncMultiComboboxProps = {
  id?: string;
  value: AsyncMultiComboboxOption[];
  onChange: (value: AsyncMultiComboboxOption[]) => void;
  onBlur?: () => void;
  onSearchChange?: (search: string) => void;
  options: AsyncMultiComboboxOption[];
  isLoading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  className?: string;
};

export function AsyncMultiCombobox(props: AsyncMultiComboboxProps) {
  const {
    id,
    value = [],
    onChange,
    onBlur,
    onSearchChange,
    options,
    isLoading = false,
    placeholder = 'Select...',
    searchPlaceholder = 'Search...',
    emptyMessage = 'No results found.',
    loadingMessage = 'Loading...',
    disabled = false,
    'aria-invalid': ariaInvalid,
    className,
  } = props;

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (search: string) => {
    setSearchTerm(search);
    onSearchChange?.(search);
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && searchTerm === '') {
      onSearchChange?.('');
    }
  };

  const handleSelect = (option: AsyncMultiComboboxOption) => {
    const isSelected = value.some((v) => v.id === option.id);
    if (isSelected) {
      onChange(value.filter((v) => v.id !== option.id));
    } else {
      onChange([...value, option]);
    }
  };

  const handleRemove = (optionId: string) => {
    onChange(value.filter((v) => v.id !== optionId));
  };

  const isOptionSelected = (optionId: string) => {
    return value.some((v) => v.id === optionId);
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={ariaInvalid}
            disabled={disabled}
            className={cn('w-full justify-between font-normal', className)}
            onBlur={onBlur}
          >
            {value.length > 0
              ? `${value.length} selected`
              : placeholder}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchTerm}
              onValueChange={handleSearchChange}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? loadingMessage : emptyMessage}
              </CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.id}
                    onSelect={() => handleSelect(option)}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        isOptionSelected(option.id) ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((item) => (
            <Badge
              key={item.id}
              variant="secondary"
              className="gap-1 pr-1"
            >
              {item.label}
              <button
                type="button"
                className="rounded-full hover:bg-muted-foreground/20 p-0.5"
                onClick={() => handleRemove(item.id)}
                disabled={disabled}
              >
                <XIcon className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
