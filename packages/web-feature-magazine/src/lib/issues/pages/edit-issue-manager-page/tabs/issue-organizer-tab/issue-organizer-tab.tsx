import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@maas/web-components';
import { ArticleEditorPanel, ArticleSheet, ArticlesPanel, FolderSheet, FoldersPanel } from './components';
import { useArticleDetail, useArticleMutations, useFolderArticles, useFolderMutations, useIssueFolders } from './hooks';
import { useEditIssueContext } from './context';

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
  const { handleSaveArticle, handleDeleteArticle } = useArticleMutations();

  if(isCreateMode) {
    return null;
  }

  return <>
    <div className="flex-1 overflow-hidden">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* Left: Folders */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <FoldersPanel
            folders={folders}
            selectedFolderId={selectedFolderId}
            onSelectFolder={selectFolder}
            onAddFolder={openAddFolder}
            isLoading={isLoadingFolders}
          />
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Middle: Articles */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
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
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Right: Editor */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <ArticleEditorPanel
            article={selectedArticle}
            issueId={issueId}
            onSave={handleSaveArticle}
            isLoading={isLoadingArticle}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
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

    {/* Article Sheet (for creating new) */}
    <ArticleSheet
      open={articleSheetOpen}
      onOpenChange={setArticleSheetOpen}
      issueId={issueId}
      currentFolder={currentFolder}
      onCreate={handleSaveArticle}
    />
  </>
}
