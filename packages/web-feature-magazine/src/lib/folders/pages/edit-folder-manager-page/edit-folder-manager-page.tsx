import { Badge, Button, TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router-dom';
import { useGetFolderById } from '@maas/core-api';
import {
  useCurrentWorkspaceUrlPrefix,
  useGetCurrentWorkspaceId,
} from '@maas/core-workspace';
import { useState } from 'react';
import { Folder } from '@maas/core-api-models';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import {
  FolderFormValues,
  useEditFolderActions,
  useEditFolderForm,
} from './hooks';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';

const getTabItems = (baseUrl: string, folderId: string) => {
  return [
    { title: 'Info', url: `${baseUrl}/folders/${folderId}/info` },
    { title: 'Articles', url: `${baseUrl}/folders/${folderId}/articles` },
  ];
};

export type EditFolderOutletContext = {
  folderId: string;
  isCreateMode: boolean;
  folder: Folder | undefined;
  isLoading: boolean;
  refetchFolder: () => void;
  // Form
  form: UseFormReturn<FolderFormValues>;
  // Selection state
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
  // Modal state
  addArticleModalOpen: boolean;
  setAddArticleModalOpen: (open: boolean) => void;
};

export function EditFolderManagerPage() {
  const { folderId = '' } = useParams<{ folderId: string }>();
  const isCreateMode = folderId === 'new';
  const workspaceUrl = useCurrentWorkspaceUrlPrefix();
  const workspaceId = useGetCurrentWorkspaceId();

  // Selection state
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(
    null,
  );
  // Modal state
  const [addArticleModalOpen, setAddArticleModalOpen] = useState(false);

  // Data fetching - include articles
  const {
    data: folder,
    isLoading,
    refetch: refetchFolder,
  } = useGetFolderById(
    {
      id: folderId,
      fields: {
        id: null,
        name: null,
        description: null,
        cover: null,
        isPublished: null,
        issues: {
          fields: {
            id: null,
            title: null,
          },
        },
        articles: {
          fields: {
            id: null,
            title: null,
            description: null,
            type: null,
            isPublished: null,
          },
        },
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  // Form
  const { form } = useEditFolderForm({
    folder,
    isCreateMode,
    organizationId: workspaceId as string,
  });

  // Actions
  const { onSubmit, handleDelete, isSaving, deleteMutation } =
    useEditFolderActions(form, isCreateMode, folderId);

  const isPublished = form.watch('isPublished');
  const pageTitle = isCreateMode ? 'New Folder' : (folder?.name ?? '');

  if (!isCreateMode && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isCreateMode && !isLoading && !folder) {
    return (
      <div className="flex h-screen items-center justify-center">
        Folder not found
      </div>
    );
  }

  const breadcrumbLabel = isCreateMode ? 'New' : (folder?.name ?? '');

  const outletContext: EditFolderOutletContext = {
    folderId,
    isCreateMode,
    folder,
    isLoading,
    refetchFolder,
    form,
    selectedArticleId,
    setSelectedArticleId,
    addArticleModalOpen,
    setAddArticleModalOpen,
  };

  return (
    <FormProvider {...form}>
      <form
        id="folder-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-[calc(100vh-4rem)] flex-col"
      >
        <header className="shrink-0">
          <LayoutBreadcrumb
            items={[
              { label: 'Home', to: `${workspaceUrl}/` },
              { label: 'Folders', to: `${workspaceUrl}/folders` },
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
            <Button type="submit" size="sm" disabled={isSaving || isLoading}>
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
        <TabNavLinks items={getTabItems(workspaceUrl, folderId)} />

        <Outlet context={outletContext} />
      </form>
    </FormProvider>
  );
}
