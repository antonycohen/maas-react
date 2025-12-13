import { useId, useState } from 'react';
import {
  FieldPathByValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useGetFolders } from '@maas/core-api';
import { ReadFolderRef } from '@maas/core-api-models';
import {
  AsyncCombobox,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@maas/web-components';

type ControlledMagazineFolderInputProps<T extends FieldValues> = {
  name: FieldPathByValue<T, ReadFolderRef | undefined | null>;
  label: string;
  issueId?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

export function ControlledMagazineFolderInput<T extends FieldValues>(
  props: ControlledMagazineFolderInputProps<T>,
) {
  const {
    name,
    label,
    issueId,
    placeholder = 'Select folder...',
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

  const { data: foldersData, isLoading } = useGetFolders(
    {
      filters: {
        ...(issueId && { issueId }),
        ...(searchTerm && { term: searchTerm }),
      },
      limit: 15,
      offset: 0,
    },
    {
      enabled: true,
    },
  );

  const folders = foldersData?.data ?? [];
  const options = folders.map((folder) => ({
    id: folder.id,
    label: folder.name,
  }));

  const currentValue = field.value as ReadFolderRef | null | undefined;
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
        searchPlaceholder="Search folders..."
        emptyMessage="No folder found."
        disabled={disabled}
        aria-invalid={fieldState.invalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
