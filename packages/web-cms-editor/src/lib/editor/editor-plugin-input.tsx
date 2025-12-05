import { useEditorContext } from "../store/editor-context";
import { EditorDateInput } from "./editor-inputs/editor-date-input";
import { EditorImageInput } from "./editor-inputs/editor-image-input";
import { EditorMultiGroupInput } from "./editor-inputs/editor-multi-group-input";
import { EditorRteInput } from "./editor-inputs/editor-rte-input";
import { EditorSelectInput } from "./editor-inputs/editor-select-input";
import { EditorTextInput } from "./editor-inputs/editor-text-input";
import { CMSBlockData } from '@maas/core-api-models';
import { InputDescription } from '../types';

type EditorPluginInputProps = {
  input: InputDescription<CMSBlockData>;
  path?: string;
};
export const EditorPluginInput = (props: EditorPluginInputProps) => {
  const { selectedBlockContent, setSelectedBlockContent, selectedPlugin } =
    useEditorContext();

  if (selectedBlockContent === null || selectedPlugin === null) return null;
  const { path = "data." } = props;

  // We are adding a key to the input components to force a re-render when the selectedBlockContent changes
  // and avoid the input components to keep the state of the previous selectedBlockContent and override the new one

  const getInput = (input: InputDescription<CMSBlockData>, path?: string) => {
    switch (input.type) {
      case "text":
        return (
          <EditorTextInput
            key={selectedBlockContent?.id}
            input={input}
            setBlockContent={setSelectedBlockContent}
            blockContent={selectedBlockContent}
            path={path}
          />
        );
      case "select":
        return (
          <EditorSelectInput
            key={selectedBlockContent?.id}
            input={input}
            setBlockContent={setSelectedBlockContent}
            blockContent={selectedBlockContent}
            path={path}
          />
        );
      case "rte":
        return (
          <EditorRteInput
            key={selectedBlockContent?.id}
            input={input}
            setBlockContent={setSelectedBlockContent}
            blockContent={selectedBlockContent}
            path={path}
          />
        );
      case "image":
        return (
          <EditorImageInput
            key={selectedBlockContent?.id}
            input={input}
            setBlockContent={setSelectedBlockContent}
            blockContent={selectedBlockContent}
            path={path}
          />
        );
      case "date":
        return (
          <EditorDateInput
            key={selectedBlockContent?.id}
            input={input}
            setBlockContent={setSelectedBlockContent}
            blockContent={selectedBlockContent}
            path={path}
          />
        );
      case "multi_group":
        return (
          <EditorMultiGroupInput
            key={selectedBlockContent?.id}
            input={input}
            setBlockContent={setSelectedBlockContent}
            blockContent={selectedBlockContent}
            path={path}
            selectedPlugin={selectedPlugin}
          />
        );
      default:
        return null;
    }
  };

  return getInput(props.input, path);
};
