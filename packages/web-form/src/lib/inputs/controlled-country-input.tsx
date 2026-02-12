import { useMemo, useState } from 'react';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';
import { useCountries } from '@maas/core-api';
import { AsyncCombobox, Field, FieldError, FieldLabel } from '@maas/web-components';

type ControlledCountryInputProps<T extends FieldValues> = {
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    direction?: 'horizontal' | 'vertical';
    className?: string;
    disabled?: boolean;
};

export function ControlledCountryInput<T extends FieldValues>(props: ControlledCountryInputProps<T>) {
    const { name, label, placeholder = 'Select a country', direction = 'vertical', className, disabled } = props;
    const form = useFormContext();
    const { field, fieldState } = useController({ name, control: form.control });

    const [search, setSearch] = useState('');
    const { data: countries, isLoading } = useCountries();

    const options = useMemo(() => {
        const all = Object.entries(countries ?? {}).map(([code, name]) => ({ id: code, label: name }));
        if (!search) return all;
        const term = search.toLowerCase();
        return all.filter((o) => o.label.toLowerCase().includes(term));
    }, [countries, search]);

    const selectedValue = useMemo(
        () => (field.value && countries ? { id: field.value, label: countries[field.value] ?? field.value } : null),
        [field.value, countries]
    );

    const combobox = (
        <AsyncCombobox
            value={selectedValue}
            onChange={(option) => field.onChange(option?.id ?? '')}
            onBlur={field.onBlur}
            onSearchChange={setSearch}
            options={options}
            isLoading={isLoading}
            placeholder={placeholder}
            searchPlaceholder="Search..."
            emptyMessage="No country found."
            loadingMessage="Loading..."
            disabled={disabled}
            aria-invalid={fieldState.invalid}
        />
    );

    return (
        <Field data-invalid={fieldState.invalid} orientation={direction} className={className}>
            <FieldLabel className={direction === 'horizontal' ? 'basis-1/2 font-semibold' : ''}>{label}</FieldLabel>
            {direction === 'horizontal' ? (
                <div className="flex basis-1/2 flex-col">
                    {combobox}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </div>
            ) : (
                <>
                    {combobox}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </>
            )}
        </Field>
    );
}
