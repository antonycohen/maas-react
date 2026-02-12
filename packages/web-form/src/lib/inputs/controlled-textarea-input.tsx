import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from '@maas/web-components';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';
import { useId } from 'react';
import { useTranslation } from '@maas/core-translations';

type ControlledTextInputProps<T extends FieldValues> = {
    name: FieldPath<T>;
    label: string;
    placeholder?: string;
    description?: string;
    direction?: 'horizontal' | 'vertical';
    className?: string;
    maxLength?: number;
};

export function ControlledTextareaInput<T extends FieldValues>(props: ControlledTextInputProps<T>) {
    const { name, label, placeholder, description, direction = 'vertical', className, maxLength } = props;
    const { t } = useTranslation();
    const form = useFormContext();
    const { control } = form;
    const { field, fieldState } = useController({
        name,
        control: control,
    });
    const id = useId();

    const inputElement = (
        <InputGroup>
            <InputGroupTextarea
                {...field}
                id={id}
                placeholder={placeholder}
                rows={6}
                className="min-h-24 resize-none"
                aria-invalid={fieldState.invalid}
            />
            {maxLength && (
                <InputGroupAddon align="block-end">
                    <InputGroupText className="tabular-nums">
                        {t('common.characters', { count: field.value?.length ?? 0, max: maxLength })}
                    </InputGroupText>
                </InputGroupAddon>
            )}
        </InputGroup>
    );

    return (
        <Field data-invalid={fieldState.invalid} orientation={direction} className={className}>
            <FieldLabel htmlFor={id} className={direction === 'horizontal' ? 'basis-1/2 font-semibold' : ''}>
                {label}
            </FieldLabel>
            {direction === 'horizontal' ? (
                <div className="flex basis-1/2 flex-col">
                    {inputElement}
                    {description && <FieldDescription>{description}</FieldDescription>}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </div>
            ) : (
                <>
                    {inputElement}
                    {description && <FieldDescription>{description}</FieldDescription>}
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </>
            )}
        </Field>
    );
}
