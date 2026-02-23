import { useId, useState } from 'react';
import { FieldPathByValue, FieldValues, useController, useFormContext } from 'react-hook-form';

import { useGetArticleTypes } from '@maas/core-api';
import { ArticleTypeRef, ReadArticleTypeRef } from '@maas/core-api-models';
import { AsyncCombobox, Field, FieldDescription, FieldError, FieldLabel } from '@maas/web-components';

type ControlledArticleTypeInputProps<T extends FieldValues> = {
    name: FieldPathByValue<T, ArticleTypeRef | ReadArticleTypeRef | undefined | null>;
    label: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    onBeforeChange?: (newValue: { id: string; name: string } | null) => boolean;
};

export function ControlledArticleTypeInput<T extends FieldValues>(props: ControlledArticleTypeInputProps<T>) {
    const { name, label, placeholder = 'Select article type...', description, disabled, onBeforeChange } = props;

    const [searchTerm, setSearchTerm] = useState('');

    const form = useFormContext();
    const { control } = form;
    const { field, fieldState } = useController({
        name,
        control,
    });
    const id = useId();

    const { data: articleTypesData, isLoading } = useGetArticleTypes(
        {
            filters: searchTerm ? { name: searchTerm } : undefined,
            limit: 15,
            offset: 0,
            fields: {
                id: null,
                name: null,
                fields: null,
                isActive: null,
            },
        },
        {
            enabled: true,
        }
    );

    const articleTypes = articleTypesData?.data ?? [];
    const options = articleTypes.map((articleType) => ({
        id: articleType.id,
        label: articleType.name,
    }));

    const currentValue = field.value as ReadArticleTypeRef | null | undefined;
    const comboboxValue = currentValue && currentValue.name ? { id: currentValue.id, label: currentValue.name } : null;

    return (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={id}>{label}</FieldLabel>
            <AsyncCombobox
                id={id}
                value={comboboxValue}
                onChange={(option) => {
                    const newValue = option ? { id: option.id, name: option.label } : null;
                    if (onBeforeChange && !onBeforeChange(newValue)) return;
                    field.onChange(newValue);
                }}
                onBlur={field.onBlur}
                onSearchChange={setSearchTerm}
                options={options}
                isLoading={isLoading}
                placeholder={placeholder}
                searchPlaceholder="Search article types..."
                emptyMessage="No article type found."
                disabled={disabled}
                aria-invalid={fieldState.invalid}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
