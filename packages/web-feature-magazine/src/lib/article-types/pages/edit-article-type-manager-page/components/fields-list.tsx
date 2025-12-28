import { Button } from '@maas/web-components';
import { ArticleTypeField } from '@maas/core-api-models';
import { IconPlus } from '@tabler/icons-react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { FieldEditor } from './field-editor';

export function FieldsList() {
  const { control } = useFormContext();
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: 'fields',
  });

  const handleAdd = () => {
    const newField: ArticleTypeField = {
      label: '',
      key: '',
      type: 'string',
      enum: null,
      category: null,
      isList: null,
      validators: null,
    };
    append(newField);
  };

  const handleMoveUp = (index: number) => {
    if (index > 0) {
      swap(index, index - 1);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index < fields.length - 1) {
      swap(index, index + 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {fields.length} field{fields.length !== 1 ? 's' : ''} defined
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          className="h-8"
        >
          <IconPlus className="h-4 w-4 mr-1" />
          Add Field
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
          No custom fields defined yet. Click "Add Field" to create one.
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <FieldEditor
              key={field.id}
              index={index}
              onRemove={() => remove(index)}
              onMoveUp={() => handleMoveUp(index)}
              onMoveDown={() => handleMoveDown(index)}
              isFirst={index === 0}
              isLast={index === fields.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
