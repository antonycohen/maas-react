import { useId, useState } from 'react';
import {
  FieldPathByValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useGetEnums } from '@maas/core-api';
import { ReadEnumRef } from '@maas/core-api-models';
import {
  AsyncCombobox,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@maas/web-components';

type ControlledEnumInputProps<T extends FieldValues> = {
  name: FieldPathByValue<T, ReadEnumRef | undefined | null>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

export function ControlledEnumInput<T extends FieldValues>(
  props: ControlledEnumInputProps<T>,
) {
  const {
    name,
    label,
    placeholder = 'Select enum...',
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

  const { data: enumsData, isLoading } = useGetEnums(
    {
      filters: searchTerm ? { term: searchTerm } : undefined,
      limit: 15,
      offset: 0,
    },
    {
      enabled: true,
    },
  );

  const enums = enumsData?.data ?? [];
  const options = enums.map((enumItem) => ({
    id: enumItem.id,
    label: enumItem.name,
  }));

  const currentValue = field.value as ReadEnumRef | null | undefined;
  const comboboxValue =
    currentValue && currentValue.name
      ? { id: currentValue.id, label: currentValue.name }
      : null;

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
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
        searchPlaceholder="Search enums..."
        emptyMessage="No enum found."
        disabled={disabled}
        aria-invalid={fieldState.invalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
