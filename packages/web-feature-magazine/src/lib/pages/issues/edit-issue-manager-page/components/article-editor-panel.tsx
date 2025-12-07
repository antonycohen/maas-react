import { Article, Folder, UpdateArticle } from '@maas/core-api-models';
import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
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
import { FormProvider } from 'react-hook-form';
import { useEditArticleForm } from '../hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditorPlugin = EditorPlugin<any, any, unknown>;

const {
  ControlledTextInput,
  ControlledTextAreaInput,
  ControlledCMSInput,
  ControlledCheckbox,
} = createConnectedInputHelpers<UpdateArticle>();

type ArticleEditorPanelProps = {
  article: Article | null;
  folders: Folder[];
  onSave: (data: UpdateArticle, articleId: string) => void;
  plugins?: AnyEditorPlugin[];
  isLoading?: boolean;
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
  onSave,
  isLoading,
}: ArticleEditorPanelProps) {
  const { form } = useEditArticleForm(article);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = form;
  const selectedType = watch('type');

  function onSubmit(data: UpdateArticle) {
    if (!article) return;
    onSave(data, article.id);
  }

  const folderOptions = folders.map((folder) => ({
    value: folder.id,
    label: folder.name,
  }));

  if (!article && !isLoading) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
        <IconFileText className="h-12 w-12 mb-4 opacity-50" />
        <p className="text-sm">Select an article to edit</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="p-4 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
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

              <Field>
                <FieldLabel>Folder</FieldLabel>
                <Select
                  value={watch('folder')?.id ?? ''}
                  onValueChange={(value) =>
                    setValue('folder', value ? { id: value } : null, {
                      shouldDirty: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select folder..." />
                  </SelectTrigger>
                  <SelectContent>
                    {folderOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              {plugins.length > 0 && (
                <ControlledCMSInput
                  name="content"
                  label="Content"
                  plugins={plugins}
                  triggerLabel="Edit content"
                />
              )}

              <div className="grid grid-cols-2 gap-4">
                <ControlledCheckbox name="isPublished" label="Published" />
                <ControlledCheckbox name="isFeatured" label="Featured" />
              </div>
            </FieldGroup>
          </div>
        </ScrollArea>
      </form>
    </FormProvider>
  );
}
