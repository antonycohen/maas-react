import { zodResolver } from '@hookform/resolvers/zod';
import {
  Article,
  CreateArticle,
  createArticleSchema,
  UpdateArticle,
  updateArticleSchema,
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
import { FolderWithArticles } from './folder-section';

// Form schema for creating/editing articles
const articleFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(5000).nullable().optional(),
  type: z.string().max(50).nullable().optional(),
  folder: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

type ArticleFormData = z.infer<typeof articleFormSchema>;

const { ControlledTextInput, ControlledTextAreaInput, ControlledSelectInput, ControlledCMSInput } =
  createConnectedInputHelpers<ArticleFormData>();

type ArticleSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  article?: Article | null;
  folders: FolderWithArticles[];
  issueId: string;
  currentFolderId?: string | null;
  onSave: (data: CreateArticle | UpdateArticle, articleId?: string) => void;
  onDelete?: (articleId: string) => void;
};

const NO_FOLDER_VALUE = '__none__';

const articleTypes = [
  { value: 'feature', label: 'Feature' },
  { value: 'news', label: 'News' },
  { value: 'interview', label: 'Interview' },
  { value: 'opinion', label: 'Opinion' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'review', label: 'Review' },
  { value: 'column', label: 'Column' },
  { value: 'tips', label: 'Tips' },
];

export function ArticleSheet({
  open,
  onOpenChange,
  article,
  folders,
  issueId,
  currentFolderId,
  onSave,
  onDelete,
}: ArticleSheetProps) {
  const isEditMode = !!article;

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'feature',
      folder: NO_FOLDER_VALUE,
      isPublished: false,
      isFeatured: false,
    },
  });


  const { handleSubmit, reset, watch, setValue } = form;
  const selectedType = watch('type');
  const isPublished = watch('isPublished');
  const isFeatured = watch('isFeatured');

  useEffect(() => {
    if (open) {
      if (article) {
        reset({
          title: article.title,
          description: article.description ?? '',
          type: article.type || 'feature',
          folder: article.folder?.id || currentFolderId || NO_FOLDER_VALUE,
          isPublished: article.isPublished ?? false,
          isFeatured: article.isFeatured ?? false,
        });
      } else {
        reset({
          title: '',
          description: '',
          type: 'feature',
          folder: currentFolderId || NO_FOLDER_VALUE,
          isPublished: false,
          isFeatured: false,
        });
      }
    }
  }, [article, currentFolderId, open, reset]);

  function onSubmit(data: ArticleFormData) {
    const folderValue = data.folder === NO_FOLDER_VALUE ? null : data.folder;

    if (isEditMode && article) {
      // Update mode
      const updateData: UpdateArticle = updateArticleSchema.parse({
        title: data.title,
        description: data.description,
        type: data.type,
        folder: folderValue,
        isPublished: data.isPublished,
        isFeatured: data.isFeatured,
      });
      onSave(updateData, article.id);
    } else {
      // Create mode
      const createData: CreateArticle = createArticleSchema.parse({
        issue: issueId,
        title: data.title,
        description: data.description,
        type: data.type,
        folder: folderValue,
        isFeatured: data.isFeatured,
      });
      onSave(createData);
    }
    onOpenChange(false);
  }

  function handleDelete() {
    if (article && onDelete) {
      if (window.confirm('Are you sure you want to delete this article?')) {
        onDelete(article.id);
        onOpenChange(false);
      }
    }
  }

  const folderOptions = [
    { value: NO_FOLDER_VALUE, label: 'No folder (standalone)' },
    ...folders.map((folder) => ({
      value: folder.id,
      label: folder.name,
    })),
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>{isEditMode ? 'Edit Article' : 'New Article'}</SheetTitle>
              <SheetDescription>
                {isEditMode
                  ? 'Update article details and settings.'
                  : 'Create a new article for this issue.'}
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 px-4">
              <FieldGroup className="py-4">
                <ControlledTextInput
                  name="title"
                  label="Title"
                  placeholder="Enter article title..."
                />
                <ControlledTextAreaInput
                  name="description"
                  label="Description"
                  placeholder="Brief description of the article..."
                  rows={3}
                />
                <Field>
                  <FieldDescription>Type</FieldDescription>
                  <div className="flex gap-2 flex-wrap">
                    {articleTypes.map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${
                          selectedType === t.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-input'
                        }`}
                        onClick={() => setValue('type', t.value)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </Field>
                <ControlledSelectInput
                  name="folder"
                  label="Folder"
                  options={folderOptions}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Field orientation="horizontal">
                    <Checkbox
                      id="article-published"
                      checked={isPublished}
                      onCheckedChange={(checked) => setValue('isPublished', checked as boolean)}
                    />
                    <FieldDescription>Published</FieldDescription>
                  </Field>
                  <Field orientation="horizontal">
                    <Checkbox
                      id="article-featured"
                      checked={isFeatured}
                      onCheckedChange={(checked) => setValue('isFeatured', checked as boolean)}
                    />
                    <FieldDescription>Featured</FieldDescription>
                  </Field>
                </div>
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
