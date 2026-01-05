import { ArticlePreviewPanel, ArticlesPanel, FolderSheet, FoldersPanel } from './components';
import { useArticleDetail, useArticleMutations, useFolderArticles, useFolderMutations, useIssueFolders } from './hooks';
import { useEditIssueContext } from './context';
import { AddArticleModal } from './modals';

export const IssueOrganizerTab = () => {

  const {
    issueId,
    isCreateMode,
    selectedFolderId,
    selectedArticleId,
    folderSheetOpen,
    articleSheetOpen,
    editingFolder,
    setFolderSheetOpen,
    setArticleSheetOpen,
    openAddFolder,
    openEditFolder,
    openAddArticle,
    selectFolder,
    selectArticle,
  } = useEditIssueContext();

  const { folders, currentFolder, isLoading: isLoadingFolders } = useIssueFolders();
  const { articles, isLoading: isLoadingArticles } = useFolderArticles();
  const { article: selectedArticle, isLoading: isLoadingArticle } = useArticleDetail();

  // Mutations
  const { handleSaveFolder, handleDeleteFolder } = useFolderMutations();
  const { handleSaveArticle, handleDeleteArticle, handleLinkExistingArticle } = useArticleMutations();

  if(isCreateMode) {
    return null;
  }

  return <>
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Left: Folders */}
      <div className="w-1/3 min-w-[200px] h-full">
        <FoldersPanel
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={selectFolder}
          onAddFolder={openAddFolder}
          isLoading={isLoadingFolders}
        />
      </div>

      {/* Middle: Articles */}
      <div className="w-1/3 min-w-[200px] h-full">
        <ArticlesPanel
          folder={currentFolder}
          articles={articles}
          selectedArticleId={selectedArticleId}
          onSelectArticle={selectArticle}
          onAddArticle={openAddArticle}
          onEditFolder={() => currentFolder && openEditFolder(currentFolder)}
          onDeleteFolder={() =>
            currentFolder && handleDeleteFolder(currentFolder.id)
          }
          onDeleteArticle={handleDeleteArticle}
          isLoading={isLoadingArticles}
        />
      </div>

      {/* Right: Preview */}
      <div className="w-1/3 min-w-[200px] h-full border-l">
        <ArticlePreviewPanel
          article={selectedArticle}
          isLoading={isLoadingArticle}
        />
      </div>
    </div>

    {/* Folder Sheet */}
    <FolderSheet
      open={folderSheetOpen}
      onOpenChange={setFolderSheetOpen}
      folder={editingFolder}
      issueId={issueId}
      onSave={handleSaveFolder}
      onDelete={handleDeleteFolder}
    />

    {/* Add Article Modal */}
    <AddArticleModal
      open={articleSheetOpen}
      onOpenChange={setArticleSheetOpen}
      issueId={issueId}
      currentFolder={currentFolder}
      onSelectExisting={handleLinkExistingArticle}
      onCreate={handleSaveArticle}
    />
  </>
}
