import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
} from '@maas/web-components';
import { useId } from 'react';
import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

type ControlledSlugValueInputProps<T extends FieldValues> = {
  valueName: FieldPath<T>;
  slugName: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  slugLabel?: string;
  showSlug?: boolean;
  direction?: 'horizontal' | 'vertical';
  disabled?: boolean;
  className?: string;
};

export function ControlledSlugValueInput<T extends FieldValues>(
  props: ControlledSlugValueInputProps<T>,
) {
  const {
    valueName,
    slugName,
    label,
    placeholder = 'Enter value...',
    description,
    slugLabel = 'Slug',
    showSlug = true,
    direction = 'vertical',
    disabled,
    className,
  } = props;

  const form = useFormContext();
  const { control } = form;

  const { field: valueField, fieldState: valueFieldState } = useController({
    name: valueName,
    control,
  });

  const { field: slugField } = useController({
    name: slugName,
    control,
  });

  const id = useId();

  function handleValueChange(newValue: string) {
    valueField.onChange(newValue);
    slugField.onChange(slugify(newValue));
  }

  return (
    <Field
      data-invalid={valueFieldState.invalid}
      orientation={direction}
      className={className}
    >
      <FieldLabel
        htmlFor={id}
        className={direction === 'horizontal' ? 'font-semibold basis-1/2' : ''}
      >
        {label}
      </FieldLabel>
      <div className={direction === 'horizontal' ? 'basis-1/2 space-y-2' : 'space-y-2'}>
        <Input
          id={id}
          value={valueField.value ?? ''}
          onChange={(e) => handleValueChange(e.target.value)}
          onBlur={valueField.onBlur}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={valueFieldState.invalid}
        />
        {showSlug && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              {slugLabel}
            </label>
            <Input
              value={slugField.value ?? ''}
              readOnly
              disabled
              className="bg-muted"
            />
          </div>
        )}
      </div>
      {description && <FieldDescription>{description}</FieldDescription>}
      {valueFieldState.invalid && (
        <FieldError errors={[valueFieldState.error]} />
      )}
    </Field>
  );
}
