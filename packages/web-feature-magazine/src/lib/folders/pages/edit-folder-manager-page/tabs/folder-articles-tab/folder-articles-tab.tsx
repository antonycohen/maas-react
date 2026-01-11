import { useGetArticleById, useGetArticles } from '@maas/core-api';
import { Button } from '@maas/web-components';
import { IconPlus } from '@tabler/icons-react';
import { useOutletContext } from 'react-router-dom';
import { ArticlePreview, ArticlesList } from './components';
import { AddArticleToFolderModal } from './modals';
import { EditFolderOutletContext } from '../../edit-folder-manager-page';
import { Article } from '@maas/core-api-models';
import { useMemo } from 'react';

export const FolderArticlesTab = () => {
  const {
    folderId,
    isLoading: isLoadingFolder,
    form,
    selectedArticleId,
    setSelectedArticleId,
    addArticleModalOpen,
    setAddArticleModalOpen,
  } = useOutletContext<EditFolderOutletContext>();

  // Get article IDs from form (source of truth for which articles are in folder)
  const watchedArticles = form.watch('articles');
  const articleIds = useMemo(() => watchedArticles ?? [], [watchedArticles]);
  const articleIdList = useMemo(
    () => articleIds.map((a) => a.id),
    [articleIds],
  );

  // Fetch all articles by IDs
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

  const isListLoading = isLoadingFolder || isLoadingArticles;
  const articlesData = useMemo(
    () => articlesResponse?.data ?? [],
    [articlesResponse?.data],
  );

  // Sort fetched articles to match form order
  const displayArticles = useMemo(() => {
    if (articlesData.length === 0) return [];

    const articleMap = new Map<string, Article>();
    articlesData.forEach((article) => {
      articleMap.set(article.id, article);
    });

    // Return articles in form order
    return articleIds
      .map((ref) => articleMap.get(ref.id))
      .filter((article): article is Article => article !== undefined);
  }, [articleIds, articlesData]);

  // Fetch selected article details (for preview with more fields if needed)
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

  const handleLinkExistingArticle = (article: Article) => {
    const currentArticles = form.getValues('articles') ?? [];
    // Avoid duplicates
    if (!currentArticles.some((a) => a.id === article.id)) {
      // Add to form (just ID)
      form.setValue('articles', [...currentArticles, { id: article.id }], {
        shouldDirty: true,
      });
    }
    setSelectedArticleId(article.id);
    setAddArticleModalOpen(false);
  };

  const handleRemoveArticle = (articleId: string) => {
    if (window.confirm('Remove this article from the folder?')) {
      const currentArticles = form.getValues('articles') ?? [];
      form.setValue(
        'articles',
        currentArticles.filter((a) => a.id !== articleId),
        { shouldDirty: true },
      );
      if (selectedArticleId === articleId) {
        setSelectedArticleId(null);
      }
    }
  };

  const handleReorderArticles = (reorderedArticles: Article[]) => {
    // Update form with new order (just IDs)
    form.setValue(
      'articles',
      reorderedArticles.map((a) => ({ id: a.id })),
      { shouldDirty: true },
    );
  };

  return (
    <>
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Left: Articles List */}
        <div className="w-1/2 min-w-[300px] h-full flex flex-col border-r">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Articles</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                setAddArticleModalOpen(true);
                e.preventDefault();
              }}
            >
              <IconPlus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </div>
          <ArticlesList
            articles={displayArticles}
            selectedArticleId={selectedArticleId}
            onSelectArticle={setSelectedArticleId}
            onRemoveArticle={handleRemoveArticle}
            onReorder={handleReorderArticles}
            isLoading={isListLoading}
          />
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 min-w-[300px] h-full">
          <ArticlePreview
            article={selectedArticle ?? null}
            isLoading={isLoadingArticle && !!selectedArticleId}
          />
        </div>
      </div>

      {/* Add Article Modal */}
      <AddArticleToFolderModal
        open={addArticleModalOpen}
        onOpenChange={setAddArticleModalOpen}
        folderId={folderId}
        onSelectExisting={handleLinkExistingArticle}
        existingArticleIds={articleIds.map((a) => a.id)}
      />
    </>
  );
};
