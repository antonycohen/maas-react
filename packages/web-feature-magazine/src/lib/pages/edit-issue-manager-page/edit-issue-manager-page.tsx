import {
  Article,
  CreateArticle,
  CreateFolder,
  UpdateArticle,
  UpdateFolder,
} from '@maas/core-api-models';
import {
  Badge,
  Button,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@maas/web-components';
import { LayoutBreadcrumb, LayoutHeader } from '@maas/web-layout';
import { IconSettings, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ArticleEditorPanel,
  ArticlesPanel,
  ArticleSheet,
  FoldersPanel,
  FolderSheet,
  FolderWithArticles,
} from './components';

// Mock data for development - replace with actual API calls
const mockFolders: FolderWithArticles[] = [
  {
    id: 'folder-1',
    issue: { id: 'issue-1', name: 'Issue #42' },
    name: 'Cover Stories',
    description: null,
    position: 0,
    color: '#3B82F6',
    cover: null,
    isPublished: true,
    articleCount: 3,
    articles: [
      {
        id: 'article-1',
        issue: { id: 'issue-1', name: 'Issue #42' },
        folder: { id: 'folder-1', name: 'Cover Stories' },
        title: 'The Future of AI in Healthcare',
        description: null,
        content: null,
        author: null,
        featuredImage: null,
        cover: null,
        pdf: null,
        keywords: null,
        type: 'feature',
        visibility: null,
        position: 0,
        publishedAt: null,
        isPublished: true,
        isFeatured: false,
        tags: null,
        viewCount: null,
        likeCount: null,
        categories: null,
      },
      {
        id: 'article-2',
        issue: { id: 'issue-1', name: 'Issue #42' },
        folder: { id: 'folder-1', name: 'Cover Stories' },
        title: 'Interview with Tech Leaders',
        description: null,
        content: null,
        author: null,
        featuredImage: null,
        cover: null,
        pdf: null,
        keywords: null,
        type: 'interview',
        visibility: null,
        position: 1,
        publishedAt: null,
        isPublished: true,
        isFeatured: false,
        tags: null,
        viewCount: null,
        likeCount: null,
        categories: null,
      },
      {
        id: 'article-3',
        issue: { id: 'issue-1', name: 'Issue #42' },
        folder: { id: 'folder-1', name: 'Cover Stories' },
        title: 'Breaking News Analysis',
        description: null,
        content: null,
        author: null,
        featuredImage: null,
        cover: null,
        pdf: null,
        keywords: null,
        type: 'news',
        visibility: null,
        position: 2,
        publishedAt: null,
        isPublished: false,
        isFeatured: false,
        tags: null,
        viewCount: null,
        likeCount: null,
        categories: null,
      },
    ],
  },
  {
    id: 'folder-2',
    issue: { id: 'issue-1', name: 'Issue #42' },
    name: 'Opinion',
    description: null,
    position: 1,
    color: '#10B981',
    cover: null,
    isPublished: true,
    articleCount: 3,
    articles: [
      {
        id: 'article-4',
        issue: { id: 'issue-1', name: 'Issue #42' },
        folder: { id: 'folder-2', name: 'Opinion' },
        title: 'Why We Need Better Regulations',
        description: null,
        content: null,
        author: null,
        featuredImage: null,
        cover: null,
        pdf: null,
        keywords: null,
        type: 'opinion',
        visibility: null,
        position: 0,
        publishedAt: null,
        isPublished: true,
        isFeatured: false,
        tags: null,
        viewCount: null,
        likeCount: null,
        categories: null,
      },
    ],
  },
];

const mockStandaloneArticles: Article[] = [
  {
    id: 'article-9',
    issue: { id: 'issue-1', name: 'Issue #42' },
    folder: null,
    title: 'Quick Tips for Productivity',
    description: null,
    content: null,
    author: null,
    featuredImage: null,
    cover: null,
    pdf: null,
    keywords: null,
    type: 'tips',
    visibility: null,
    position: 0,
    publishedAt: null,
    isPublished: true,
    isFeatured: false,
    tags: null,
    viewCount: null,
    likeCount: null,
    categories: null,
  },
];

export function EditIssueManagerPage() {
  const { issueId = '' } = useParams<{ issueId: string }>();

  const isCreateMode = issueId === 'new';

  // Mock issue data - replace with useGetIssueById
  const issue = isCreateMode
    ? null
    : {
        id: issueId,
        title: 'Issue #42 - December 2024',
        description: 'The winter edition featuring our annual review.',
        issueNumber: '42',
        isPublished: false,
        brand: { id: 'brand-1', name: 'Tech Magazine' },
      };

  const isLoading = false;

  // Content state
  const [folders, setFolders] = useState<FolderWithArticles[]>(isCreateMode ? [] : mockFolders);
  const [standaloneArticles, setStandaloneArticles] = useState<Article[]>(
    isCreateMode ? [] : mockStandaloneArticles
  );

  // Selection state
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    folders.length > 0 ? folders[0].id : null
  );
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Sheet state
  const [folderSheetOpen, setFolderSheetOpen] = useState(false);
  const [articleSheetOpen, setArticleSheetOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<FolderWithArticles | null>(null);

  // Get current folder and articles
  const currentFolder = selectedFolderId
    ? folders.find((f) => f.id === selectedFolderId) || null
    : null;
  const currentArticles = selectedFolderId ? currentFolder?.articles || [] : standaloneArticles;
  const selectedArticle = currentArticles.find((a) => a.id === selectedArticleId) || null;

  function handleDeleteIssue() {
    if (window.confirm('Are you sure you want to delete this issue?')) {
      console.log('Delete issue:', issueId);
    }
  }

  // Folder handlers
  function handleAddFolder() {
    setEditingFolder(null);
    setFolderSheetOpen(true);
  }

  function handleEditFolder() {
    if (currentFolder) {
      setEditingFolder(currentFolder);
      setFolderSheetOpen(true);
    }
  }

  function handleSaveFolder(data: CreateFolder | UpdateFolder, folderId?: string) {
    if (folderId) {
      // Update existing folder
      setFolders((prev) =>
        prev.map((f) =>
          f.id === folderId
            ? {
                ...f,
                name: (data as UpdateFolder).name ?? f.name,
                description: (data as UpdateFolder).description ?? f.description,
                color: (data as UpdateFolder).color ?? f.color,
                isPublished: (data as UpdateFolder).isPublished ?? f.isPublished,
              }
            : f
        )
      );
    } else {
      // Create new folder
      const createData = data as CreateFolder;
      const newFolder: FolderWithArticles = {
        id: `folder-${Date.now()}`,
        issue: { id: issueId, name: issue?.title || null },
        name: createData.name,
        description: createData.description ?? null,
        position: folders.length,
        color: createData.color ?? null,
        cover: createData.cover ?? null,
        isPublished: false,
        articleCount: 0,
        articles: [],
      };
      setFolders((prev) => [...prev, newFolder]);
      setSelectedFolderId(newFolder.id);
    }
  }

  function handleDeleteFolder(folderId: string) {
    if (window.confirm('Are you sure you want to delete this folder and all its articles?')) {
      setFolders((prev) => prev.filter((f) => f.id !== folderId));
      if (selectedFolderId === folderId) {
        setSelectedFolderId(folders.length > 1 ? folders[0].id : null);
      }
      setSelectedArticleId(null);
    }
  }

  // Article handlers
  function handleAddArticle() {
    setArticleSheetOpen(true);
  }

  function handleSaveArticle(data: CreateArticle | UpdateArticle, articleId?: string) {
    if (articleId) {
      // Update existing article
      const updateData = data as UpdateArticle;
      const targetFolderId = updateData.folder;

      // Remove from current location
      setFolders((prev) =>
        prev.map((f) => ({
          ...f,
          articles: f.articles.filter((a) => a.id !== articleId),
        }))
      );
      setStandaloneArticles((prev) => prev.filter((a) => a.id !== articleId));

      // Find the article to get its current data
      let existingArticle: Article | undefined;
      for (const folder of folders) {
        existingArticle = folder.articles.find((a) => a.id === articleId);
        if (existingArticle) break;
      }
      if (!existingArticle) {
        existingArticle = standaloneArticles.find((a) => a.id === articleId);
      }

      if (existingArticle) {
        const updatedArticle: Article = {
          ...existingArticle,
          title: updateData.title ?? existingArticle.title,
          description: updateData.description ?? existingArticle.description,
          content: updateData.content ?? existingArticle.content,
          type: updateData.type ?? existingArticle.type,
          isPublished: updateData.isPublished ?? existingArticle.isPublished,
          isFeatured: updateData.isFeatured ?? existingArticle.isFeatured,
          folder: targetFolderId
            ? { id: targetFolderId, name: folders.find((f) => f.id === targetFolderId)?.name || null }
            : null,
        };

        // Add to new location
        if (targetFolderId) {
          setFolders((prev) =>
            prev.map((f) =>
              f.id === targetFolderId ? { ...f, articles: [...f.articles, updatedArticle] } : f
            )
          );
          setSelectedFolderId(targetFolderId);
        } else {
          setStandaloneArticles((prev) => [...prev, updatedArticle]);
          setSelectedFolderId(null);
        }
      }
    } else {
      // Create new article
      const createData = data as CreateArticle;
      const newArticle: Article = {
        id: `article-${Date.now()}`,
        issue: { id: issueId, name: issue?.title || null },
        folder: createData.folder
          ? {
              id: createData.folder,
              name: folders.find((f) => f.id === createData.folder)?.name || null,
            }
          : null,
        title: createData.title,
        description: createData.description ?? null,
        content: createData.content ?? null,
        author: null,
        featuredImage: createData.featuredImage ?? null,
        cover: createData.cover ?? null,
        pdf: createData.pdf ?? null,
        keywords: createData.keywords ?? null,
        type: createData.type ?? null,
        visibility: createData.visibility ?? null,
        position: createData.position ?? 0,
        publishedAt: null,
        isPublished: false,
        isFeatured: createData.isFeatured ?? false,
        tags: null,
        viewCount: null,
        likeCount: null,
        categories: null,
      };

      if (selectedFolderId) {
        setFolders((prev) =>
          prev.map((f) =>
            f.id === selectedFolderId ? { ...f, articles: [...f.articles, newArticle] } : f
          )
        );
      } else {
        setStandaloneArticles((prev) => [...prev, newArticle]);
      }
      setSelectedArticleId(newArticle.id);
    }
  }

  function handleDeleteArticle(articleId: string) {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setFolders((prev) =>
        prev.map((f) => ({
          ...f,
          articles: f.articles.filter((a) => a.id !== articleId),
        }))
      );
      setStandaloneArticles((prev) => prev.filter((a) => a.id !== articleId));
      if (selectedArticleId === articleId) {
        setSelectedArticleId(null);
      }
    }
  }

  if (!isCreateMode && isLoading) {
    return <div>Loading...</div>;
  }

  if (!isCreateMode && !issue) {
    return <div>Issue not found</div>;
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
                <Button variant="destructive" size="sm" onClick={handleDeleteIssue}>
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
                standaloneArticlesCount={standaloneArticles.length}
                selectedFolderId={selectedFolderId}
                onSelectFolder={(id) => {
                  setSelectedFolderId(id);
                  setSelectedArticleId(null);
                }}
                onAddFolder={handleAddFolder}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Middle: Articles */}
            <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
              <ArticlesPanel
                folder={currentFolder}
                articles={currentArticles}
                selectedArticleId={selectedArticleId}
                onSelectArticle={setSelectedArticleId}
                onAddArticle={handleAddArticle}
                onEditFolder={handleEditFolder}
                onDeleteFolder={() => currentFolder && handleDeleteFolder(currentFolder.id)}
                onDeleteArticle={handleDeleteArticle}
              />
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right: Editor */}
            <ResizablePanel defaultSize={50} minSize={30}>
              <ArticleEditorPanel
                article={selectedArticle}
                folders={folders}
                currentFolderId={selectedFolderId}
                onSave={handleSaveArticle}
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
        article={null}
        folders={folders}
        issueId={issueId}
        currentFolderId={selectedFolderId}
        onSave={handleSaveArticle}
      />
    </div>
  );
}
