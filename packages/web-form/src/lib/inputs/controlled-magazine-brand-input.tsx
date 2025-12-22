import { useId, useState } from 'react';
import {
  FieldPathByValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useGetBrands } from '@maas/core-api';
import { ReadBrandRef } from '@maas/core-api-models';
import {
  AsyncCombobox,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@maas/web-components';

type ControlledMagazineBrandInputProps<T extends FieldValues> = {
  name: FieldPathByValue<T, ReadBrandRef | undefined | null>;
  label: string;
  placeholder?: string;
  description?: string;
  direction?: 'horizontal' | 'vertical';
  disabled?: boolean;
  className?: string;
};

export function ControlledMagazineBrandInput<T extends FieldValues>(
  props: ControlledMagazineBrandInputProps<T>,
) {
  const {
    name,
    label,
    placeholder = 'Select brand...',
    description,
    direction,
    disabled,
    className
  } = props;

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
      enabled: true,
    },
  );

  const brands = brandsData?.data ?? [];
  const options = brands.map((brand) => ({
    id: brand.id,
    label: brand.name,
  }));

  const currentValue = field.value as ReadBrandRef | null | undefined;
  const comboboxValue =
    currentValue && currentValue.name
      ? { id: currentValue.id, label: currentValue.name }
      : null;

  return (
    <Field data-invalid={fieldState.invalid} orientation={direction} className={className}>
      <FieldLabel htmlFor={id} className={direction === 'horizontal' ? 'font-semibold basis-1/2' : ''}>
        {label}
      </FieldLabel>
      <AsyncCombobox
        id={id}
        value={comboboxValue}
        onChange={(option) => {
          field.onChange(option ? { id: option.id, name: option.label } : null);
        }}
        onBlur={field.onBlur}
        onSearchChange={setSearchTerm}
        options={options}
        isLoading={isLoading}
        placeholder={placeholder}
        searchPlaceholder="Search brands..."
        emptyMessage="No brand found."
        disabled={disabled}
        aria-invalid={fieldState.invalid}
        className={direction === 'horizontal' ? 'basis-1/2' : 'w-full'}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
