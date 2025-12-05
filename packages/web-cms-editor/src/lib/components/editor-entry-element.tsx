import { Pencil } from 'lucide-react';
import { useTranslation } from '@maas/core-translations';
import { Badge, Button } from '@maas/web-components';
import { EditorTrigger } from '../editor/editor-trigger';

type EditorEntryElementProps = {
  userName: string | undefined;
};

export function EditorEntryElement(props: EditorEntryElementProps) {
  const { t, intl } = useTranslation();
  const { userName } = props;

  const lastEditDate = intl.formatMessage(
    {
      id: 'on_date_at_hour',
    },
    {
      date: intl.formatDate(new Date(), {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
      }),
      hour: intl.formatDate(new Date(), {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
    },
  );

  return (
    <div className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
      <div className="mr-20">
        <h5 className="mb-0.5 font-bricolage text-base font-semibold text-neutral-900">
          {t(
            'projects.back_office.edit_project_page.content.editor_entry.element_title',
          )}
        </h5>
        {userName && (
          <span className="text-sm text-neutral-700">{userName}</span>
        )}
      </div>

      <div>
        <Badge variant="secondary">{lastEditDate}</Badge>
      </div>

      <div className="ml-auto flex gap-x-2">
        <EditorTrigger>
          {({ openEditor }) => (
            <Button variant="ghost" size="icon" onClick={openEditor}>
              <Pencil className="h-4 w-4 text-neutral-900" />
            </Button>
          )}
        </EditorTrigger>
      </div>
    </div>
  );
}
