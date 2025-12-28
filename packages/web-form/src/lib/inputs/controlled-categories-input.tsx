import { useId, useState } from 'react';
import {
  FieldPathByValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useGetCategories } from '@maas/core-api';
import { ReadCategoryRef } from '@maas/core-api-models';
import {
  AsyncMultiCombobox,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@maas/web-components';

type ControlledCategoriesInputProps<T extends FieldValues> = {
  name: FieldPathByValue<T, ReadCategoryRef[] | undefined | null>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

export function ControlledCategoriesInput<T extends FieldValues>(
  props: ControlledCategoriesInputProps<T>,
) {
  const {
    name,
    label,
    placeholder = 'Select categories...',
    description,
    disabled,
  } = props;

  const [searchTerm, setSearchTerm] = useState('');

  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name,
    control,
  });
  const id = useId();

  const { data: categoriesData, isLoading } = useGetCategories(
    {
      filters: searchTerm ? { term: searchTerm } : undefined,
      limit: 15,
      offset: 0,
    },
    {
      enabled: true,
    },
  );

  const categories = categoriesData?.data ?? [];
  const options = categories.map((category) => ({
    id: category.id,
    label: category.name,
  }));

  const currentValue = (field.value as ReadCategoryRef[] | null | undefined) ?? [];
  const comboboxValue = currentValue
    .filter((item) => item && item.name)
    .map((item) => ({
      id: item.id,
      label: item.name as string,
    }));

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <AsyncMultiCombobox
        id={id}
        value={comboboxValue}
        onChange={(selectedOptions) => {
          field.onChange(
            selectedOptions.map((option) => ({
              id: option.id,
              name: option.label,
            })),
          );
        }}
        onBlur={field.onBlur}
        onSearchChange={setSearchTerm}
        options={options}
        isLoading={isLoading}
        placeholder={placeholder}
        searchPlaceholder="Search categories..."
        emptyMessage="No category found."
        disabled={disabled}
        aria-invalid={fieldState.invalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
