import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  VideoPicker,
} from '@maas/web-components';
import { Video } from '@maas/core-api-models';
import {
  FieldPathByValue,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import { useId } from 'react';

type ControlledVideoInputProps<T extends FieldValues> = {
  name: FieldPathByValue<T, Video | undefined | null>;
  label: string;
  description?: string;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
};

export function ControlledVideoInput<T extends FieldValues>(
  props: ControlledVideoInputProps<T>
) {
  const {
    name,
    label,
    description,
    disabled,
    direction = 'vertical',
    className,
  } = props;
  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name: name as never,
    control: control,
  });
  const id = useId();

  return (
    <Field
      data-invalid={fieldState.invalid}
      orientation={direction}
      className={className}
    >
      <FieldLabel
        htmlFor={id}
        className={direction === 'horizontal' ? 'font-semibold basis-1/2' : ''}
      >
        {label}
      </FieldLabel>
      <VideoPicker
        id={id}
        value={field.value}
        onChange={field.onChange}
        disabled={disabled}
        aria-invalid={fieldState.invalid}
        className={direction === 'horizontal' ? 'basis-1/2' : ''}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
