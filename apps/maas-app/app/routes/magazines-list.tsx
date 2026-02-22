// eslint-disable-next-line @nx/enforce-module-boundaries
import { MagazinesPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: 'Magazines',
        description: 'Tous les numéros de Tangente Magazine - La revue des mathématiques accessibles.',
    });
}

export default function MagazinesList() {
    return <MagazinesPage />;
}
