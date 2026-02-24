import { ReactNode } from 'react';
import { FieldPath, FieldValues, useController, useFormContext } from 'react-hook-form';
import { IconEdit, IconUser, IconClock } from '@tabler/icons-react';

import { CMSBlock } from '@maas/core-api-models';
import { Button, Card, CardContent, Field, FieldDescription, FieldError, FieldLabel } from '@maas/web-components';
import { Editor, EditorPlugin, EditorTrigger } from '@maas/web-cms-editor';
import { useTranslation } from '@maas/core-translations';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEditorPlugin<Context> = EditorPlugin<any, any, Context>;

type ControlledCMSInputProps<T extends FieldValues, Context = unknown> = {
    name: FieldPath<T>;
    label: string;
    description?: string;
    plugins: AnyEditorPlugin<Context>[];
    context?: Context;
    triggerLabel?: string;
    renderTrigger?: (props: { openEditor: () => void }) => ReactNode;
    author?: string | null;
    lastModifiedAt?: string | Date | null;
};

function formatDate(date: string | Date | null | undefined): string | null {
    if (!date) return null;
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function ControlledCMSInput<T extends FieldValues, Context = unknown>(
    props: ControlledCMSInputProps<T, Context>
) {
    const { name, label, description, plugins, context, triggerLabel, renderTrigger, author, lastModifiedAt } = props;

    const { t } = useTranslation();
    const form = useFormContext();
    const { control } = form;
    const { field, fieldState } = useController({
        name,
        control,
    });

    const handleSave = (content: CMSBlock[]) => {
        field.onChange(content);
    };

    const content = (field.value as CMSBlock[]) ?? [];
    const hasContent = content.length > 0;
    const formattedDate = formatDate(lastModifiedAt);

    return (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel>{label}</FieldLabel>
            <Card className="overflow-hidden">
                <CardContent className="p-0">
                    <div className="bg-muted/30 flex items-center justify-between p-4">
                        <div className="text-muted-foreground flex items-center gap-4 text-sm">
                            {author && (
                                <span className="flex items-center gap-1.5">
                                    <IconUser className="h-3.5 w-3.5" />
                                    {author}
                                </span>
                            )}
                            {formattedDate && (
                                <span className="flex items-center gap-1.5">
                                    <IconClock className="h-3.5 w-3.5" />
                                    {formattedDate}
                                </span>
                            )}
                            <span>
                                {hasContent
                                    ? t(content.length > 1 ? 'cms.blockCountPlural' : 'cms.blockCount', {
                                          count: content.length,
                                      })
                                    : t('cms.noContentYet')}
                            </span>
                        </div>
                        <Editor
                            field={{
                                data: content,
                                errors: fieldState.error ? [fieldState.error.message ?? ''] : undefined,
                                onSave: handleSave,
                            }}
                            plugins={plugins}
                            context={context}
                            onSave={() => {
                                // Content is saved via field.onSave callback
                            }}
                        >
                            <EditorTrigger>
                                {renderTrigger ?? (
                                    <Button type="button" variant="outline" size="sm">
                                        <IconEdit className="mr-2 h-4 w-4" />
                                        {triggerLabel ?? t('cms.openEditor')}
                                    </Button>
                                )}
                            </EditorTrigger>
                        </Editor>
                    </div>
                </CardContent>
            </Card>
            {description && <FieldDescription>{description}</FieldDescription>}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
