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
import { ArticleType } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import {
  createConnectedInputHelpers,
} from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditArticleTypeForm } from './hooks/use-edit-article-type-form';
import { useEditActions } from './hooks/use-edit-actions';
import { FieldsList } from './components';
import {
  useCurrentWorkspaceUrlPrefix,
  useGetCurrentWorkspaceId,
} from '@maas/core-workspace';

export function EditArticleTypeManagerPage() {
  const { articleTypeId = '' } = useParams<{ articleTypeId: string }>();
  const workspaceId = useGetCurrentWorkspaceId() as string;

  const { articleTypeData, isLoading, form, isCreateMode } =
    useEditArticleTypeForm(articleTypeId, workspaceId);
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(
    form,
    isCreateMode,
    articleTypeId,
  );

  if (!isCreateMode && !isLoading && !articleTypeData) {
    return <div>Article type not found</div>;
  }

  const { ControlledTextInput, ControlledCheckbox } =
    createConnectedInputHelpers<ArticleType>();

  const pageTitle = isCreateMode
    ? 'New Article Type'
    : (articleTypeData?.name ?? '');
  const breadcrumbLabel = isCreateMode ? 'New' : (articleTypeData?.name ?? '');

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: `${workspaceBaseUrl}` },
            { label: 'Article Types', to: `${workspaceBaseUrl}/article-types` },
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
                  <CardTitle>Article Type Details</CardTitle>
                  <CardDescription>
                    Define the article type name and key identifier.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ControlledTextInput name="name" label="Name" />
                    <ControlledCheckbox name="isActive" label="Active" />
                  </FieldGroup>
                  <FieldsList />
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
