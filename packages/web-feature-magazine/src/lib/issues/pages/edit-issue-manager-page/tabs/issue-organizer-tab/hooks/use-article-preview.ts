import { useGetArticleById } from '@maas/core-api';

type UseArticlePreviewParams = {
  selectedArticleId: string | null;
};

export const useArticlePreview = ({
  selectedArticleId,
}: UseArticlePreviewParams) => {
  const { data: selectedArticle, isLoading: isLoadingArticle } =
    useGetArticleById(
      {
        id: selectedArticleId ?? '',
        fields: {
          id: null,
          title: null,
          description: null,
          type: null,
          isPublished: null,
          featuredImage: null,
        },
      },
      {
        enabled: !!selectedArticleId,
      },
    );

  return {
    selectedArticle: selectedArticle ?? null,
    isLoadingArticle: isLoadingArticle && !!selectedArticleId,
  };
};
