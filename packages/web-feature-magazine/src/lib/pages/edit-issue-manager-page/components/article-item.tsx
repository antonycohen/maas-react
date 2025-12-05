import { Article } from '@maas/core-api-models';
import { Button } from '@maas/web-components';
import { IconEdit, IconGripVertical, IconTrash } from '@tabler/icons-react';

type ArticleItemProps = {
  article: Article;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function ArticleItem({ article, onEdit, onDelete }: ArticleItemProps) {
  return (
    <div className="group flex items-center gap-3 rounded-md border bg-background p-3 hover:bg-muted/50">
      <div className="cursor-grab text-muted-foreground hover:text-foreground">
        <IconGripVertical className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate">{article.title}</span>
          {article.type && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {article.type}
            </span>
          )}
          {article.isPublished === false && (
            <span className="text-xs text-orange-600 bg-orange-100 px-2 py-0.5 rounded">
              Draft
            </span>
          )}
          {article.isFeatured && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
              Featured
            </span>
          )}
        </div>
        {article.author && (
          <div className="text-xs text-muted-foreground mt-0.5">
            By {article.author.firstName} {article.author.lastName}
          </div>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <IconEdit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="text-destructive hover:text-destructive"
        >
          <IconTrash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
