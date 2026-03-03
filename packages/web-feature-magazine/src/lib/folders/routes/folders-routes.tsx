import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router';

const FoldersListManagerPage = lazy(() =>
    import('../pages/list-folders-manager-page/folders-list-manager-page').then((m) => ({
        default: m.FoldersListManagerPage,
    }))
);
const EditFolderManagerPage = lazy(() =>
    import('../pages/edit-folder-manager-page').then((m) => ({
        default: m.EditFolderManagerPage,
    }))
);
const FolderInfoTab = lazy(() =>
    import('../pages/edit-folder-manager-page/tabs/folder-info-tab').then((m) => ({
        default: m.FolderInfoTab,
    }))
);
const FolderArticlesTab = lazy(() =>
    import('../pages/edit-folder-manager-page/tabs/folder-articles-tab').then((m) => ({
        default: m.FolderArticlesTab,
    }))
);

const SuspenseFallback = (
    <div className="flex h-[50vh] items-center justify-center">
        <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
);

export const FoldersRoutes = () => {
    return (
        <Suspense fallback={SuspenseFallback}>
            <Routes>
                <Route path="/" element={<FoldersListManagerPage />} />
                <Route path=":folderId" element={<EditFolderManagerPage />}>
                    <Route path="info" element={<FolderInfoTab />} />
                    <Route path="articles" element={<FolderArticlesTab />} />
                </Route>
            </Routes>
        </Suspense>
    );
};
