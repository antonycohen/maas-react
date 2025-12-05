import React from 'react';

import { EditorPlugin, EditorSettings } from '../types';
import { CMSBlock, CMSBlockCommon } from '@maas/core-api-models';

export type EditorContextType = {
  content: CMSBlock[];
  context: any;
  selectedBlockId: string | null;
  selectedBlockContent: CMSBlock | null;
  plugins: EditorPlugin<any, any, any>[];
  selectedPlugin: EditorPlugin<any, CMSBlockCommon, any> | null;
  settings: EditorSettings;

  setContent: (content: CMSBlock[]) => void;
  setSelectedBlockContent: (content: CMSBlock) => void;
  setSelectedBlockId: (id: string | null) => void;
  setSelectedPlugin: React.Dispatch<
    React.SetStateAction<EditorPlugin<any, any, any> | null>
  >;
  setSettings: React.Dispatch<React.SetStateAction<EditorSettings>>;
  deleteBlockById: (blockId: string) => void;
  addBlock: (block: CMSBlock) => void;
  getPluginFromBlockType: (type: string) => EditorPlugin<any, any, any> | null;
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
  deleteBlockById: () => null,
  addBlock: () => null,
  resetEditor: () => null,
});

const useEditorContext = () => React.useContext(EditorContext);

export { EditorContext, defaultEditorSettings, useEditorContext };
