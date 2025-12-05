import { Field, FieldError, FieldLabel, Input } from '@maas/web-components';
import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import { useId } from 'react';

type ControlledTextInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
};

export function ControlledTextInput<T extends FieldValues>(
  props: ControlledTextInputProps<T>,
) {
  const { name, label, placeholder } = props;
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
      <Input
        {...field}
        aria-invalid={fieldState.invalid}
        autoComplete="off"
        placeholder={placeholder}
        id={id}
      />
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
