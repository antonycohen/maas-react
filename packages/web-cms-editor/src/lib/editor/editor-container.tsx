import React from "react";


import { useEditorContext } from "../store/editor-context";
import { cn } from '@maas/core-utils';

export const EditorContainer = ({
  children,
}: React.PropsWithChildren<React.ComponentProps<"div">>) => {
  const { settings } = useEditorContext();

  return (
    <div
      className={cn("editor-container", "h-screen w-full", "hidden", {
        "fixed bottom-0 left-0 top-0 z-10 flex h-screen flex-col":
          settings.visible,
      })}
    >
      {children}
    </div>
  );
};
