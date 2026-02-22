import { MathThemesPage } from '@maas/web-feature-home';
import { buildPageMeta } from '@maas/core-seo';
import type { Route } from './+types/math-themes';

const THEME_LABELS: Record<string, string> = {
    geometry: 'Géométrie',
    algebra: 'Algèbre',
    analysis: 'Analyse',
    arithmetic: 'Arithmétique',
    numerical: 'Numérique',
    logic: 'Logique',
    combinatorics_and_games: 'Combinatoire et jeux',
    applied_mathematics: 'Mathématiques appliquées',
    probability_and_statistics: 'Probabilités et statistiques',
};

export function meta({ params }: Route.MetaArgs) {
    const theme = params.theme;
    const label = theme ? THEME_LABELS[theme] : undefined;

    if (label) {
        return buildPageMeta({
            title: `Thème : ${label}`,
            description: `Explorez les articles de mathématiques sur le thème ${label.toLowerCase()}.`,
        });
    }

    return buildPageMeta({
        title: 'Thèmes mathématiques',
        description:
            'Explorez les articles de mathématiques par thème : géométrie, algèbre, analyse, arithmétique et plus.',
    });
}

export default function MathThemes() {
    return <MathThemesPage />;
}
