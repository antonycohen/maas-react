import { useOutletContext } from 'react-router';
import { ArticlePreviewPanel, ArticlesPanel, FoldersPanel } from './components';
import { AddArticleModal, AddFolderModal, useAddArticleModal, useAddFolderModal } from './modals';
import { useFolderDisplay, useArticleDisplay, useArticlePreview, useFolderActions, useArticleActions } from './hooks';
import { EditIssueOutletContext } from '../../edit-issue-manager-page';

export const IssueOrganizerTab = () => {
    const {
        issueId,
        isCreateMode,
        issue,
        isLoading,
        refetchIssue,
        form,
        selectedFolderId,
        setSelectedFolderId,
        selectedArticleId,
        setSelectedArticleId,
        folderCache,
        setFolderCache,
    } = useOutletContext<EditIssueOutletContext>();

    // Folder display
    const { displayFolders, currentFolder, formFoldersArray } = useFolderDisplay({
        issue,
        form,
        folderCache,
        selectedFolderId,
        setSelectedFolderId,
    });

    // Article display
    const { displayArticles, isLoadingArticles } = useArticleDisplay({
        form,
        selectedFolderId,
    });

    // Article preview
    const { selectedArticle, isLoadingArticle } = useArticlePreview({
        selectedArticleId,
    });

    // Folder actions
    const folderActions = useFolderActions({
        issueId,
        form,
        selectedFolderId,
        setSelectedFolderId,
        setSelectedArticleId,
        setFolderCache,
    });

    // Article actions
    const articleActions = useArticleActions({
        form,
        selectedFolderId,
        selectedArticleId,
        setSelectedArticleId,
    });

    // Folder modal
    const folderModal = useAddFolderModal({
        onLinkExisting: folderActions.handleLinkExistingFolder,
        onCreate: folderActions.handleCreateFolder,
    });

    // Article modal
    const articleModal = useAddArticleModal({
        onLinkExisting: articleActions.handleLinkExistingArticle,
        onArticleCreated: refetchIssue,
    });

    if (isCreateMode) {
        return null;
    }

    return (
        <>
            <div className="flex h-full flex-1 overflow-hidden">
                {/* Left: Folders */}
                <div className="h-full w-1/3 min-w-[200px]">
                    <FoldersPanel
                        folders={displayFolders}
                        selectedFolderId={selectedFolderId}
                        onSelectFolder={folderActions.selectFolder}
                        onAddFolder={folderModal.openModal}
                        onReorder={folderActions.handleReorderFolders}
                        isLoading={isLoading}
                    />
                </div>

                {/* Middle: Articles */}
                <div className="h-full w-1/3 min-w-[200px]">
                    <ArticlesPanel
                        folder={currentFolder}
                        articles={displayArticles}
                        selectedArticleId={selectedArticleId}
                        onSelectArticle={setSelectedArticleId}
                        onAddArticle={articleModal.openModal}
                        onDeleteFolder={() =>
                            currentFolder && folderActions.handleRemoveFolderFromIssue(currentFolder.id)
                        }
                        onDeleteArticle={articleActions.handleDeleteArticle}
                        onReorder={articleActions.handleReorderArticles}
                        isLoading={isLoadingArticles}
                    />
                </div>

                {/* Right: Preview */}
                <div className="h-full w-1/3 min-w-[200px] border-l">
                    <ArticlePreviewPanel article={selectedArticle} isLoading={isLoadingArticle} />
                </div>
            </div>

            {/* Add Folder Modal */}
            <AddFolderModal
                open={folderModal.open}
                onOpenChange={folderModal.setOpen}
                onSelectExisting={folderModal.handleSelectExisting}
                onCreate={folderModal.handleCreate}
                existingFolderIds={formFoldersArray.map((f) => f.id)}
            />

            {/* Add Article Modal */}
            <AddArticleModal
                open={articleModal.open}
                onOpenChange={articleModal.setOpen}
                onSelectExisting={articleModal.handleSelectExisting}
                onCreate={articleModal.handleCreate}
            />
        </>
    );
};
