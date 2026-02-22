// eslint-disable-next-line @nx/enforce-module-boundaries
import { HomePage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';

export function meta() {
    return buildPageMeta({
        title: undefined,
        description:
            'Tangente Magazine - La revue des mathématiques accessibles. Découvrez nos articles, dossiers et numéros.',
    });
}

export default function Home() {
    return <HomePage />;
}
