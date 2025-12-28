import { useParams } from 'react-router-dom';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
} from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Article } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditArticleForm } from './hooks/use-edit-article-form';
import { useEditActions } from './hooks/use-edit-actions';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { DynamicCustomFields } from './components/dynamic-custom-fields';

const VISIBILITY_OPTIONS = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'draft', label: 'Draft' },
];

export function EditArticleManagerPage() {
  const { articleId = '' } = useParams<{ articleId: string }>();

  const { article, isLoading, form, isCreateMode } =
    useEditArticleForm(articleId);
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(
    form,
    isCreateMode,
    articleId,
  );

  if (!isCreateMode && !isLoading && !article) {
    return <div>Article not found</div>;
  }

  const {
    ControlledTextInput,
    ControlledTokenInput,
    ControlledTextAreaInput,
    ControlledImageInput,
    ControlledSelectInput,
    ControlledCheckbox,
    ControlledCategoriesInput,
    ControlledArticleTypeInput,
  } = createConnectedInputHelpers<Article>();

  const pageTitle = isCreateMode ? 'New Article' : (article?.title ?? '');
  const breadcrumbLabel = isCreateMode ? 'New' : (article?.title ?? '');

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: `${workspaceBaseUrl}` },
            { label: 'Articles', to: `${workspaceBaseUrl}/articles` },
            { label: breadcrumbLabel },
          ]}
        />
      </header>
      <LayoutContent>
        <LayoutHeader
          pageTitle={pageTitle}
          actions={
            !isCreateMode && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )
          }
        />
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              'space-y-6 transition-opacity',
              isLoading && 'pointer-events-none opacity-50',
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Article Details</CardTitle>
                  <CardDescription>
                    Basic information about the article.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ControlledTextInput name="title" label="Title" />
                    <ControlledTextAreaInput
                      name="description"
                      label="Description"
                    />
                    <ControlledTokenInput name="keywords" label="Keywords" />
                    <ControlledSelectInput
                      name="visibility"
                      label="Visibility"
                      options={VISIBILITY_OPTIONS}
                      placeholder="Select visibility..."
                    />
                  </FieldGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Media</CardTitle>
                  <CardDescription>
                    Images and documents for this article.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ControlledImageInput
                      name="featuredImage"
                      label="Featured Image"
                    />
                    <ControlledImageInput name="cover" label="Cover Image" />
                  </FieldGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Classification</CardTitle>
                  <CardDescription>
                    Categorize and organize the article.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ControlledArticleTypeInput
                      name="type"
                      label="Article Type"
                    />
                    <ControlledCategoriesInput
                      name="categories"
                      label="Categories"
                    />
                  </FieldGroup>
                </CardContent>
              </Card>

              <DynamicCustomFields />

              <Card>
                <CardHeader>
                  <CardTitle>Publishing</CardTitle>
                  <CardDescription>
                    Control when and how the article is published.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ControlledCheckbox name="isPublished" label="Published" />
                  </FieldGroup>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={isLoading}
              >
                Reset
              </Button>
              <Button type="submit" disabled={isSaving || isLoading}>
                {isSaving ? 'Saving...' : isCreateMode ? 'Create' : 'Save'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </LayoutContent>
    </div>
  );
}
