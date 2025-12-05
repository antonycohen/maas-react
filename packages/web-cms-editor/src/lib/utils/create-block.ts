
import { EditorPlugin } from "../types";
import { CMSBlock } from '@maas/core-api-models';

export const generateBlockId = () => {
  const timestamp = Date.now().toString(36); // Convert to base36 for shorter string
  const randomPart = Math.random().toString(36).substring(2, 10); // Remove '0.' at the start

  return `${timestamp}-${randomPart}`;
};

export const createBlockFromPlugin = (
  plugin: EditorPlugin<any, any, any>,
): CMSBlock => {
  const copy = JSON.parse(JSON.stringify(plugin.shape));

  return {
    ...copy,
    id: generateBlockId(),
  };
};
