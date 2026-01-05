import { useId, useState } from 'react';
import {
  FieldPathByValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { useGetArticles } from '@maas/core-api';
import { ReadArticleRef } from '@maas/core-api-models';
import {
  AsyncCombobox,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@maas/web-components';

type ControlledArticleInputProps<T extends FieldValues> = {
  name: FieldPathByValue<T, ReadArticleRef | undefined | null>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

export function ControlledArticleInput<T extends FieldValues>(
  props: ControlledArticleInputProps<T>,
) {
  const {
    name,
    label,
    placeholder = 'Select article...',
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

  const { data: articlesData, isLoading } = useGetArticles(
    {
      filters: searchTerm ? { title: searchTerm } : undefined,
      limit: 15,
      offset: 0,
      fields: {
        id: null,
        title: null,
      },
    },
    {
      enabled: true,
    },
  );

  const articles = articlesData?.data ?? [];
  const options = articles.map((article) => ({
    id: article.id,
    label: article.title,
  }));

  const currentValue = field.value as ReadArticleRef | null | undefined;
  const comboboxValue =
    currentValue && currentValue.title
      ? { id: currentValue.id, label: currentValue.title }
      : null;

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <AsyncCombobox
        id={id}
        value={comboboxValue}
        onChange={(option) => {
          field.onChange(option ? { id: option.id, title: option.label } : null);
        }}
        onBlur={field.onBlur}
        onSearchChange={setSearchTerm}
        options={options}
        isLoading={isLoading}
        placeholder={placeholder}
        searchPlaceholder="Search articles..."
        emptyMessage="No article found."
        disabled={disabled}
        aria-invalid={fieldState.invalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
