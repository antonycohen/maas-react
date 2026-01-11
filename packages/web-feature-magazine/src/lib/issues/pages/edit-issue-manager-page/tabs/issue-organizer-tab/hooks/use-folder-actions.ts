import { useCallback, useState } from 'react';
import { getFolderById, useCreateFolder } from '@maas/core-api';
import { CreateFolder, Folder, ReadFolderRef } from '@maas/core-api-models';
import { UseFormReturn } from 'react-hook-form';
import { IssueFormValues } from '../../../hooks';
import { useGetCurrentWorkspaceId } from '@maas/core-workspace';

type UseFolderActionsParams = {
  issueId: string;
  form: UseFormReturn<IssueFormValues>;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedArticleId: (id: string | null) => void;
  setFolderCache: React.Dispatch<React.SetStateAction<Map<string, Folder>>>;
  onFolderCreated?: () => void;
};

export const useFolderActions = ({
  issueId,
  form,
  selectedFolderId,
  setSelectedFolderId,
  setSelectedArticleId,
  setFolderCache,
  onFolderCreated,
}: UseFolderActionsParams) => {
  const [isLinkingFolder, setIsLinkingFolder] = useState(false);
  const organizationId = useGetCurrentWorkspaceId();

  // Folder mutations
  const createFolderMutation = useCreateFolder({
    onSuccess: (newFolder) => {
      // Add to cache
      setFolderCache((prev) => new Map(prev).set(newFolder.id, newFolder));

      // Add new folder to form
      const currentFolders = form.getValues('folders') ?? [];
      form.setValue(
        'folders',
        [...currentFolders, { id: newFolder.id, articles: [] }],
        { shouldDirty: true },
      );

      setSelectedFolderId(newFolder.id);
      onFolderCreated?.();
    },
  });

  const selectFolder = useCallback(
    (folderId: string | null) => {
      setSelectedFolderId(folderId);
      setSelectedArticleId(null);
    },
    [setSelectedFolderId, setSelectedArticleId],
  );

  // Handle linking an existing folder to the issue
  const handleLinkExistingFolder = useCallback(
    async (folder: ReadFolderRef) => {
      const currentFolders = form.getValues('folders') ?? [];

      // Avoid duplicates
      if (currentFolders.some((f) => f.id === folder.id)) {
        return;
      }

      setIsLinkingFolder(true);

      try {
        // Fetch folder with articles
        const fullFolder = await getFolderById({
          id: folder.id,
          fields: {
            id: null,
            name: null,
            description: null,
            cover: null,
            isPublished: null,
            articles: {
              fields: {
                id: null,
              },
              limit: 100,
            },
          },
        });

        // Add folder to cache
        setFolderCache((prev) => new Map(prev).set(fullFolder.id, fullFolder));

        const articleRefs = (fullFolder.articles ?? []).map((a) => ({
          id: a.id,
        }));

        form.setValue(
          'folders',
          [...currentFolders, { id: fullFolder.id, articles: articleRefs }],
          { shouldDirty: true },
        );

        setSelectedFolderId(fullFolder.id);
      } catch (error) {
        console.error('Failed to fetch folder:', error);
        // Fallback to basic info
        setFolderCache((prev) =>
          new Map(prev).set(folder.id, {
            id: folder.id,
            name: folder.name ?? '',
            description: null,
            cover: null,
            isPublished: null,
            metadata: null,
            articleCount: null,
            articles: null,
            type: null,
            isDefault: null,
          } as Folder),
        );

        form.setValue(
          'folders',
          [...currentFolders, { id: folder.id, articles: [] }],
          { shouldDirty: true },
        );

        setSelectedFolderId(folder.id);
      } finally {
        setIsLinkingFolder(false);
      }
    },
    [form, setFolderCache, setSelectedFolderId],
  );

  // Handle creating a new folder
  const handleCreateFolder = useCallback(
    (data: CreateFolder) => {
      createFolderMutation.mutate({
        ...data,
        organization: { id: organizationId },
        issue: { id: issueId },
      } as CreateFolder);
    },
    [createFolderMutation, issueId, organizationId],
  );

  const handleRemoveFolderFromIssue = useCallback(
    (folderId: string) => {
      if (
        !window.confirm(
          'Are you sure you want to remove this folder from the issue?',
        )
      ) {
        return;
      }

      const currentFolders = form.getValues('folders') ?? [];
      form.setValue(
        'folders',
        currentFolders.filter((f) => f.id !== folderId),
        { shouldDirty: true },
      );

      // Remove from cache
      setFolderCache((prev) => {
        const next = new Map(prev);
        next.delete(folderId);
        return next;
      });

      if (selectedFolderId === folderId) {
        setSelectedFolderId(null);
      }
    },
    [form, setFolderCache, selectedFolderId, setSelectedFolderId],
  );

  // Handle folder reorder
  const handleReorderFolders = useCallback(
    (reorderedFolders: Folder[]) => {
      const currentFolders = form.getValues('folders') ?? [];

      // Create new folder refs with preserved article arrays
      const newFolderRefs = reorderedFolders.map((folder) => {
        const existing = currentFolders.find((f) => f.id === folder.id);
        return {
          id: folder.id,
          articles: existing?.articles ?? [],
        };
      });

      form.setValue('folders', newFolderRefs, { shouldDirty: true });
    },
    [form],
  );

  return {
    selectFolder,
    handleLinkExistingFolder,
    handleCreateFolder,
    handleRemoveFolderFromIssue,
    handleReorderFolders,
    isCreatingFolder: createFolderMutation.isPending,
    isLinkingFolder,
  };
};
