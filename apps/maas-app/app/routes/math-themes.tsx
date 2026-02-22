// eslint-disable-next-line @nx/enforce-module-boundaries
import { MathThemesPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: 'Thèmes mathématiques',
        description:
            'Explorez les articles de mathématiques par thème : géométrie, algèbre, analyse, arithmétique et plus.',
    });
}

export default function MathThemes() {
    return <MathThemesPage />;
}
