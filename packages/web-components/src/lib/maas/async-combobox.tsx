import { useState } from 'react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { cn } from '@maas/core-utils';

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

export type AsyncComboboxOption = {
  id: string;
  label: string;
};

export type AsyncComboboxProps = {
  id?: string;
  value: AsyncComboboxOption | null | undefined;
  onChange: (value: AsyncComboboxOption | null) => void;
  onBlur?: () => void;
  onSearchChange?: (search: string) => void;
  options: AsyncComboboxOption[];
  isLoading?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  loadingMessage?: string;
  disabled?: boolean;
  'aria-invalid'?: boolean;
  className?: string;
};

export function AsyncCombobox(props: AsyncComboboxProps) {
  const {
    id,
    value,
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

  const displayValue = value?.label ?? placeholder;

  return (
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
          {value ? displayValue : placeholder}
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
                  onSelect={() => {
                    const isSelected = value?.id === option.id;
                    onChange(isSelected ? null : option);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      value?.id === option.id ? 'opacity-100' : 'opacity-0',
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
  );
}
