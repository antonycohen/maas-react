import {
  DatePicker,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@maas/web-components';
import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import { useId } from 'react';

type ControlledDateInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
};

export function ControlledDateInput<T extends FieldValues>(
  props: ControlledDateInputProps<T>,
) {
  const { name, label, placeholder, description, disabled } = props;
  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name,
    control: control,
  });
  const id = useId();

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <DatePicker
        id={id}
        value={field.value}
        onChange={field.onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={fieldState.invalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
