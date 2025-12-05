import React, { useCallback, useMemo, useRef, useState } from 'react';

import { CMSBlock } from '@maas/core-api-models';

import { EditorPlugin, EditorSettings } from '../types';
import { generateBlockId } from '../utils/create-block';
import { defaultEditorSettings, EditorContext } from './editor-context';

type EditorProviderProps = React.PropsWithChildren<{
  plugins: EditorPlugin<any, any, any>[];
  field: {
    data: CMSBlock[];
    errors: string[] | undefined;
    onSave: (content: CMSBlock[]) => void;
  };
  context: any;
}>;

export function EditorProvider(props: EditorProviderProps) {
  const { children, plugins, field, context } = props;

  // Track the last saved version using a ref when editor is hidden
  // This avoids cascading renders from useEffect setState
  const lastSavedVersionRef = useRef<CMSBlock[]>(field?.data ?? []);

  // Update ref when editor is hidden and field data changes
  if (!defaultEditorSettings.visible) {
    lastSavedVersionRef.current = field?.data ?? [];
  }

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedPlugin, setSelectedPlugin] = useState<EditorPlugin<
    any,
    any,
    any
  > | null>(null);
  const [settings, setSettings] = useState<EditorSettings>(
    defaultEditorSettings
  );

  // Sync ref when editor becomes hidden
  const prevVisibleRef = useRef(settings.visible);
  if (prevVisibleRef.current && !settings.visible) {
    // Editor just closed, capture current field data as last saved
    lastSavedVersionRef.current = field?.data ?? [];
  }
  prevVisibleRef.current = settings.visible;

  const content = field.data as CMSBlock[];

  const setContent = useCallback(
    (editorContent: CMSBlock[]) => {
      field?.onSave([...editorContent]);
    },
    [field]
  );

  const deleteBlockById = useCallback(
    (id: string) => {
      setContent(content.filter((block) => block.id !== id));
    },
    [content, setContent]
  );

  const addBlock = useCallback(
    (block: CMSBlock) => {
      setContent([...content, { ...block, id: generateBlockId() }]);
    },
    [content, setContent]
  );

  // Reset de l'éditeur avec le contenu initial qui est le contenu du field
  const resetEditor = useCallback(() => {
    setContent(lastSavedVersionRef.current);
    setSettings(defaultEditorSettings);
    setSelectedBlockId(null);
  }, [setContent]);

  const getPluginFromBlockType = useCallback(
    (blockType: string): EditorPlugin<any, any, any> | null => {
      return plugins?.find((plugin) => plugin.blockType === blockType) || null;
    },
    [plugins],
  );

  const selectedBlockContent = useMemo(() => {
    if (!selectedBlockId) return null;
    const selectedBlock = content.find((block) => block.id === selectedBlockId);
    if (!selectedBlock) return null;

    return selectedBlock;
  }, [content, selectedBlockId]);

  const setSelectedBlockContent = useCallback(
    (newContent: CMSBlock) => {
      setContent(
        content.map((block) => {
          if (selectedBlockContent && block.id === selectedBlockContent.id) {
            return newContent;
          }

          return block;
        }),
      );
    },
    [content, selectedBlockContent, setContent],
  );

  const ctx = React.useMemo(() => {
    return {
      content,
      selectedPlugin,
      selectedBlockId,
      selectedBlockContent,
      plugins,
      settings,
      setSelectedBlockId,
      deleteBlockById,
      addBlock,
      setSelectedBlockContent,
      setContent,
      getPluginFromBlockType,
      setSettings,
      resetEditor,
      setSelectedPlugin,
      context,
    };
  }, [
    content,
    selectedPlugin,
    selectedBlockId,
    selectedBlockContent,
    plugins,
    settings,
    setSelectedBlockContent,
    addBlock,
    deleteBlockById,
    setContent,
    getPluginFromBlockType,
    resetEditor,
    context,
  ]);

  return (
    <EditorContext.Provider value={ctx}>{children}</EditorContext.Provider>
  );
}
