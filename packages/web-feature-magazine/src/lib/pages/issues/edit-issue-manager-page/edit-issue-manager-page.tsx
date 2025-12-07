import { useDeleteIssue } from '@maas/core-api';
import {
  Badge,
  Button,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@maas/web-components';
import { LayoutBreadcrumb, LayoutHeader } from '@maas/web-layout';
import { IconSettings, IconTrash } from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArticleEditorPanel,
  ArticleSheet,
  ArticlesPanel,
  FolderSheet,
  FoldersPanel,
} from './components';
import { EditIssueProvider, useEditIssueContext } from './context';
import {
  useIssueData,
  useIssueFolders,
  useFolderArticles,
  useArticleDetail,
  useFolderMutations,
  useArticleMutations,
} from './hooks';

function EditIssueContent() {
  const navigate = useNavigate();
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

  // Data fetching
  const { issue, isLoading: isLoadingIssue } = useIssueData();
  const { folders, currentFolder, isLoading: isLoadingFolders } = useIssueFolders();
  const { articles, isLoading: isLoadingArticles } = useFolderArticles();
  const { article: selectedArticle, isLoading: isLoadingArticle } = useArticleDetail();

  // Mutations
  const { handleSaveFolder, handleDeleteFolder } = useFolderMutations();
  const { handleSaveArticle, handleDeleteArticle } = useArticleMutations();

  // Delete issue mutation
  const deleteIssueMutation = useDeleteIssue({
    onSuccess: () => {
      navigate('/issues');
    },
  });

  const handleDeleteIssue = () => {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      deleteIssueMutation.mutate(issueId);
    }
  };

  const isLoading = isLoadingIssue || isLoadingFolders;

  if (!isCreateMode && isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isCreateMode && !issue) {
    return <div className="flex h-screen items-center justify-center">Issue not found</div>;
  }

  const pageTitle = isCreateMode ? 'New Issue' : (issue?.title ?? '');
  const breadcrumbLabel = isCreateMode ? 'New' : (issue?.title ?? '');

  return (
    <div className="flex h-screen flex-col">
      <header className="shrink-0">
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Issues', to: '/issues' },
            { label: breadcrumbLabel },
          ]}
        />
        <LayoutHeader
          pageTitle={pageTitle}
          actions={
            !isCreateMode && (
              <div className="flex items-center gap-2">
                {issue?.isPublished ? (
                  <Badge>Published</Badge>
                ) : (
                  <Badge variant="secondary">Draft</Badge>
                )}
                <Button variant="outline" size="sm">
                  <IconSettings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteIssue}
                  disabled={deleteIssueMutation.isPending}
                >
                  <IconTrash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            )
          }
        />
      </header>

      {/* 3-Column Layout */}
      {!isCreateMode && (
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
      )}

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
    </div>
  );
}

export function EditIssueManagerPage() {
  const { issueId = '' } = useParams<{ issueId: string }>();

  return (
    <EditIssueProvider issueId={issueId}>
      <EditIssueContent />
    </EditIssueProvider>
  );
}
