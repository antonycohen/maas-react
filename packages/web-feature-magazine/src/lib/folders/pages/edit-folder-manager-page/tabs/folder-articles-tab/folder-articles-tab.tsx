import { useGetArticleById } from '@maas/core-api';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@maas/web-components';
import { IconPlus } from '@tabler/icons-react';
import { useEditFolderContext } from '../../context';
import { ArticlesList, ArticlePreview } from './components';
import { useFolderArticles, useArticleMutations } from './hooks';
import { AddArticleToFolderModal } from './modals';

export const FolderArticlesTab = () => {
  const {
    folderId,
    isCreateMode,
    selectedArticleId,
    addArticleModalOpen,
    setAddArticleModalOpen,
    openAddArticle,
    selectArticle,
  } = useEditFolderContext();

  const { articles, isLoading: isLoadingArticles } = useFolderArticles();
  const { handleCreateArticle, handleLinkExistingArticle, handleRemoveArticle } =
    useArticleMutations();

  // Fetch selected article details
  const { data: selectedArticle, isLoading: isLoadingArticle } = useGetArticleById(
    {
      id: selectedArticleId ?? '',
      fields: {
        id: null,
        title: null,
        description: null,
        type: null,
        isPublished: null,
        isFeatured: null,
        featuredImage: null,
      },
    },
    {
      enabled: !!selectedArticleId,
    },
  );

  if (isCreateMode) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Create Folder First</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Save the folder information first before adding articles.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Left: Articles List */}
        <div className="w-1/2 min-w-[300px] h-full flex flex-col border-r">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-semibold">Articles</h3>
            <Button variant="outline" size="sm" onClick={openAddArticle}>
              <IconPlus className="h-4 w-4 mr-2" />
              Add Article
            </Button>
          </div>
          <ArticlesList
            articles={articles}
            selectedArticleId={selectedArticleId}
            onSelectArticle={selectArticle}
            onRemoveArticle={handleRemoveArticle}
            isLoading={isLoadingArticles}
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
        onCreate={handleCreateArticle}
      />
    </>
  );
};
