import { CMSBlock, CMSBlockData, Image } from '@maas/core-api-models';
import { extractValueFromPath, updateObject } from '@maas/core-utils';
import { Field, FieldLabel, ImagePicker } from '@maas/web-components';
import { InputImageDescription } from '../../types';

type EditorPluginInputProps = {
  input: InputImageDescription<CMSBlockData>;
  path?: string;
  blockContent: CMSBlock;
  setBlockContent: (blockContent: CMSBlock) => void;
};

export const EditorImageInput = (props: EditorPluginInputProps) => {
  const { input, path, blockContent, setBlockContent } = props;

  const currentImage = extractValueFromPath<Image>(
    blockContent,
    path + input.name,
  );

  return (
    <Field>
      <FieldLabel>{input.label}</FieldLabel>
      <ImagePicker
        value={currentImage}
        onChange={(image) => {
          setBlockContent({
            ...updateObject(blockContent, path + input.name, image),
          });
        }}
      />
    </Field>
  );
};
