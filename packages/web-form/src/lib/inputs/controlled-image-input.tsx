import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  ImagePicker,
} from '@maas/web-components';
import { PathsToType } from '@maas/core-utils';
import { Image } from '@maas/core-api-models';
import {
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';
import { useId } from 'react';

type ControlledImageInputProps<T extends FieldValues> = {
  name: PathsToType<T, Image | null>;
  label: string;
  description?: string;
  disabled?: boolean;
  accept?: string;
};

export function ControlledImageInput<T extends FieldValues>(
  props: ControlledImageInputProps<T>,
) {
  const { name, label, description, disabled, accept } = props;
  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name: name as never,
    control: control,
  });
  const id = useId();

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <ImagePicker
        id={id}
        value={field.value}
        onChange={field.onChange}
        disabled={disabled}
        accept={accept}
        aria-invalid={fieldState.invalid}
      />
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
