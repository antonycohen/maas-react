"use client";

import { useCallback, useEffect, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $insertNodes,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { $createEquationNode, EquationNode } from "./equation-node";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Sigma } from "lucide-react";
import * as katex from "katex";

export const INSERT_EQUATION_COMMAND: LexicalCommand<{
  equation: string;
  inline: boolean;
}> = createCommand("INSERT_EQUATION_COMMAND");

type EquationPluginProps = {
  onOpenChange?: (open: boolean) => void;
};

export function EquationPlugin({ onOpenChange }: EquationPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error("EquationPlugin: EquationNode not registered in editor");
    }

    return editor.registerCommand(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload;
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          const equationNode = $createEquationNode(equation, inline);
          $insertNodes([equationNode]);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  useEffect(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  return null;
}

type EquationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EquationDialog({ open, onOpenChange }: EquationDialogProps) {
  const [editor] = useLexicalComposerContext();
  const [equation, setEquation] = useState("");
  const [inline, setInline] = useState(true);
  const [preview, setPreview] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!equation) {
      setPreview("");
      setError(null);
      return;
    }

    try {
      const html = katex.renderToString(equation, {
        displayMode: !inline,
        output: "htmlAndMathml",
        throwOnError: true,
      });
      setPreview(html);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid equation");
      setPreview("");
    }
  }, [equation, inline]);

  const handleInsert = useCallback(() => {
    if (!equation || error) return;

    editor.dispatchCommand(INSERT_EQUATION_COMMAND, { equation, inline });
    setEquation("");
    onOpenChange(false);
  }, [editor, equation, inline, error, onOpenChange]);

  const handleClose = useCallback(() => {
    setEquation("");
    setError(null);
    onOpenChange(false);
  }, [onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Insert Equation</DialogTitle>
          <DialogDescription>
            Enter a LaTeX equation. Use inline for equations within text, or
            block for centered display equations.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="equation-type"
                checked={inline}
                onChange={() => setInline(true)}
                className="accent-primary"
              />
              <span className="text-sm">Inline</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="equation-type"
                checked={!inline}
                onChange={() => setInline(false)}
                className="accent-primary"
              />
              <span className="text-sm">Block</span>
            </label>
          </div>

          <textarea
            value={equation}
            onChange={(e) => setEquation(e.target.value)}
            className="bg-muted text-foreground placeholder:text-muted-foreground min-h-[80px] w-full rounded-md border p-3 font-mono text-sm outline-none focus:ring-2"
            placeholder="e.g., E = mc^2, \frac{a}{b}, \sum_{i=1}^{n} x_i"
          />

          {error && <p className="text-destructive text-sm">{error}</p>}

          {preview && (
            <div className="bg-muted/50 rounded-md p-4">
              <p className="text-muted-foreground mb-2 text-xs">Preview:</p>
              <div
                className={inline ? "inline-block" : "text-center"}
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          )}

          <div className="bg-muted/30 rounded-md p-3">
            <p className="text-muted-foreground mb-2 text-xs font-medium">
              Common examples:
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Fraction", value: "\\frac{a}{b}" },
                { label: "Square root", value: "\\sqrt{x}" },
                { label: "Exponent", value: "x^{2}" },
                { label: "Subscript", value: "x_{i}" },
                { label: "Sum", value: "\\sum_{i=1}^{n} x_i" },
                { label: "Integral", value: "\\int_0^\\infty f(x) dx" },
                { label: "Greek", value: "\\alpha, \\beta, \\gamma" },
              ].map((example) => (
                <button
                  key={example.value}
                  type="button"
                  onClick={() => setEquation(example.value)}
                  className="bg-muted hover:bg-muted/80 rounded px-2 py-1 text-xs"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleInsert} disabled={!equation || !!error}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function EquationToolbarButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      className="h-8 w-8 p-0"
      aria-label="Insert equation"
      title="Insert equation"
    >
      <Sigma className="h-4 w-4" />
    </Button>
  );
}
