import { Article } from '@maas/core-api-models';
import { createContext, useContext, useState, ReactNode, useMemo } from 'react';

type EditFolderContextValue = {
  // Folder ID
  folderId: string;
  isCreateMode: boolean;

  // Selection state
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;

  // Modal state
  addArticleModalOpen: boolean;
  setAddArticleModalOpen: (open: boolean) => void;

  // Actions
  openAddArticle: () => void;
  selectArticle: (articleId: string | null) => void;
};

const EditFolderContext = createContext<EditFolderContextValue | null>(null);

type EditFolderProviderProps = {
  folderId: string;
  children: ReactNode;
};

export function EditFolderProvider({ folderId, children }: EditFolderProviderProps) {
  const isCreateMode = folderId === 'new';

  // Selection state
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Modal state
  const [addArticleModalOpen, setAddArticleModalOpen] = useState(false);

  // Actions
  const openAddArticle = () => {
    setAddArticleModalOpen(true);
  };

  const selectArticle = (articleId: string | null) => {
    setSelectedArticleId(articleId);
  };

  const value = useMemo(
    () => ({
      folderId,
      isCreateMode,
      selectedArticleId,
      setSelectedArticleId,
      addArticleModalOpen,
      setAddArticleModalOpen,
      openAddArticle,
      selectArticle,
    }),
    [
      folderId,
      isCreateMode,
      selectedArticleId,
      addArticleModalOpen,
    ],
  );

  return (
    <EditFolderContext.Provider value={value}>
      {children}
    </EditFolderContext.Provider>
  );
}

export function useEditFolderContext() {
  const context = useContext(EditFolderContext);
  if (!context) {
    throw new Error('useEditFolderContext must be used within EditFolderProvider');
  }
  return context;
}
