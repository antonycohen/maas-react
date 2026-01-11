import { useMemo } from 'react';
import { Folder } from '@maas/core-api-models';
import { UseFormReturn } from 'react-hook-form';
import { IssueFormValues } from '../../../hooks';

type UseFolderDisplayParams = {
  issue: { folders?: Folder[] | null } | null | undefined;
  form: UseFormReturn<IssueFormValues>;
  folderCache: Map<string, Folder>;
  selectedFolderId: string | null;
  setSelectedFolderId: (id: string | null) => void;
};

export const useFolderDisplay = ({
  issue,
  form,
  folderCache,
  selectedFolderId,
  setSelectedFolderId,
}: UseFolderDisplayParams) => {
  // Get folders from issue data (source of truth for display)
  const issueFolders = useMemo(() => issue?.folders ?? [], [issue?.folders]);

  // Get form folders (source of truth for order and article associations)
  const formFolders = form.watch('folders');
  const formFoldersArray = useMemo(() => formFolders ?? [], [formFolders]);

  // Merge folder display data with form order
  const displayFolders = useMemo(() => {
    const folderMap = new Map<string, Folder>();

    // Add folders from issue data
    issueFolders.forEach((f) => {
      folderMap.set(f.id, f);
    });

    // Add folders from cache (newly created ones)
    folderCache.forEach((f, id) => {
      folderMap.set(id, f);
    });

    // Return folders in form order
    return formFoldersArray
      .map((ref) => folderMap.get(ref.id))
      .filter((f): f is Folder => f !== undefined);
  }, [issueFolders, folderCache, formFoldersArray]);

  // Auto-select first folder when folders are loaded
  useMemo(() => {
    if (!selectedFolderId && displayFolders.length > 0) {
      setSelectedFolderId(displayFolders[0].id);
    }
  }, [displayFolders, selectedFolderId, setSelectedFolderId]);

  // Get current folder
  const currentFolder = useMemo(
    () => displayFolders.find((f) => f.id === selectedFolderId) ?? null,
    [displayFolders, selectedFolderId],
  );

  return {
    displayFolders,
    currentFolder,
    formFoldersArray,
  };
};
