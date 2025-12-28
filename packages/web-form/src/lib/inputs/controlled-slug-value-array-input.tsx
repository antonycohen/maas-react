import {
  Button,
  Field,
  FieldError,
  FieldLabel,
  Input,
} from '@maas/web-components';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useId } from 'react';
import {
  FieldPath,
  FieldPathValue,
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
  name: FieldPath<T>;
  label: string;
  slugPath: string;
  valuePath: string;
  valuePlaceholder?: string;
  valueLabel?: string;
  slugLabel?: string;
  showSlug?: boolean;
  direction?: 'horizontal' | 'vertical';
  className?: string;
};

export function ControlledSlugValueArrayInput<T extends FieldValues>(
  props: ControlledSlugValueInputProps<T>,
) {
  const {
    name,
    label,
    slugPath,
    valuePath,
    valuePlaceholder = 'Enter value...',
    valueLabel = 'Value',
    slugLabel = 'Slug',
    showSlug = true,
    direction = 'vertical',
    className,
  } = props;

  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name,
    control,
  });

  const id = useId();

  const items = (field.value as Record<string, string>[] | null) ?? [];

  function handleAdd() {
    const newItem = {
      [slugPath]: '',
      [valuePath]: '',
    };
    const updated = [...items, newItem];
    field.onChange(updated as FieldPathValue<T, FieldPath<T>>);
  }

  function handleRemove(index: number) {
    const updated = items.filter((_, i) => i !== index);
    field.onChange(
      (updated.length > 0 ? updated : []) as FieldPathValue<T, FieldPath<T>>,
    );
  }

  function handleValueChange(index: number, newValue: string) {
    const updated = items.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [valuePath]: newValue,
          [slugPath]: slugify(newValue),
        };
      }
      return item;
    });
    field.onChange(updated as FieldPathValue<T, FieldPath<T>>);
  }

  return (
    <Field
      data-invalid={fieldState.invalid}
      orientation={direction}
      className={className}
    >
      <div className="flex items-center justify-between mb-2">
        <FieldLabel
          htmlFor={id}
          className={direction === 'horizontal' ? 'font-semibold' : ''}
        >
          {label}
        </FieldLabel>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="h-8"
        >
          <IconPlus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2 items-end">
            <div className="flex-1">
              <label className="text-xs text-muted-foreground mb-1 block">
                {valueLabel}
              </label>
              <Input
                value={item[valuePath] ?? ''}
                onChange={(e) => handleValueChange(index, e.target.value)}
                placeholder={valuePlaceholder}
                className="h-9"
              />
            </div>
            {showSlug && (
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1 block">
                  {slugLabel}
                </label>
                <Input
                  value={item[slugPath] ?? ''}
                  readOnly
                  disabled
                  className="h-9 bg-muted"
                />
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => handleRemove(index)}
              className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <IconTrash className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
            No items added yet. Click "Add" to create one.
          </div>
        )}
      </div>

      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
