// eslint-disable-next-line @nx/enforce-module-boundaries
import { FoldersPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: 'Dossiers',
        description: 'Explorez nos dossiers thématiques de mathématiques.',
    });
}

export default function FoldersList() {
    return <FoldersPage />;
}
