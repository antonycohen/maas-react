import { ReactNode } from 'react';

import { CMSBlockCommon } from '@maas/core-api-models';
import { ObjectDotNotation } from '@maas/core-utils';

export type EditorPreviewMode = 'desktop' | 'mobile';

type CommonInputDescription<T> = {
  required?: boolean;
  name: ObjectDotNotation<T> | '';
  label: string;
  condition?: string;
};

export type InputTextDescription<T> = {
  type: 'text';
} & CommonInputDescription<T>;

export type InputSelectDescription<T> = {
  type: 'select';
  options: {
    label: string;
    value: string | number;
  }[];
} & CommonInputDescription<T>;

export type InputRTEDescription<T> = {
  type: 'rte';
} & CommonInputDescription<T>;

// For multi_group, items reference fields within the array items pointed by `name`
// This type distributes over each array key in T to properly constrain item names
type MultiGroupItemInput<Item> = {
  type: 'text' | 'select' | 'rte' | 'date' | 'image';
  name: ObjectDotNotation<Item> & string;
  label: string;
  required?: boolean;
  condition?: string;
  options?: { label: string; value: string | number }[];
};

// Base multi_group type for generic/unknown types
export type InputMultiGroupDescriptionBase = {
  type: 'multi_group';
  name: string;
  titlePath?: string;
  subtitle?: string;
  items: {
    type: 'text' | 'select' | 'rte' | 'date' | 'image';
    name: string;
    label: string;
    required?: boolean;
    condition?: string;
    options?: { label: string; value: string | number }[];
  }[];
  label: string;
  required?: boolean;
  condition?: string;
};

// Distribute over keys of T to create a union where each variant has:
// - `name` as a specific key K that points to an array
// - `items[].name` constrained to keys of the array item type
type InputMultiGroupDescriptionStrict<T> = {
  [K in keyof T & string]: T[K] extends (infer Item)[]
    ? {
        type: 'multi_group';
        name: K;
        titlePath?: ObjectDotNotation<Item> & string;
        subtitle?: string;
        items: MultiGroupItemInput<Item>[];
        label: string;
        required?: boolean;
        condition?: string;
      }
    : never;
}[keyof T & string];

// Use strict type when T has known array keys, otherwise fall back to base type
export type InputMultiGroupDescription<T> =
  InputMultiGroupDescriptionStrict<T> extends never
    ? InputMultiGroupDescriptionBase
    : InputMultiGroupDescriptionStrict<T>;

export type InputImageDescription<T> = {
  type: 'image';
} & CommonInputDescription<T>;

export type InputDateDescription<T> = {
  type: 'date';
} & CommonInputDescription<T>;

export type InputDescriptionExcludeGroup<T> = Exclude<
  InputDescription<T>,
  { type: 'group' | 'multi_group' }
>;

export type InputDescription<T> =
  | InputTextDescription<T>
  | InputSelectDescription<T>
  | InputMultiGroupDescription<T>
  | InputMultiGroupDescriptionStrict<T>
  | InputRTEDescription<T>
  | InputDateDescription<T>
  | InputImageDescription<T>;

export interface EditorSettings {
  editMode: boolean;
  hoveredBlockId: string | null;
  pluginInputsHovered: boolean;
  previewMode: EditorPreviewMode | false;
  visible: boolean;
}

/**
 * Configuration for drag-and-drop behavior of a plugin
 */
export interface PluginDragDropConfig {
  /**
   * Whether this plugin can contain nested blocks (e.g., frame plugin)
   * @default false
   */
  canContainChildren?: boolean;

  /**
   * The path to the children array in block.data (e.g., 'children')
   * Required if canContainChildren is true
   */
  childrenDataPath?: string;

  /**
   * Whitelist of block types that can be nested inside this plugin
   * If undefined and canContainChildren is true, all nestable types are allowed
   */
  allowedChildBlockTypes?: string[];

  /**
   * Whether this plugin can be placed inside a container plugin
   * @default true
   */
  canBeNested?: boolean;
}

export declare type EditorPlugin<
  PluginName,
  BlockProperties extends CMSBlockCommon,
  Context,
> = {
  name: PluginName;
  displayName: string;
  enabled: boolean;
  icon: ReactNode;
  blockType: BlockProperties['type'];
  inputsSections: {
    inputs: InputDescription<BlockProperties['data']>[];
    name: string;
    hasBorder: boolean;
    visibilityCondition?: (data: BlockProperties['data']) => boolean;
  }[];
  renderingBlock: (
    blockProps: BlockProperties & { context: Context },
    editorSettings?: EditorSettings,
  ) => ReactNode;
  shape: BlockProperties;

  /**
   * Drag-and-drop configuration for this plugin
   */
  dragDrop?: PluginDragDropConfig;
};
