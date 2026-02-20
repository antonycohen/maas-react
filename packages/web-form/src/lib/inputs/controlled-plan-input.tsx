import { useId, useState } from 'react';
import { FieldPathByValue, FieldValues, useController, useFormContext } from 'react-hook-form';

import { useGetPlans } from '@maas/core-api';
import { PlanRef } from '@maas/core-api-models';
import { AsyncCombobox, Field, FieldDescription, FieldError, FieldLabel } from '@maas/web-components';

type ControlledPlanInputProps<T extends FieldValues> = {
    name: FieldPathByValue<T, PlanRef | undefined | null>;
    label: string;
    placeholder?: string;
    description?: string;
    direction?: 'horizontal' | 'vertical';
    disabled?: boolean;
    className?: string;
};

export function ControlledPlanInput<T extends FieldValues>(props: ControlledPlanInputProps<T>) {
    const { name, label, placeholder = 'Select plan...', description, direction, disabled, className } = props;

    const [searchTerm, setSearchTerm] = useState('');

    const form = useFormContext();
    const { control } = form;
    const { field, fieldState } = useController({
        name,
        control,
    });
    const id = useId();

    const { data: plansData, isLoading } = useGetPlans(
        {
            filters: searchTerm ? { name: searchTerm } : undefined,
            limit: 15,
            offset: 0,
        },
        {
            enabled: true,
        }
    );

    const plans = plansData?.data ?? [];
    const options = plans.map((plan) => ({
        id: plan.id,
        label: plan.name ?? '',
    }));

    const currentValue = field.value as (PlanRef & { name?: string }) | null | undefined;
    const comboboxValue =
        currentValue && currentValue.id
            ? { id: currentValue.id, label: (currentValue as any).name ?? currentValue.id }
            : null;

    return (
        <Field data-invalid={fieldState.invalid} orientation={direction} className={className}>
            <FieldLabel htmlFor={id} className={direction === 'horizontal' ? 'basis-1/2 font-semibold' : ''}>
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
                searchPlaceholder="Search plans..."
                emptyMessage="No plan found."
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                className={direction === 'horizontal' ? 'basis-1/2' : 'w-full'}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
