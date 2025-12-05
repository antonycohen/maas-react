import * as React from 'react';

import { Button } from '@maas/web-components';

import { useEditorContext } from '../store/editor-context';

type EditorTriggerProps = {
  children:
    | React.ReactNode
    | ((props: { openEditor: () => void }) => React.ReactNode);
};

export const EditorTrigger = ({ children }: EditorTriggerProps) => {
  const { setSettings } = useEditorContext();

  const handleClick = () => setSettings((prev) => ({ ...prev, visible: true }));

  if (typeof children === 'function') {
    return children({ openEditor: handleClick });
  }

  if (children) {
    return <div onClick={handleClick}>{children}</div>;
  }

  return <Button onClick={handleClick}>Ouvrir dans l'éditeur</Button>;
};
