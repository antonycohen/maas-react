import { Folder } from '@maas/core-api-models';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type EditIssueContextValue = {
  // Issue ID
  issueId: string;
  isCreateMode: boolean;

  // Selection state
  selectedFolderId: string | null;
  selectedArticleId: string | null;
  setSelectedFolderId: (id: string | null) => void;
  setSelectedArticleId: (id: string | null) => void;

  // Sheet state
  folderSheetOpen: boolean;
  articleSheetOpen: boolean;
  editingFolder: Folder | null;
  setFolderSheetOpen: (open: boolean) => void;
  setArticleSheetOpen: (open: boolean) => void;
  setEditingFolder: (folder: Folder | null) => void;

  // Actions
  openAddFolder: () => void;
  openEditFolder: (folder: Folder) => void;
  openAddArticle: () => void;
  selectFolder: (folderId: string | null) => void;
  selectArticle: (articleId: string | null) => void;
};

const EditIssueContext = createContext<EditIssueContextValue | null>(null);

type EditIssueProviderProps = {
  issueId: string;
  children: ReactNode;
};

export function EditIssueProvider({ issueId, children }: EditIssueProviderProps) {
  const isCreateMode = issueId === 'new';

  // Selection state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Sheet state
  const [folderSheetOpen, setFolderSheetOpen] = useState(false);
  const [articleSheetOpen, setArticleSheetOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);

  // Actions
  const openAddFolder = () => {
    setEditingFolder(null);
    setFolderSheetOpen(true);
  };

  const openEditFolder = (folder: Folder) => {
    setEditingFolder(folder);
    setFolderSheetOpen(true);
  };

  const openAddArticle = () => {
    setArticleSheetOpen(true);
  };

  const selectFolder = (folderId: string | null) => {
    setSelectedFolderId(folderId);
    setSelectedArticleId(null);
  };

  const selectArticle = (articleId: string | null) => {
    setSelectedArticleId(articleId);
  };

  const value = useMemo(
    () => ({
      issueId,
      isCreateMode,
      selectedFolderId,
      selectedArticleId,
      setSelectedFolderId,
      setSelectedArticleId,
      folderSheetOpen,
      articleSheetOpen,
      editingFolder,
      setFolderSheetOpen,
      setArticleSheetOpen,
      setEditingFolder,
      openAddFolder,
      openEditFolder,
      openAddArticle,
      selectFolder,
      selectArticle,
    }),
    [
      issueId,
      isCreateMode,
      selectedFolderId,
      selectedArticleId,
      folderSheetOpen,
      articleSheetOpen,
      editingFolder,
    ],
  );

  return (
    <EditIssueContext.Provider value={value}>
      {children}
    </EditIssueContext.Provider>
  );
}

export function useEditIssueContext() {
  const context = useContext(EditIssueContext);
  if (!context) {
    throw new Error('useEditIssueContext must be used within EditIssueProvider');
  }
  return context;
}
