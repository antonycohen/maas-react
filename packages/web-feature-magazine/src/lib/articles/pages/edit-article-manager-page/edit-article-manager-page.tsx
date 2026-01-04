import { useParams } from 'react-router-dom';
import { LayoutBreadcrumb } from '@maas/web-layout';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  FieldGroup,
  Separator,
} from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Article } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import {
  IconChevronDown,
  IconDeviceFloppy,
  IconLoader2,
  IconPhoto,
  IconSettings,
  IconTag,
  IconTrash,
} from '@tabler/icons-react';
import { useEditArticleForm } from './hooks/use-edit-article-form';
import { useEditActions } from './hooks/use-edit-actions';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { DynamicCustomFields } from './components/dynamic-custom-fields';
import {
  AnalyzePlugin,
  AudioPlugin,
  CardEventPlugin,
  CardPressCoveragePlugin,
  CardsTextWithImagePlugin,
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
import { useState } from 'react';

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'draft', label: 'Draft' },
];

export const editorPlugins = [
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

type SidebarSectionProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function SidebarSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between py-3 text-sm font-medium hover:text-foreground text-muted-foreground transition-colors">
        <div className="flex items-center gap-2">
          {icon}
          {title}
        </div>
        <IconChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="pb-4">{children}</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function EditArticleManagerPage() {
  const { articleId = '' } = useParams<{ articleId: string }>();

  const { article, isLoading, form, isCreateMode } =
    useEditArticleForm(articleId);
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(
    form,
    isCreateMode,
    articleId
  );

  const {
    ControlledTextInput,
    ControlledTokenInput,
    ControlledTextAreaInput,
    ControlledImageInput,
    ControlledSelectInput,
    ControlledCMSInput,
    ControlledSwitchInput,
    ControlledCategoriesInput,
    ControlledArticleTypeInput,
  } = createConnectedInputHelpers<Article>();

  const pageTitle = isCreateMode ? 'New Article' : article?.title ?? '';
  const breadcrumbLabel = isCreateMode ? 'New' : article?.title ?? '';

  const isPublished = form.watch('isPublished');
  const visibility = form.watch('visibility');

  if (!isCreateMode && isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <header className="sticky top-0 z-10 border-b bg-background">
          <LayoutBreadcrumb
            items={[
              { label: 'Home', to: `${workspaceBaseUrl}` },
              { label: 'Articles', to: `${workspaceBaseUrl}/articles` },
              { label: 'Loading...' },
            ]}
          />
        </header>
        <div className="flex h-[50vh] items-center justify-center">
          <IconLoader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!isCreateMode && !article) {
    return (
      <div className="min-h-[calc(100vh-4rem)]">
        <header className="sticky top-0 z-10 border-b bg-background">
          <LayoutBreadcrumb
            items={[
              { label: 'Home', to: `${workspaceBaseUrl}` },
              { label: 'Articles', to: `${workspaceBaseUrl}/articles` },
              { label: 'Not Found' },
            ]}
          />
        </header>
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <p className="text-lg text-muted-foreground">Article not found</p>
          <Button
            variant="outline"
            onClick={() =>
              (window.location.href = `${workspaceBaseUrl}/articles`)
            }
          >
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Breadcrumb - scrolls with content */}
      <header className="shrink-0">
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: `${workspaceBaseUrl}` },
            { label: 'Articles', to: `${workspaceBaseUrl}/articles` },
            { label: breadcrumbLabel },
          ]}
        />
      </header>

      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background px-6 py-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold truncate max-w-md">
            {pageTitle || 'Untitled'}
          </h1>
          <div className="flex items-center gap-2">
            {isPublished ? (
              <Badge variant="default">Published</Badge>
            ) : (
              <Badge variant="secondary">Draft</Badge>
            )}
            {visibility && (
              <Badge variant="outline" className="capitalize">
                {visibility}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isCreateMode && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <IconTrash className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => form.reset()}
            disabled={isLoading || !form.formState.isDirty}
          >
            Discard
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSaving || isLoading}
            form="article-form"
          >
            {isSaving ? (
              <>
                <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                {isCreateMode ? 'Create' : 'Save'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <FormProvider {...form}>
        <form
          id="article-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 "
        >
          {/* Content Area */}
          <div className="flex-1 min-w-0">
            <div className="mx-auto max-w-4xl space-y-6 p-6">
              {/* Title & Description */}
              <Card>
                <CardContent className="pt-6">
                  <FieldGroup>
                    <ControlledTextInput
                      name="title"
                      label="Title"
                      placeholder="Enter article title..."
                    />
                    <ControlledTextAreaInput
                      name="description"
                      label="Description"
                      placeholder="Write a brief summary of the article..."
                    />
                  </FieldGroup>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <ControlledCMSInput
                    name="content"
                    label=""
                    plugins={editorPlugins}
                    author={article?.author?.firstName ?? 'Author'}
                    lastModifiedAt={article?.updatedAt}
                  />
                </CardContent>
              </Card>

              {/* Dynamic Custom Fields */}
              <DynamicCustomFields />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-80 shrink-0 border-l bg-muted/30 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto">
            <div className="p-4 space-y-1">
              {/* Publishing */}
              <SidebarSection
                title="Publishing"
                icon={<IconSettings className="h-4 w-4" />}
                defaultOpen={true}
              >
                <FieldGroup className="space-y-4">
                  <ControlledSwitchInput
                    name="isPublished"
                    label="Published"
                  />
                  <ControlledArticleTypeInput
                    name="type"
                    label="Article Type"
                  />
                  <ControlledSelectInput
                    name="visibility"
                    label="Visibility"
                    options={VISIBILITY_OPTIONS}
                    placeholder="Select visibility..."
                  />
                </FieldGroup>
              </SidebarSection>

              <Separator />

              {/* Media */}
              <SidebarSection
                title="Media"
                icon={<IconPhoto className="h-4 w-4" />}
                defaultOpen={true}
              >
                <FieldGroup className="space-y-4">
                  <ControlledImageInput
                    name="featuredImage"
                    label="Featured Image"
                  />
                  <ControlledImageInput name="cover" label="Cover Image" />
                </FieldGroup>
              </SidebarSection>

              <Separator />

              {/* Classification */}
              <SidebarSection
                title="Classification"
                icon={<IconTag className="h-4 w-4" />}
                defaultOpen={true}
              >
                <FieldGroup className="space-y-4">
                  <ControlledCategoriesInput
                    name="categories"
                    label="Categories"
                  />
                  <ControlledTokenInput name="keywords" label="Keywords" />
                </FieldGroup>
              </SidebarSection>
            </div>
          </aside>
        </form>
      </FormProvider>
    </div>
  );
}
