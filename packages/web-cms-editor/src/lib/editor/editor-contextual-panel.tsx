import React, { useCallback } from 'react';

import { cn } from '@maas/core-utils';

import { useEditorContext } from '../store/editor-context';
import { EditorPluginInput } from './editor-plugin-input';

export const EditorContextualPanel = React.memo(function EditorContextualPanel() {
  const {
    selectedPlugin,
    settings: { editMode },
    setSettings,
    selectedBlockContent,
  } = useEditorContext();

  const handleMouseEnter = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      pluginInputsHovered: true,
    }));
  }, [setSettings]);

  const handleMouseLeave = useCallback(() => {
    setSettings((prev) => ({
      ...prev,
      pluginInputsHovered: false,
    }));
  }, [setSettings]);

  if (!editMode) return null;

  return (
    <div
      key={selectedPlugin?.name as string}
      className="editor-contextual-panel h-full w-full overflow-y-auto bg-white p-2.5 pb-40"
    >
      {!selectedBlockContent ? (
        <div className="flex h-32 items-center justify-center text-center text-sm text-muted-foreground">
          Select a block to edit its properties
        </div>
      ) : selectedPlugin !== null ? (
        <div
          className="flex flex-col gap-y-2.5"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="flex items-center gap-x-2.5">
            <span className="text-foreground [&>svg]:h-4 [&>svg]:w-4">
              {selectedPlugin.icon}
            </span>
            <span className="text-sm font-bold text-foreground">
              {selectedPlugin.displayName}
            </span>
          </div>
          {selectedPlugin.inputsSections
            .filter(
              (section) =>
                !section.visibilityCondition ||
                section.visibilityCondition(selectedBlockContent.data)
            )
            .map((section, index) => (
              <div
                key={index}
                className={cn(
                  'editor-contextual-panel-list flex flex-col gap-y-4 rounded-lg',
                  {
                    'border border-border p-4': section.hasBorder,
                  }
                )}
              >
                {section.inputs.map((input, index2) => (
                  <EditorPluginInput key={index2} input={input} />
                ))}
              </div>
            ))}
        </div>
      ) : null}
    </div>
  );
});
