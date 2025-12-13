import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@maas/web-components';
import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import { useId } from 'react';

export type SelectOption = {
  value: string;
  label: string;
};

type ControlledSelectInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
};

export function ControlledSelectInput<T extends FieldValues>(
  props: ControlledSelectInputProps<T>,
) {
  const { name, label, options, placeholder, description, disabled, direction = 'vertical', className } = props;
  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name,
    control: control,
  });
  const id = useId();

  return (
    <Field data-invalid={fieldState.invalid} orientation={direction} className={className}>
      <FieldLabel htmlFor={id} className={direction === 'horizontal' ? 'font-semibold basis-1/2' : ''}>
        {label}
      </FieldLabel>
      <Select
        value={field.value}
        onValueChange={field.onChange}
        disabled={disabled}
      >
        <SelectTrigger
          className={direction === 'horizontal' ? 'basis-1/2' : ''}
          id={id}
          aria-invalid={fieldState.invalid}
          onBlur={field.onBlur}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
