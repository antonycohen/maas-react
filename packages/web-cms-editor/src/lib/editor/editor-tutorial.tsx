import React from 'react';

import { Badge } from '@maas/web-components';

export type TutorialItem = { label: string; demo: React.ReactNode };

const tutorialItems: TutorialItem[] = [
  {
    label: 'Cliquez sur un outil à gauche pour ajouter un bloc',
    demo: null,
  },
  {
    label: "Sélectionner un élément au centre pour pouvoir l'éditer ici",
    demo: null,
  },
  {
    label: 'Glisser déposer les blocs au centre pour les réorganiser',
    demo: null,
  },
  {
    label:
      'Utilisez les boutons de prévisualisation situés en haut pour vérifier le rendu',
    demo: null,
  },
];

export const EditorTutorial = () => {
  return (
    <ul className="flex w-full flex-col gap-y-4">
      {tutorialItems.map((item, index) => (
        <li
          key={index}
          className="flex items-center gap-x-2.5 rounded-lg border border-border p-4"
        >
          <Badge variant="secondary" className="min-w-6 justify-center">
            {index + 1}
          </Badge>
          <span className="text-sm text-foreground">{item.label}</span>
        </li>
      ))}
    </ul>
  );
};
