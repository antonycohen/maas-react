import { useState } from "react";


import { useEditorContext } from "../store/editor-context";
import { cn } from '@maas/core-utils';

export function EditorDebugger() {
  const { content } = useEditorContext();

  const [collapsed, setCollapsed] = useState<boolean>(true);

  return (
    <div className="fixed bottom-0 right-0 flex max-h-[500px] flex-col gap-y-4 overflow-y-auto bg-black p-6 text-white sm:flex">
      <div onClick={() => setCollapsed(!collapsed)}>{`${
        collapsed ? "+" : "-"
      }`}</div>
      <pre
        className={cn({
          hidden: collapsed,
        })}
      >
        data: {JSON.stringify(content, null, 2)}
      </pre>
    </div>
  );
}
