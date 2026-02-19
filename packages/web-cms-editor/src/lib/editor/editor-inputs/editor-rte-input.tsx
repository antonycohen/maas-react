import { CMSBlock, CMSBlockData } from '@maas/core-api-models';
import { extractValueFromPath, updateObject } from '@maas/core-utils';
import { Field, FieldLabel } from '@maas/web-components';
import { RichTextEditor } from '@maas/web-components/rich-text-editor';
import { InputRTEDescription } from '../../types';

type EditorPluginInputProps = {
    input: InputRTEDescription<CMSBlockData>;
    path?: string;
    blockContent: CMSBlock;
    setBlockContent: (blockContent: CMSBlock) => void;
};

export const EditorRteInput = (props: EditorPluginInputProps) => {
    const { input, path, blockContent, setBlockContent } = props;

    return (
        <Field>
            <FieldLabel>{input.label}</FieldLabel>
            <RichTextEditor
                value={extractValueFromPath<string>(blockContent, path + input.name)}
                onChange={(value) => {
                    setBlockContent({
                        ...updateObject(blockContent, path + input.name, value),
                    });
                }}
            />
        </Field>
    );
};
