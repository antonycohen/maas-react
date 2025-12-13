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
  description?: string;
  direction?: 'horizontal' | 'vertical';
  className?: string;
};

export function ControlledTextareaInput<T extends FieldValues>(
  props: ControlledTextInputProps<T>,
) {
  const { name, label, placeholder, description, direction = 'vertical', className } = props;
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
      <InputGroup className={direction === 'horizontal' ? 'basis-1/2' : ''}>
        <InputGroupTextarea
          {...field}
          id={id}
          placeholder={placeholder}
          rows={6}
          className="min-h-24 resize-none"
          aria-invalid={fieldState.invalid}
        />
        <InputGroupAddon align="block-end">
          <InputGroupText className="tabular-nums">
            {field.value.length}/100 characters
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
