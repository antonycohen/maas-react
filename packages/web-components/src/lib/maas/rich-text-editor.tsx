"use client";

import { useCallback, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getRoot,
  EditorState,
  FORMAT_TEXT_COMMAND,
  $createParagraphNode,
  $createTextNode,
} from "lexical";
import { cn } from "@maas/core-utils";
import { Bold, Italic, Underline, Strikethrough } from "lucide-react";
import { Button } from "../ui/button";

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

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

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
    </div>
  );
}

type InitialValuePluginProps = {
  initialValue?: string;
};

function InitialValuePlugin({ initialValue }: InitialValuePluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialValue) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(initialValue));
        root.append(paragraph);
      });
    }
  }, []);

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
};

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start typing...",
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: RichTextEditorProps) {
  const initialConfig = {
    namespace: "RichTextEditor",
    theme,
    onError,
    editable: !disabled,
  };

  const handleChange = useCallback(
    (editorState: EditorState) => {
      editorState.read(() => {
        const root = $getRoot();
        const text = root.getTextContent();
        onChange?.(text);
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
          "border-input dark:bg-input/30 overflow-hidden rounded-md border shadow-xs transition-[color,box-shadow]",
          "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50",
          className
        )}
      >
        <ToolbarPlugin />
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
      </div>
    </LexicalComposer>
  );
}
