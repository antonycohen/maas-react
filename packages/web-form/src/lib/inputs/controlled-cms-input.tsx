import { ReactNode } from 'react';
import {
  FieldPath,
  FieldValues,
  useController,
  useFormContext,
} from 'react-hook-form';

import { CMSBlock } from '@maas/core-api-models';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@maas/web-components';
import { Editor, EditorPlugin, EditorTrigger } from '@maas/web-cms-editor';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditorPlugin<Context> = EditorPlugin<any, any, Context>;

type ControlledCMSInputProps<T extends FieldValues, Context = unknown> = {
  name: FieldPath<T>;
  label: string;
  description?: string;
  plugins: AnyEditorPlugin<Context>[];
  context?: Context;
  triggerLabel?: string;
  renderTrigger?: (props: { openEditor: () => void }) => ReactNode;
};

export function ControlledCMSInput<T extends FieldValues, Context = unknown>(
  props: ControlledCMSInputProps<T, Context>,
) {
  const {
    name,
    label,
    description,
    plugins,
    context,
    triggerLabel = "Ouvrir l'éditeur",
    renderTrigger,
  } = props;

  const form = useFormContext();
  const { control } = form;
  const { field, fieldState } = useController({
    name,
    control,
  });

  const handleSave = (content: CMSBlock[]) => {
    field.onChange(content);
  };

  return (
    <Field data-invalid={fieldState.invalid}>
      <FieldLabel>{label}</FieldLabel>
      <Editor
        field={{
          data: (field.value as CMSBlock[]) ?? [],
          errors: fieldState.error
            ? [fieldState.error.message ?? '']
            : undefined,
          onSave: handleSave,
        }}
        plugins={plugins}
        context={context}
        onSave={() => {
          // Content is saved via field.onSave callback
        }}
      >
        <EditorTrigger>{renderTrigger ?? triggerLabel}</EditorTrigger>
      </Editor>
      {description && <FieldDescription>{description}</FieldDescription>}
      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
    </Field>
  );
}
