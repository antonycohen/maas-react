import { useCallback } from 'react';
import { Article, ReadArticleRef } from '@maas/core-api-models';
import { UseFormReturn } from 'react-hook-form';
import { IssueFormValues } from '../../../hooks';

type UseArticleActionsParams = {
  form: UseFormReturn<IssueFormValues>;
  selectedFolderId: string | null;
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string | null) => void;
};

export const useArticleActions = ({
  form,
  selectedFolderId,
  selectedArticleId,
  setSelectedArticleId,
}: UseArticleActionsParams) => {
  // Handle article link (from search)
  const handleLinkExistingArticle = useCallback(
    (article: ReadArticleRef) => {
      if (!selectedFolderId) return;

      const currentFolders = form.getValues('folders') ?? [];
      const folderIndex = currentFolders.findIndex(
        (f) => f.id === selectedFolderId,
      );

      if (folderIndex === -1) return;

      const folder = currentFolders[folderIndex];
      const existingArticles = folder.articles ?? [];

      // Avoid duplicates
      if (existingArticles.some((a) => a.id === article.id)) {
        return;
      }

      // Update folder's articles
      const updatedFolders = [...currentFolders];
      updatedFolders[folderIndex] = {
        ...folder,
        articles: [...existingArticles, { id: article.id }],
      };

      form.setValue('folders', updatedFolders, { shouldDirty: true });
      setSelectedArticleId(article.id);
    },
    [form, selectedFolderId, setSelectedArticleId],
  );

  // Handle article delete (remove from folder)
  const handleDeleteArticle = useCallback(
    (articleId: string) => {
      if (!selectedFolderId) return;
      if (!window.confirm('Remove this article from the folder?')) return;

      const currentFolders = form.getValues('folders') ?? [];
      const folderIndex = currentFolders.findIndex(
        (f) => f.id === selectedFolderId,
      );

      if (folderIndex === -1) return;

      const folder = currentFolders[folderIndex];
      const updatedFolders = [...currentFolders];
      updatedFolders[folderIndex] = {
        ...folder,
        articles: (folder.articles ?? []).filter((a) => a.id !== articleId),
      };

      form.setValue('folders', updatedFolders, { shouldDirty: true });

      if (selectedArticleId === articleId) {
        setSelectedArticleId(null);
      }
    },
    [form, selectedFolderId, selectedArticleId, setSelectedArticleId],
  );

  // Handle article reorder
  const handleReorderArticles = useCallback(
    (reorderedArticles: Article[]) => {
      if (!selectedFolderId) return;

      const currentFolders = form.getValues('folders') ?? [];
      const folderIndex = currentFolders.findIndex(
        (f) => f.id === selectedFolderId,
      );

      if (folderIndex === -1) return;

      const updatedFolders = [...currentFolders];
      updatedFolders[folderIndex] = {
        ...currentFolders[folderIndex],
        articles: reorderedArticles.map((a) => ({ id: a.id })),
      };

      form.setValue('folders', updatedFolders, { shouldDirty: true });
    },
    [form, selectedFolderId],
  );

  return {
    handleLinkExistingArticle,
    handleDeleteArticle,
    handleReorderArticles,
  };
};
