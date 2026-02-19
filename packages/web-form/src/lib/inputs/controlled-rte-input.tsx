import { Field, FieldDescription, FieldError, FieldLabel } from '@maas/web-components';
import { RichTextEditor } from '@maas/web-components/rich-text-editor';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';
import { useId } from 'react';

type ControlledRTEInputProps<T extends FieldValues> = {
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    description?: string;
    disabled?: boolean;
    direction?: 'horizontal' | 'vertical';
    className?: string;
};

export function ControlledRTEInput<T extends FieldValues>(props: ControlledRTEInputProps<T>) {
    const { name, label, placeholder, description, disabled, direction = 'vertical', className } = props;
    const form = useFormContext();
    const { control } = form;
    const { field, fieldState } = useController({
        name,
        control: control,
    });
    const id = useId();

    return (
        <Field data-invalid={fieldState.invalid} orientation={direction} className={className}>
            <FieldLabel htmlFor={id} className={direction === 'horizontal' ? 'basis-1/2 font-semibold' : ''}>
                {label}
            </FieldLabel>
            <RichTextEditor
                id={id}
                value={field.value}
                onChange={field.onChange}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                className={direction === 'horizontal' ? 'basis-1/2' : ''}
            />
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
