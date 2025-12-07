import { Button, Card, CardContent, CardHeader, CardTitle } from '@maas/web-components';
import { IconFolderPlus, IconPlus } from '@tabler/icons-react';
import { FolderSection, FolderData } from './folder-section';
import { ArticleItem, ArticleItemData } from './article-item';

type IssueComposerProps = {
  folders: FolderData[];
  standaloneArticles: ArticleItemData[];
  onAddFolder?: () => void;
  onEditFolder?: (folder: FolderData) => void;
  onDeleteFolder?: (folderId: string) => void;
  onAddArticle?: (folderId?: string) => void;
  onEditArticle?: (article: ArticleItemData, folderId?: string) => void;
  onDeleteArticle?: (articleId: string) => void;
};

export function IssueComposer({
  folders,
  standaloneArticles,
  onAddFolder,
  onEditFolder,
  onDeleteFolder,
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
}: IssueComposerProps) {
  const totalArticles =
    folders.reduce((acc, folder) => acc + folder.articles.length, 0) +
    standaloneArticles.length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>
          Issue Content
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {folders.length} folder{folders.length !== 1 ? 's' : ''}, {totalArticles} article
            {totalArticles !== 1 ? 's' : ''}
          </span>
        </CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onAddFolder}>
            <IconFolderPlus className="mr-2 h-4 w-4" />
            Add Folder
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddArticle?.()}>
            <IconPlus className="mr-2 h-4 w-4" />
            Add Article
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Folders with their articles */}
        {folders.map((folder) => (
          <FolderSection
            key={folder.id}
            folder={folder}
            onEditFolder={onEditFolder}
            onDeleteFolder={onDeleteFolder}
            onEditArticle={(article, folderId) => onEditArticle?.(article, folderId)}
            onDeleteArticle={onDeleteArticle}
            onAddArticle={(folderId) => onAddArticle?.(folderId)}
          />
        ))}

        {/* Standalone articles (not in any folder) */}
        {standaloneArticles.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 py-2">
              <span className="text-sm font-medium text-muted-foreground">
                Standalone Articles
              </span>
              <span className="text-xs text-muted-foreground">
                ({standaloneArticles.length})
              </span>
            </div>
            <div className="space-y-2">
              {standaloneArticles.map((article) => (
                <ArticleItem
                  key={article.id}
                  article={article}
                  onEdit={() => onEditArticle?.(article)}
                  onDelete={() => onDeleteArticle?.(article.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {folders.length === 0 && standaloneArticles.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-muted-foreground mb-4">
              <IconFolderPlus className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>This issue has no content yet.</p>
              <p className="text-sm">Start by adding folders to organize your articles.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onAddFolder}>
                <IconFolderPlus className="mr-2 h-4 w-4" />
                Add Folder
              </Button>
              <Button variant="outline" onClick={() => onAddArticle?.()}>
                <IconPlus className="mr-2 h-4 w-4" />
                Add Article
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
