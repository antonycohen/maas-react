import { CMSBlock, CMSBlockData } from '@maas/core-api-models';
import { extractValueFromPath, updateObject } from '@maas/core-utils';
import { DatePicker, Field, FieldLabel } from '@maas/web-components';
import { InputDateDescription } from '../../types';

type EditorPluginInputProps = {
  input: InputDateDescription<CMSBlockData>;
  path?: string;
  blockContent: CMSBlock;
  setBlockContent: (blockContent: CMSBlock) => void;
};

export const EditorDateInput = (props: EditorPluginInputProps) => {
  const { input, path, blockContent, setBlockContent } = props;

  const rawValue = extractValueFromPath<string>(blockContent, path + input.name);
  const dateValue = rawValue ? new Date(rawValue) : undefined;

  return (
    <Field>
      <FieldLabel>{input.label}</FieldLabel>
      <DatePicker
        value={dateValue}
        onChange={(value) => {
          setBlockContent({
            ...updateObject(
              blockContent,
              path + input.name,
              value?.toISOString(),
            ),
          });
        }}
      />
    </Field>
  );
};
