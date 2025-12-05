import { zodResolver } from '@hookform/resolvers/zod';
import {
  Article,
  cmsBlockSchema,
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
} from '@maas/web-components';
import {
  AnalyzePlugin,
  AudioPlugin,
  CardEventPlugin,
  CardPressCoveragePlugin,
  CardsTextWithImagePlugin,
  EditorPlugin,
  HeadingPlugin,
  HighlightPlugin,
  IframePlugin,
  ImagesPlugin,
  ImageWithTextPlugin,
  MosaicGalleryPlugin,
  ParagraphPlugin,
  PodcastCarouselPlugin,
  QuotesPlugin,
  VideoPlugin,
} from '@maas/web-cms-editor';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconFileText } from '@tabler/icons-react';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import { FolderWithArticles } from './folder-section';

// Form schema for article editor
const articleEditorFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(5000).nullable().optional(),
  content: z.array(cmsBlockSchema).nullable().optional(),
  type: z.string().max(50).nullable().optional(),
  folder: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

type ArticleEditorFormData = z.infer<typeof articleEditorFormSchema>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditorPlugin = EditorPlugin<any, any, unknown>;

const {
  ControlledTextInput,
  ControlledTextAreaInput,
  ControlledSelectInput,
  ControlledCMSInput,
} = createConnectedInputHelpers<ArticleEditorFormData>();

const NO_FOLDER_VALUE = '__none__';

type ArticleEditorPanelProps = {
  article: Article | null;
  folders: FolderWithArticles[];
  currentFolderId: string | null;
  onSave: (data: UpdateArticle, articleId: string) => void;
  plugins?: AnyEditorPlugin[];
};

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

const plugins = [
  HeadingPlugin,
  ParagraphPlugin,
  QuotesPlugin,
  CardsTextWithImagePlugin,
  CardEventPlugin,
  CardPressCoveragePlugin,
  PodcastCarouselPlugin,
  VideoPlugin,
  MosaicGalleryPlugin,
  ImagesPlugin,
  ImageWithTextPlugin,
  IframePlugin,
  AudioPlugin,
  AnalyzePlugin,
  HighlightPlugin,
];

export function ArticleEditorPanel({
  article,
  folders,
  currentFolderId,
  onSave,
}: ArticleEditorPanelProps) {
  const form = useForm<ArticleEditorFormData>({
    resolver: zodResolver(articleEditorFormSchema),
    defaultValues: {
      title: '',
      description: '',
      content: null,
      type: 'feature',
      folder: NO_FOLDER_VALUE,
      isPublished: false,
      isFeatured: false,
    },
  });

  console.log(form.getValues());

  const {
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = form;
  const selectedType = watch('type');
  const isPublished = watch('isPublished');
  const isFeatured = watch('isFeatured');

  useEffect(() => {
    if (article) {
      reset({
        title: article.title,
        description: article.description ?? '',
        content: article.content ?? null,
        type: article.type || 'feature',
        folder: article.folder?.id || currentFolderId || NO_FOLDER_VALUE,
        isPublished: article.isPublished ?? false,
        isFeatured: article.isFeatured ?? false,
      });
    }
  }, [article, currentFolderId, reset]);

  function onSubmit(data: ArticleEditorFormData) {
    if (!article) return;
    const updateData: UpdateArticle = updateArticleSchema.parse({
      title: data.title,
      description: data.description ?? '',
      content: data.content,
      type: data.type,
      folder: data.folder || NO_FOLDER_VALUE,
      isPublished: data.isPublished,
      isFeatured: data.isFeatured,
    });
    onSave(updateData, article.id);
  }

  const folderOptions = [
    { value: '', label: 'No folder (standalone)' },
    ...folders.map((folder) => ({
      value: folder.id,
      label: folder.name,
    })),
  ];

  if (!article) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <IconFileText className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm">Select an article to edit</p>
      </div>
    );
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-sm font-semibold">Edit Article</span>
          <Button type="submit" size="sm" disabled={!isDirty}>
            Save
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4">
            <FieldGroup>
              <ControlledTextInput
                name="title"
                label="Title"
                placeholder="Enter article title..."
              />

              <ControlledTextAreaInput
                name="description"
                label="Description"
                placeholder="Brief description..."
                rows={2}
              />

              <Field>
                <FieldDescription>Type</FieldDescription>
                <div className="flex gap-2 flex-wrap">
                  {articleTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                        selectedType === t.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background hover:bg-muted border-input'
                      }`}
                      onClick={() =>
                        setValue('type', t.value, { shouldDirty: true })
                      }
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/*<ControlledSelectInput*/}
              {/*  name="folder"*/}
              {/*  label="Folder"*/}
              {/*  options={folderOptions}*/}
              {/*/>*/}

              {plugins.length > 0 && (
                <ControlledCMSInput
                  name="content"
                  label="Content"
                  plugins={plugins}
                  triggerLabel="Edit content"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <Field orientation="horizontal">
                  <Checkbox
                    id="article-published"
                    checked={isPublished}
                    onCheckedChange={(checked) =>
                      setValue('isPublished', checked as boolean, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <FieldDescription>Published</FieldDescription>
                </Field>
                <Field orientation="horizontal">
                  <Checkbox
                    id="article-featured"
                    checked={isFeatured}
                    onCheckedChange={(checked) =>
                      setValue('isFeatured', checked as boolean, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <FieldDescription>Featured</FieldDescription>
                </Field>
              </div>
            </FieldGroup>
          </div>
        </ScrollArea>
      </form>
    </FormProvider>
  );
}
