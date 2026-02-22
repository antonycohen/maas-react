import { Route, Routes } from 'react-router';
import { FoldersListManagerPage } from '../pages/list-folders-manager-page/folders-list-manager-page';
import { EditFolderManagerPage } from '../pages/edit-folder-manager-page';
import { FolderInfoTab } from '../pages/edit-folder-manager-page/tabs/folder-info-tab';
import { FolderArticlesTab } from '../pages/edit-folder-manager-page/tabs/folder-articles-tab';

export const FoldersRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<FoldersListManagerPage />} />
            <Route path=":folderId" element={<EditFolderManagerPage />}>
                <Route path="info" element={<FolderInfoTab />} />
                <Route path="articles" element={<FolderArticlesTab />} />
            </Route>
        </Routes>
    );
};
