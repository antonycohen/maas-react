import { useState } from 'react';
import { useGetArticleById, useGetArticles } from '@maas/core-api';
import { useTranslation } from '@maas/core-translations';
import { Button, ConfirmActionDialog } from '@maas/web-components';
import { IconPlus } from '@tabler/icons-react';
import { useOutletContext } from 'react-router';
import { ArticlePreview, ArticlesList } from './components';
import { AddArticleToFolderModal } from './modals';
import { EditFolderOutletContext } from '../../edit-folder-manager-page';
import { Article } from '@maas/core-api-models';
import { useMemo } from 'react';

export const FolderArticlesTab = () => {
    const { t } = useTranslation();
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

    // Fetch all articles belonging to this folder
    const { data: articlesResponse, isLoading: isLoadingArticles } = useGetArticles(
        {
            filters: { folderId },
            fields: {
                id: null,
                title: null,
                description: null,
                type: null,
                isPublished: null,
                featuredImage: null,
            },
            offset: 0,
            limit: 100,
        },
        {
            enabled: !!folderId,
        }
    );

    const isListLoading = isLoadingFolder || isLoadingArticles;
    const articlesData = useMemo(() => articlesResponse?.data ?? [], [articlesResponse?.data]);

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
    const { data: selectedArticle, isLoading: isLoadingArticle } = useGetArticleById(
        {
            id: selectedArticleId ?? '',
            fields: {
                id: null,
                slug: null,
                title: null,
                description: null,
                type: null,
                isPublished: null,
                featuredImage: null,
            },
        },
        {
            enabled: !!selectedArticleId,
        }
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

    const [removeDialogOpen, setRemoveDialogOpen] = useState(false);
    const [articleIdToRemove, setArticleIdToRemove] = useState<string | null>(null);

    const handleRemoveArticle = (articleId: string) => {
        setArticleIdToRemove(articleId);
        setRemoveDialogOpen(true);
    };

    const confirmRemoveArticle = () => {
        if (!articleIdToRemove) return;
        const currentArticles = form.getValues('articles') ?? [];
        form.setValue(
            'articles',
            currentArticles.filter((a) => a.id !== articleIdToRemove),
            { shouldDirty: true }
        );
        if (selectedArticleId === articleIdToRemove) {
            setSelectedArticleId(null);
        }
        setRemoveDialogOpen(false);
        setArticleIdToRemove(null);
    };

    const handleReorderArticles = (reorderedArticles: Article[]) => {
        // Update form with new order (just IDs)
        form.setValue(
            'articles',
            reorderedArticles.map((a) => ({ id: a.id })),
            { shouldDirty: true }
        );
    };

    return (
        <>
            <div className="flex h-full flex-1 overflow-hidden">
                {/* Left: Articles List */}
                <div className="flex h-full w-1/2 min-w-[300px] flex-col border-r">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="font-semibold">{t('articles.title')}</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setAddArticleModalOpen(true);
                            }}
                        >
                            <IconPlus className="mr-2 h-4 w-4" />
                            {t('folders.addArticle')}
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
                <div className="h-full w-1/2 min-w-[300px]">
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

            {/* Remove Article Confirmation */}
            <ConfirmActionDialog
                open={removeDialogOpen}
                onOpenChange={setRemoveDialogOpen}
                onConfirm={confirmRemoveArticle}
                title={t('common.remove')}
                description={t('message.confirm.removeFromFolder')}
                confirmLabel={t('common.remove')}
            />
        </>
    );
};
