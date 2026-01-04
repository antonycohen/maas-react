import { Button } from '@maas/web-components';
import { ArticleTypeFieldType } from '@maas/core-api-models';
import { IconChevronDown, IconChevronUp, IconTrash } from '@tabler/icons-react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
  ControlledCheckbox,
  ControlledEnumInput,
  ControlledCategoryInput,
  ControlledSelectInput,
  ControlledTextInput,
} from '@maas/web-form';

const FIELD_TYPE_OPTIONS: { value: ArticleTypeFieldType; label: string }[] = [
  { value: 'string', label: 'String' },
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'enum', label: 'Enum' },
  { value: 'cms', label: 'CMS' },
  { value: 'category', label: 'Category' },
  { value: 'image', label: 'Image' },
  { value: 'video', label: 'Video' },
];

type FieldEditorProps = {
  index: number;
  onRemove: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  isFirst: boolean;
  isLast: boolean;
};

export function FieldEditor({
  index,
  onRemove,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: FieldEditorProps) {
  const { control } = useFormContext();

  // Watch the type field to conditionally render enum/category inputs
  const fieldType = useWatch({
    control,
    name: `fields.${index}.type`,
  });

  return (
    <div className="border rounded-lg p-4 space-y-4 bg-card">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Field {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            className="h-8 w-8 p-0"
          >
            <IconChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            className="h-8 w-8 p-0"
          >
            <IconChevronDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ControlledTextInput
          name={`fields.${index}.label`}
          label="Label"
          placeholder="Enter field label..."
        />
        <ControlledTextInput
          name={`fields.${index}.key`}
          label="Key"
          placeholder="field_key"
          className="[&_input]:font-mono [&_input]:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ControlledSelectInput
          name={`fields.${index}.type`}
          label="Type"
          options={FIELD_TYPE_OPTIONS}
          placeholder="Select type..."
        />

        {fieldType === 'enum' && (
          <ControlledEnumInput
            name={`fields.${index}.enum`}
            label="Enum"
            placeholder="Select enum..."
          />
        )}

        {fieldType === 'category' && (
          <ControlledCategoryInput
            name={`fields.${index}.category`}
            label="Category"
            placeholder="Select category..."
          />
        )}
      </div>

      <ControlledCheckbox
        name={`fields.${index}.isList`}
        label="Allow multiple values (list)"
      />
    </div>
  );
}
