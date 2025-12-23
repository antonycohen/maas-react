import { Article, UpdateArticle } from '@maas/core-api-models';
import { Button, FieldGroup, ScrollArea, Skeleton } from '@maas/web-components';
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
import { ArticleFormData, useEditArticleForm } from '../hooks';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditorPlugin = EditorPlugin<any, any, unknown>;

const {
  ControlledTextInput,
  ControlledTextAreaInput,
  ControlledCMSInput,
  ControlledCheckbox,
  ControlledImageInput,
  ControlledDateInput,
  ControlledMagazineFolderInput,
} = createConnectedInputHelpers<Article>();

type ArticleEditorPanelProps = {
  article: Article | null;
  issueId: string;
  onSave: (data: UpdateArticle, articleId: string) => void;
  plugins?: AnyEditorPlugin[];
  isLoading?: boolean;
};

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
  issueId,
  onSave,
  isLoading,
}: ArticleEditorPanelProps) {
  const { form } = useEditArticleForm({ article, issueId });

  const {
    handleSubmit,
    formState: { isDirty },
  } = form;

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

  function onSubmit(data: ArticleFormData) {
    if (article) {
      onSave(data as UpdateArticle, article.id);
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex h-full min-h-0 flex-col"
      >
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="text-sm font-semibold">Edit Article</span>
          <Button type="submit" size="sm" disabled={!isDirty}>
            Save
          </Button>
        </div>
        <ScrollArea className="flex-1 min-h-0">
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
              />

              <ControlledMagazineFolderInput
                name="folder"
                label="Folder"
                issueId={issueId}
                placeholder="Select folder..."
              />

              <ControlledTextInput
                name="keywords"
                label="Keywords"
                placeholder="Enter keywords..."
              />

              <div className="grid grid-cols-2 gap-4">
                <ControlledImageInput
                  name="featuredImage"
                  label="Featured Image"
                />
                <ControlledImageInput name="cover" label="Cover" />
              </div>

              <ControlledDateInput name="publishedAt" label="Published At" />

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
