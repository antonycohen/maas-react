import { Badge, Button, TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router-dom';
import { useGetIssueById } from '@maas/core-api';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useState } from 'react';
import { Folder, Issue } from '@maas/core-api-models';
import { UseFormReturn } from 'react-hook-form';
import { useEditIssueForm, useEditIssueActions, IssueFormValues } from './hooks';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';
import { FormProvider } from 'react-hook-form';

const getTabItems = (baseUrl: string, issueId: string) => {
  if (issueId === 'new') {
    return [{ title: 'Info', url: `${baseUrl}/issues/new/info` }];
  }

  return [
    { title: 'Info', url: `${baseUrl}/issues/${issueId}/info` },
    { title: 'Organizer', url: `${baseUrl}/issues/${issueId}/organizer` },
  ];
};

export type EditIssueOutletContext = {
  issueId: string;
  isCreateMode: boolean;
  issue: Issue | undefined;
  isLoading: boolean;
  refetchIssue: () => void;
  // Form
  form: UseFormReturn<IssueFormValues>;
  // Selection state
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  // Folder cache for display (folders from API + newly created folders)
  folderCache: Map<string, Folder>;
  setFolderCache: React.Dispatch<React.SetStateAction<Map<string, Folder>>>;
};

export function EditIssueManagerPage() {
  const { issueId = '' } = useParams<{ issueId: string }>();
  const isCreateMode = issueId === 'new';
  const workspaceUrl = useCurrentWorkspaceUrlPrefix();

  // Selection state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  // Folder cache for display
  const [folderCache, setFolderCache] = useState<Map<string, Folder>>(new Map());

  // Data fetching - include folders with articles
  const { data: issue, isLoading, refetch: refetchIssue } = useGetIssueById(
    {
      id: issueId,
      fields: {
        id: null,
        title: null,
        description: null,
        issueNumber: null,
        cover: null,
        publishedAt: null,
        isPublished: null,
        pdf: null,
        pageCount: null,
        brand: {
          fields: {
            id: null,
            name: null,
            issueConfiguration: null,
          },
        },
        folders: {
          fields: {
            id: null,
            name: null,
            description: null,
            cover: null,
            isPublished: null,
            metadata: null,
            articles: {
              fields: {
                id: null,
                title: null,
                description: null,
                type: null,
                isPublished: null,
                featuredImage: null,
              },
            },
          },
        },
      },
    },
    {
      enabled: !isCreateMode,
    },
  );
  // Form
  const { form } = useEditIssueForm({
    issue,
    isCreateMode,
  });
  // Actions
  const { onSubmit, handleDelete, isSaving, deleteMutation } = useEditIssueActions(
    form,
    isCreateMode,
    issueId,
  );

  const isPublished = form.watch('isPublished');
  const pageTitle = isCreateMode ? 'New Issue' : (issue?.title ?? '');

  if (!isCreateMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isCreateMode && !isLoading && !issue) {
    return (
      <div className="flex h-screen items-center justify-center">
        Issue not found
      </div>
    );
  }

  const breadcrumbLabel = isCreateMode ? 'New' : (issue?.title ?? '');

  const outletContext: EditIssueOutletContext = {
    issueId,
    isCreateMode,
    issue,
    isLoading,
    refetchIssue,
    form,
    selectedFolderId,
    setSelectedFolderId,
    selectedArticleId,
    setSelectedArticleId,
    folderCache,
    setFolderCache,
  };

  return (
    <FormProvider {...form}>
      <form
        id="issue-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-[calc(100vh-4rem)] flex-col"
      >
        <header className="shrink-0">
          <LayoutBreadcrumb
            items={[
              { label: 'Home', to: `${workspaceUrl}/` },
              { label: 'Issues', to: `${workspaceUrl}/issues` },
              { label: breadcrumbLabel },
            ]}
          />
          <TabNavLinks items={getTabItems(workspaceUrl, issueId)} />
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

        <Outlet context={outletContext} />
      </form>
    </FormProvider>
  );
}
