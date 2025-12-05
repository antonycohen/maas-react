import { CMSBlock, CMSBlockData } from '@maas/core-api-models';
import { extractValueFromPath, updateObject } from '@maas/core-utils';
import { Field, FieldLabel, Input } from '@maas/web-components';
import { InputTextDescription } from '../../types';

type EditorPluginInputProps = {
  input: InputTextDescription<CMSBlockData>;
  path?: string;
  blockContent: CMSBlock;
  setBlockContent: (blockContent: CMSBlock) => void;
};

export const EditorTextInput = (props: EditorPluginInputProps) => {
  const { input, path, blockContent, setBlockContent } = props;

  return (
    <Field>
      <FieldLabel>{input.label}</FieldLabel>
      <Input
        required={input.required}
        value={extractValueFromPath<string>(blockContent, path + input.name) ?? ''}
        onChange={(e) => {
          setBlockContent({
            ...updateObject(blockContent, path + input.name, e.target.value),
          });
        }}
      />
    </Field>
  );
};
