"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from "lexical";
import * as katex from "katex";
import { cn } from "@maas/core-utils";
import { $isEquationNode } from "./equation-node";

type EquationComponentProps = {
  equation: string;
  inline: boolean;
  nodeKey: NodeKey;
};

export function EquationComponent({
  equation,
  inline,
  nodeKey,
}: EquationComponentProps) {
  const [editor] = useLexicalComposerContext();
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [showEditor, setShowEditor] = useState(false);
  const [editedEquation, setEditedEquation] = useState(equation);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  const onDelete = useCallback(
    (event: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        event.preventDefault();
        editor.update(() => {
          const node = $getNodeByKey(nodeKey);
          if ($isEquationNode(node)) {
            node.remove();
          }
        });
      }
      return false;
    },
    [editor, isSelected, nodeKey]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event) => {
          const target = event.target as HTMLElement;
          if (containerRef.current?.contains(target)) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(true);
            if (event.detail === 2) {
              setShowEditor(true);
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, onDelete, setSelected]);

  useEffect(() => {
    if (showEditor && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showEditor]);

  const handleSave = useCallback(() => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isEquationNode(node)) {
        node.setEquation(editedEquation);
      }
    });
    setShowEditor(false);
  }, [editor, editedEquation, nodeKey]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") {
        setEditedEquation(equation);
        setShowEditor(false);
      } else if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        handleSave();
      }
    },
    [equation, handleSave]
  );

  const renderEquation = () => {
    try {
      const html = katex.renderToString(equation || "\\text{equation}", {
        displayMode: !inline,
        output: "htmlAndMathml",
        throwOnError: false,
        errorColor: "#cc0000",
      });
      return (
        <span
          dangerouslySetInnerHTML={{ __html: html }}
          className="equation-render"
        />
      );
    } catch {
      return (
        <span className="text-destructive text-sm">
          Invalid equation: {equation}
        </span>
      );
    }
  };

  if (showEditor) {
    return (
      <span
        ref={containerRef}
        className={cn(
          "border-input bg-background inline-flex flex-col gap-2 rounded-md border p-2",
          {
            "w-full": !inline,
          }
        )}
      >
        <textarea
          ref={inputRef}
          value={editedEquation}
          onChange={(e) => setEditedEquation(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-muted text-foreground min-h-[60px] w-full min-w-[200px] rounded border-none p-2 font-mono text-sm outline-none"
          placeholder="Enter LaTeX equation..."
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded px-2 py-1 text-xs"
          >
            Save (⌘+Enter)
          </button>
          <button
            type="button"
            onClick={() => {
              setEditedEquation(equation);
              setShowEditor(false);
            }}
            className="bg-muted text-muted-foreground hover:bg-muted/80 rounded px-2 py-1 text-xs"
          >
            Cancel (Esc)
          </button>
        </div>
      </span>
    );
  }

  return (
    <span
      ref={containerRef}
      className={cn(
        "equation-wrapper cursor-pointer rounded transition-colors",
        {
          "bg-primary/10 ring-primary ring-2": isSelected,
          "hover:bg-muted/50": !isSelected,
          "inline-block": inline,
          "my-2 block text-center": !inline,
        }
      )}
      title="Double-click to edit"
    >
      {renderEquation()}
    </span>
  );
}
