import { useId, useState } from 'react';
import {
  FieldPathByValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';

import { useGetBrands } from '@maas/core-api';
import { cn } from '@maas/core-utils';
import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@maas/web-components';
import { ReadBrandRef } from '@maas/core-api-models';

type ControlledMagazineBrandInputProps<T extends FieldValues> = {
  name: FieldPathByValue<T, ReadBrandRef | undefined | null>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

export function ControlledMagazineBrandInput<T extends FieldValues>(
  props: ControlledMagazineBrandInputProps<T>,
) {
  const {
    name,
    label,
    placeholder = 'Select brand...',
    description,
    disabled,
  } = props;

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name,
    control,
  });
  const id = useId();

  const { data: brandsData, isLoading } = useGetBrands(
    {
      filters: searchTerm ? { term: searchTerm } : undefined,
      limit: 15,
      offset: 0,
    },
    {
      enabled: open,
    },
  );

  const brands = brandsData?.data ?? [];

  const currentValue = field.value as ReadBrandRef | null | undefined;
  const displayValue = currentValue?.name ?? placeholder;

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-invalid={fieldState.invalid}
            disabled={disabled}
            className="w-full justify-between font-normal"
            onBlur={field.onBlur}
          >
            {currentValue ? displayValue : placeholder}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search brands..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? 'Loading...' : 'No brand found.'}
              </CommandEmpty>
              <CommandGroup>
                {brands.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.id}
                    onSelect={() => {
                      const isSelected = currentValue?.id === brand.id;
                      field.onChange(
                        isSelected
                          ? null
                          : { id: brand.id, name: brand.name },
                      );
                      setOpen(false);
                    }}
                  >
                    <CheckIcon
                      className={cn(
                        'mr-2 h-4 w-4',
                        currentValue?.id === brand.id
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    {brand.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
