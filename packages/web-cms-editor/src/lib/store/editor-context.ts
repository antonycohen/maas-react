import React from 'react';

import { EditorPlugin, EditorSettings } from '../types';
import { CMSBlock, CMSBlockCommon } from '@maas/core-api-models';

export type EditorContextType = {
  content: CMSBlock[];
  context: any;
  selectedBlockId: string | null;
  selectedBlockContent: CMSBlock | null;
  parentBlockId: string | null; // Parent of selected block (null if at root)
  plugins: EditorPlugin<any, any, any>[];
  selectedPlugin: EditorPlugin<any, CMSBlockCommon, any> | null;
  settings: EditorSettings;

  setContent: (content: CMSBlock[]) => void;
  setSelectedBlockContent: (content: CMSBlock) => void;
  setSelectedBlockId: (id: string | null, parentId?: string | null) => void;
  setSelectedPlugin: React.Dispatch<
    React.SetStateAction<EditorPlugin<any, any, any> | null>
  >;
  setSettings: React.Dispatch<React.SetStateAction<EditorSettings>>;
  deleteBlockById: (blockId: string) => void;
  addBlock: (block: CMSBlock) => void;
  addBlockToParent: (block: CMSBlock, parentId: string, index?: number) => void;
  getPluginFromBlockType: (type: string) => EditorPlugin<any, any, any> | null;
  getPluginsForContext: (isNested: boolean) => EditorPlugin<any, any, any>[];
  resetEditor: () => void;
};

const defaultEditorSettings: EditorSettings = {
  editMode: true,
  hoveredBlockId: null,
  pluginInputsHovered: false,
  previewMode: false,
  visible: false,
};

const EditorContext = React.createContext<EditorContextType>({
  content: [],
  selectedBlockId: null,
  selectedBlockContent: null,
  parentBlockId: null,
  plugins: [],
  context: null,
  selectedPlugin: null,
  settings: defaultEditorSettings,

  setContent: () => {},
  setSelectedPlugin: () => null,
  setSelectedBlockId: () => {},
  setSelectedBlockContent: () => {},
  setSettings: () => {},
  getPluginFromBlockType: () => null,
  getPluginsForContext: () => [],
  deleteBlockById: () => null,
  addBlock: () => null,
  addBlockToParent: () => null,
  resetEditor: () => null,
});

const useEditorContext = () => React.useContext(EditorContext);

export { EditorContext, defaultEditorSettings, useEditorContext };
