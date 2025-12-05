import React, { useRef } from 'react';
import {
  ArrowLeft,
  Pencil,
  Monitor,
  Smartphone,
  Plus,
  Download,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@maas/core-utils';
import {
  Alert,
  AlertTitle,
  Button,
  buttonVariants,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@maas/web-components';

import { useEditorContext } from '../store/editor-context';
import { EditorPreviewMode } from '../types';

type EditorActionsBarProps = {
  onSave?: () => void;
};

export const EditorActionsBar = ({ onSave }: EditorActionsBarProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { content, setContent, settings, setSettings, resetEditor } =
    useEditorContext();

  const setEditMode = (value: boolean) => {
    setSettings((prev) => ({ ...prev, editMode: value, previewMode: false }));
  };

  const setPreviewMode = (value: EditorPreviewMode) => {
    setSettings((prev) => ({ ...prev, previewMode: value, editMode: false }));
  };

  const closeEditor = () =>
    setSettings((prev) => ({ ...prev, visible: false }));

  const saveEditorContent = () => {
    onSave?.();
    closeEditor();
  };

  const exportEditorContent = () => {
    const blob = new Blob([JSON.stringify(content)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'editor-content.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importEditorContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const newContent = new FileReader();

    newContent.onload = (e) => {
      try {
        const content = JSON.parse(e.target?.result as string);
        if (!Array.isArray(content)) throw new Error();
        setContent(content);
      } catch {
        toast(
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Le fichier n'est pas valide</AlertTitle>
          </Alert>
        );
      } finally {
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    };
    newContent.readAsText(file);
  };

  const uniqueId = React.useId();

  return (
    <header className="editor-navigation h-[104px] border-b border-neutral-300 bg-white px-6 py-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={resetEditor}>
          <ArrowLeft className="h-4 w-4" />
          Annuler
        </Button>

        <div className="flex items-center gap-x-12">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditMode(true)}
            className={cn({ 'bg-primary/10 text-primary': settings.editMode })}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewMode('desktop')}
              className={cn({
                'bg-primary/10 text-primary': settings.previewMode === 'desktop',
              })}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setPreviewMode('mobile')}
              className={cn({
                'bg-primary/10 text-primary': settings.previewMode === 'mobile',
              })}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <label
                htmlFor={uniqueId}
                className={cn(
                  'flex cursor-pointer items-center justify-center',
                  buttonVariants({ variant: 'ghost', size: 'icon' })
                )}
              >
                <Plus className="h-4 w-4" />
              </label>
            </TooltipTrigger>
            <TooltipContent>Importer du contenu</TooltipContent>
            <input
              ref={inputRef}
              type="file"
              accept=".json"
              hidden
              id={uniqueId}
              onChange={importEditorContent}
            />
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={exportEditorContent}>
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Exporter le contenu</TooltipContent>
          </Tooltip>

          <Button onClick={saveEditorContent} className="ml-6">
            Sauvegarder
          </Button>
        </div>
      </div>
    </header>
  );
};
