import {
    Field,
    FieldError,
    FieldLabel,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@maas/web-components';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';
import { useId } from 'react';

type ControlledTextInputProps<T extends FieldValues> = {
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    direction?: 'horizontal' | 'vertical' | 'responsive';
    className?: string;
    disabled?: boolean;
    readOnly?: boolean;
    inputPrefix?: string;
};

export function ControlledTextInput<T extends FieldValues>(props: ControlledTextInputProps<T>) {
    const { name, label, placeholder, direction = 'vertical', className, disabled, readOnly, inputPrefix } = props;
    const form = useFormContext();
    const { control } = form;
    const { field, fieldState } = useController({
        name,
        control: control,
    });
    const id = useId();

    const inputElement = inputPrefix ? (
        <InputGroup>
            <InputGroupAddon align="inline-start">
                <InputGroupText>{inputPrefix}</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput
                {...field}
                aria-invalid={fieldState.invalid}
                autoComplete="off"
                placeholder={placeholder}
                readOnly={readOnly}
                disabled={disabled}
                id={id}
            />
        </InputGroup>
    ) : (
        <Input
            {...field}
            aria-invalid={fieldState.invalid}
            autoComplete="off"
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            id={id}
        />
    );

    return (
        <Field data-invalid={fieldState.invalid} orientation={direction} className={className}>
            <FieldLabel htmlFor={id} className={direction !== 'vertical' ? 'basis-1/2 font-semibold' : ''}>
                {label}
            </FieldLabel>
            {direction !== 'vertical' ? (
                <div className="flex basis-1/2 flex-col">
                    {inputElement}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </div>
            ) : (
                <>
                    {inputElement}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </>
            )}
        </Field>
    );
}
