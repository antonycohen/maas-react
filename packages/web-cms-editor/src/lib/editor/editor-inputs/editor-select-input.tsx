import { CMSBlock, CMSBlockData } from '@maas/core-api-models';
import { extractValueFromPath, updateObject } from '@maas/core-utils';
import {
  Field,
  FieldLabel,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@maas/web-components';
import { InputSelectDescription } from '../../types';

type EditorPluginInputProps = {
  input: InputSelectDescription<CMSBlockData>;
  path?: string;
  blockContent: CMSBlock;
  setBlockContent: (blockContent: CMSBlock) => void;
};

export const EditorSelectInput = (props: EditorPluginInputProps) => {
  const { input, path, blockContent, setBlockContent } = props;

  const currentValue = extractValueFromPath<string | number>(
    blockContent,
    path + input.name,
  );

  return (
    <Field>
      <FieldLabel>{input.label}</FieldLabel>
      <Select
        value={currentValue?.toString()}
        onValueChange={(value) => {
          setBlockContent({
            ...updateObject(blockContent, path + input.name, value),
          });
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
        <SelectContent>
          {input.options.map((option) => (
            <SelectItem key={option.value.toString()} value={option.value.toString()}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
};
