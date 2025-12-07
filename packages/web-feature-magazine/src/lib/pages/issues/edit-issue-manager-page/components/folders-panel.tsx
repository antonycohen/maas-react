import { Folder } from '@maas/core-api-models';
import { Button, ScrollArea, Skeleton } from '@maas/web-components';
import { IconFolder, IconFolderPlus } from '@tabler/icons-react';

type FoldersPanelProps = {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onAddFolder: () => void;
  isLoading?: boolean;
};

export function FoldersPanel({
  folders,
  selectedFolderId,
  onSelectFolder,
  onAddFolder,
  isLoading,
}: FoldersPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <span className="text-sm font-semibold">Folders</span>
        <Button variant="ghost" size="sm" onClick={onAddFolder} className="h-7 w-7 p-0">
          <IconFolderPlus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </>
          ) : (
            <>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => onSelectFolder(folder.id)}
                  className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                    selectedFolderId === folder.id
                      ? 'bg-accent text-accent-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <IconFolder
                    className="h-4 w-4 shrink-0"
                    style={{ color: folder.color || 'currentColor' }}
                  />
                  <span className="flex-1 truncate">{folder.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {folder.articleCount ?? 0}
                  </span>
                </button>
              ))}
              {folders.length === 0 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  <IconFolderPlus className="mx-auto mb-2 h-8 w-8 opacity-50" />
                  <p>No folders yet</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={onAddFolder}
                    className="mt-1"
                  >
                    Create one
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
