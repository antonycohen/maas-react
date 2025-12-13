import {Field, FieldDescription, FieldError, FieldLabel, ImagePicker,} from '@maas/web-components';
import {UpdateImage} from '@maas/core-api-models';
import {FieldPathByValue, FieldValues, useController, useFormContext,} from 'react-hook-form';
import {useId} from 'react';

type ControlledImageInputProps<T extends FieldValues> = {
  name: FieldPathByValue<T, UpdateImage | undefined | null >;
  label: string;
  description?: string;
  disabled?: boolean;
  accept?: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
};

export function ControlledImageInput<T extends FieldValues>(
  props: ControlledImageInputProps<T>,
) {
  const { name, label, description, disabled, accept, direction = 'vertical', className } = props;
  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name: name as never,
    control: control,
  });
  const id = useId();

  return (
    <Field data-invalid={fieldState.invalid} orientation={direction} className={className}>
      <FieldLabel htmlFor={id} className={direction === 'horizontal' ? 'font-semibold basis-1/2' : ''}>
        {label}
      </FieldLabel>
      <ImagePicker
        id={id}
        value={field.value}
        onChange={field.onChange}
        disabled={disabled}
        accept={accept}
        aria-invalid={fieldState.invalid}
        className={direction === 'horizontal' ? 'basis-1/2' : ''}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
