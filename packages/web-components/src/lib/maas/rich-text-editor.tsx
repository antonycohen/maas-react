"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $generateHtmlFromNodes,
  $generateNodesFromDOM,
} from "@lexical/html";
import {
  $getRoot,
  $insertNodes,
  EditorState,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { cn } from "@maas/core-utils";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { Button } from "../ui/button";
import {
  EquationNode,
  EquationPlugin,
  EquationDialog,
  EquationToolbarButton,
} from "./lexical";
import "katex/dist/katex.min.css";

const theme = {
  paragraph: "mb-2 last:mb-0",
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
  },
};

function onError(error: Error) {
  console.error(error);
}

type ToolbarPluginProps = {
  enableEquation?: boolean;
};

function ToolbarPlugin({ enableEquation }: ToolbarPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [showEquationDialog, setShowEquationDialog] = useState(false);

  const formatBold = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
  }, [editor]);

  const formatItalic = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
  }, [editor]);

  const formatUnderline = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
  }, [editor]);

  const formatStrikethrough = useCallback(() => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
  }, [editor]);

  return (
    <>
      <div className="border-input flex gap-1 border-b p-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatBold}
          className="h-8 w-8 p-0"
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatItalic}
          className="h-8 w-8 p-0"
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatUnderline}
          className="h-8 w-8 p-0"
          aria-label="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={formatStrikethrough}
          className="h-8 w-8 p-0"
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        {enableEquation && (
          <EquationToolbarButton onClick={() => setShowEquationDialog(true)} />
        )}
      </div>
      {enableEquation && (
        <EquationDialog
          open={showEquationDialog}
          onOpenChange={setShowEquationDialog}
        />
      )}
    </>
  );
}

type InitialValuePluginProps = {
  initialValue?: string;
};

function InitialValuePlugin({ initialValue }: InitialValuePluginProps) {
  const [editor] = useLexicalComposerContext();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only initialize once on mount to prevent infinite loops
    if (hasInitialized.current || !initialValue) {
      return;
    }
    hasInitialized.current = true;

    editor.update(() => {
      const root = $getRoot();
      root.clear();

      // Parse HTML and convert to Lexical nodes
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialValue, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);

      if (nodes.length > 0) {
        $insertNodes(nodes);
      }
    });
  }, [editor, initialValue]);

  return null;
}

export type RichTextEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  enableEquation?: boolean;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
  enableEquation = true,
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "RichTextEditor",
    theme,
    onError,
    editable: !disabled,
    nodes: enableEquation ? [EquationNode] : [],
  };

  const handleChange = useCallback(
    (editorState: EditorState, editor: import("lexical").LexicalEditor) => {
      editorState.read(() => {
        const html = $generateHtmlFromNodes(editor, null);
        onChange?.(html);
      });
    },
    [onChange]
  );

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div
        id={id}
        data-disabled={disabled}
        aria-invalid={ariaInvalid}
        className={cn(
          "border-input bg-input-background overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
          className
        )}
      >
        <ToolbarPlugin enableEquation={enableEquation} />
        <div className="relative">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                className={cn(
                  "text-foreground min-h-[120px] bg-transparent px-3 py-2 text-sm outline-none"
                )}
                aria-placeholder={placeholder}
                placeholder={
                  <div className="text-muted-foreground pointer-events-none absolute top-0 left-3 pt-2 text-sm">
                    {placeholder}
                  </div>
                }
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <OnChangePlugin onChange={handleChange} />
        <InitialValuePlugin initialValue={value} />
        {enableEquation && <EquationPlugin />}
      </div>
    </LexicalComposer>
  );
}
