import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
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

const CUSTOM_VALUE = '__custom__';

const DEFAULT_RATIO_OPTIONS = [
  { value: '16:9', label: '16:9 (Widescreen)' },
  { value: '4:3', label: '4:3 (Standard)' },
  { value: '1:1', label: '1:1 (Square)' },
  { value: '3:2', label: '3:2 (Classic)' },
  { value: '21:9', label: '21:9 (Ultra-wide)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '1:1.414', label: '1:1.414 (A4/ISO)' },
];

export type RatioOption = {
  value: string;
  label: string;
};

type ControlledRatioInputProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
  options?: RatioOption[];
};

export function ControlledRatioInput<T extends FieldValues>(
  props: ControlledRatioInputProps<T>,
) {
  const {
    name,
    label,
    placeholder = 'Select ratio',
    description,
    disabled,
    direction = 'vertical',
    className,
    options = DEFAULT_RATIO_OPTIONS,
  } = props;

  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name,
    control: control,
  });
  const id = useId();
  const customInputId = useId();

  // Derive state from field.value - no local state needed
  const isPredefined = options.some((opt) => opt.value === field.value);
  const isCustom = field.value !== null && field.value !== undefined && !isPredefined;
  const selectValue = isPredefined ? field.value : isCustom ? CUSTOM_VALUE : '';

  const handleSelectChange = (value: string) => {
    if (value === CUSTOM_VALUE) {
      field.onChange('');
    } else {
      field.onChange(value);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    field.onChange(e.target.value);
  };

  const inputElement = (
    <div className="flex flex-col gap-2">
      <Select
        value={selectValue}
        onValueChange={handleSelectChange}
        disabled={disabled}
      >
        <SelectTrigger id={id} aria-invalid={fieldState.invalid} onBlur={field.onBlur}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
          <SelectItem value={CUSTOM_VALUE}>Custom...</SelectItem>
        </SelectContent>
      </Select>
      {isCustom && (
        <Input
          id={customInputId}
          value={field.value ?? ''}
          onChange={handleCustomInputChange}
          onBlur={field.onBlur}
          placeholder="e.g., 16:9"
          disabled={disabled}
          aria-invalid={fieldState.invalid}
          autoComplete="off"
        />
      )}
    </div>
  );

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
      {direction === 'horizontal' ? (
        <div className="flex flex-col basis-1/2">
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
