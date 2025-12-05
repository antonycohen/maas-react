import { zodResolver } from '@hookform/resolvers/zod';
import {
  CreateFolder,
  createFolderSchema,
  Folder,
  UpdateFolder,
  updateFolderSchema,
} from '@maas/core-api-models';
import {
  Button,
  Checkbox,
  Field,
  FieldDescription,
  FieldGroup,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';

// Form schema that works for both create and update modes
const folderFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  description: z.string().max(2000).nullable().optional(),
  color: z
    .string()
    .max(7)
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color code')
    .nullable()
    .optional(),
  isPublished: z.boolean().optional(),
});

type FolderFormData = z.infer<typeof folderFormSchema>;

const { ControlledTextInput, ControlledTextAreaInput } =
  createConnectedInputHelpers<FolderFormData>();

type FolderSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folder?: Folder | null;
  issueId: string;
  onSave: (data: CreateFolder | UpdateFolder, folderId?: string) => void;
  onDelete?: (folderId: string) => void;
};

const colorPresets = [
  '#3B82F6', // blue
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#84CC16', // lime
];

export function FolderSheet({
  open,
  onOpenChange,
  folder,
  issueId,
  onSave,
  onDelete,
}: FolderSheetProps) {
  const isEditMode = !!folder;

  const form = useForm<FolderFormData>({
    resolver: zodResolver(folderFormSchema),
    defaultValues: {
      name: '',
      description: null,
      color: colorPresets[0],
      isPublished: false,
    },
  });

  const { handleSubmit, reset, watch, setValue } = form;
  const selectedColor = watch('color');
  const isPublished = watch('isPublished');

  useEffect(() => {
    if (open) {
      if (folder) {
        reset({
          name: folder.name,
          description: folder.description,
          color: folder.color || colorPresets[0],
          isPublished: folder.isPublished ?? false,
        });
      } else {
        reset({
          name: '',
          description: null,
          color: colorPresets[0],
          isPublished: false,
        });
      }
    }
  }, [folder, open, reset]);

  function onSubmit(data: FolderFormData) {
    if (isEditMode && folder) {
      // Update mode - parse with updateFolderSchema
      const updateData: UpdateFolder = updateFolderSchema.parse({
        name: data.name,
        description: data.description,
        color: data.color,
        isPublished: data.isPublished,
      });
      onSave(updateData, folder.id);
    } else {
      // Create mode - parse with createFolderSchema
      const createData: CreateFolder = createFolderSchema.parse({
        issue: issueId,
        name: data.name,
        description: data.description,
        color: data.color,
      });
      onSave(createData);
    }
    onOpenChange(false);
  }

  function handleDelete() {
    if (folder && onDelete) {
      if (window.confirm('Are you sure you want to delete this folder and all its articles?')) {
        onDelete(folder.id);
        onOpenChange(false);
      }
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>{isEditMode ? 'Edit Folder' : 'New Folder'}</SheetTitle>
              <SheetDescription>
                {isEditMode
                  ? 'Update folder details and settings.'
                  : 'Create a new folder to organize articles.'}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 px-4">
              <FieldGroup className="py-4">
                <ControlledTextInput
                  name="name"
                  label="Name"
                  placeholder="e.g., Cover Stories"
                />
                <ControlledTextAreaInput
                  name="description"
                  label="Description"
                  placeholder="Optional description..."
                  rows={3}
                />
                <Field>
                  <FieldDescription>Color</FieldDescription>
                  <div className="flex gap-2 flex-wrap">
                    {colorPresets.map((presetColor) => (
                      <button
                        key={presetColor}
                        type="button"
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === presetColor
                            ? 'border-foreground scale-110'
                            : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: presetColor }}
                        onClick={() => setValue('color', presetColor)}
                      />
                    ))}
                  </div>
                </Field>
                {isEditMode && (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="folder-published"
                      checked={isPublished}
                      onCheckedChange={(checked) => setValue('isPublished', checked as boolean)}
                    />
                    <FieldDescription>Published</FieldDescription>
                  </Field>
                )}
              </FieldGroup>
            </ScrollArea>
            <SheetFooter>
              {isEditMode && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  className="mr-auto"
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{isEditMode ? 'Save' : 'Create'}</Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
