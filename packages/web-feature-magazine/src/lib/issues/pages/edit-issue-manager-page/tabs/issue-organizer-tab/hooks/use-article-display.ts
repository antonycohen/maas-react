import { useMemo } from 'react';
import { useGetArticles } from '@maas/core-api';
import { Article } from '@maas/core-api-models';
import { UseFormReturn } from 'react-hook-form';
import { IssueFormValues } from '../../../hooks';

type ArticleRef = { id: string };

type UseArticleDisplayParams = {
  form: UseFormReturn<IssueFormValues>;
  selectedFolderId: string | null;
};

export const useArticleDisplay = ({
  form,
  selectedFolderId,
}: UseArticleDisplayParams) => {
  const formFolders = form.watch('folders');
  const formFoldersArray = useMemo(() => formFolders ?? [], [formFolders]);

  // Get article IDs for current folder from form data
  const currentFolderRef = useMemo(
    () => formFoldersArray.find((f) => f.id === selectedFolderId),
    [formFoldersArray, selectedFolderId],
  );

  const articleRefs = useMemo<ArticleRef[]>(
    () => currentFolderRef?.articles ?? [],
    [currentFolderRef],
  );

  const articleIdList = useMemo(
    () => articleRefs.map((a) => a.id),
    [articleRefs],
  );

  // Fetch articles by IDs for display
  const { data: articlesResponse, isLoading: isLoadingArticles } =
    useGetArticles(
      {
        filters: { id: articleIdList },
        fields: {
          id: null,
          title: null,
          description: null,
          type: null,
          isPublished: null,
          featuredImage: null,
        },
        offset: 0,
        limit: articleIdList.length || 1,
      },
      {
        enabled: articleIdList.length > 0,
      },
    );

  const articlesData = useMemo(
    () => articlesResponse?.data ?? [],
    [articlesResponse?.data],
  );

  // Sort articles to match form order
  const displayArticles = useMemo(() => {
    if (articlesData.length === 0) return [];

    const articleMap = new Map<string, Article>();
    articlesData.forEach((article) => {
      articleMap.set(article.id, article);
    });

    return articleRefs
      .map((ref) => articleMap.get(ref.id))
      .filter((article): article is Article => article !== undefined);
  }, [articleRefs, articlesData]);

  return {
    displayArticles,
    articleIdList,
    isLoadingArticles: isLoadingArticles && articleIdList.length > 0,
  };
};
