import { Button } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import { ArticleTypeFieldType } from '@maas/core-api-models';
import { IconChevronDown, IconChevronUp, IconTrash } from '@tabler/icons-react';
import { useFormContext, useWatch } from 'react-hook-form';
import {
    ControlledCheckbox,
    ControlledEnumInput,
    ControlledCategoryInput,
    ControlledSelectInput,
    ControlledTextInput,
} from '@maas/web-form';

const useFieldTypeOptions = () => {
    const { t } = useTranslation();
    return [
        { value: 'string' as ArticleTypeFieldType, label: t('fieldType.string') },
        { value: 'text' as ArticleTypeFieldType, label: t('fieldType.text') },
        { value: 'number' as ArticleTypeFieldType, label: t('fieldType.number') },
        { value: 'enum' as ArticleTypeFieldType, label: t('fieldType.enum') },
        { value: 'cms' as ArticleTypeFieldType, label: t('fieldType.cms') },
        { value: 'category' as ArticleTypeFieldType, label: t('fieldType.category') },
        { value: 'image' as ArticleTypeFieldType, label: t('fieldType.image') },
        { value: 'video' as ArticleTypeFieldType, label: t('fieldType.video') },
        { value: 'json' as ArticleTypeFieldType, label: t('fieldType.json') },
    ];
};

type FieldEditorProps = {
    index: number;
    onRemove: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    isFirst: boolean;
    isLast: boolean;
};

export function FieldEditor({ index, onRemove, onMoveUp, onMoveDown, isFirst, isLast }: FieldEditorProps) {
    const { t } = useTranslation();
    const FIELD_TYPE_OPTIONS = useFieldTypeOptions();
    const { control } = useFormContext();

    // Watch the type field to conditionally render enum/category inputs
    const fieldType = useWatch({
        control,
        name: `fields.${index}.type`,
    });

    return (
        <div className="bg-card space-y-4 rounded-lg border p-4">
            <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm font-medium">
                    {t('articleTypes.fieldLabel', { index: index + 1 })}
                </span>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onMoveUp}
                        disabled={isFirst}
                        className="h-8 w-8 p-0"
                    >
                        <IconChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onMoveDown}
                        disabled={isLast}
                        className="h-8 w-8 p-0"
                    >
                        <IconChevronDown className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={onRemove}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0"
                    >
                        <IconTrash className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ControlledTextInput
                    name={`fields.${index}.label`}
                    label={t('field.label')}
                    placeholder="Enter field label..."
                />
                <ControlledTextInput
                    name={`fields.${index}.key`}
                    label={t('field.key')}
                    placeholder={t('field.placeholder.fieldKey')}
                    className="[&_input]:font-mono [&_input]:text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <ControlledSelectInput
                    name={`fields.${index}.type`}
                    label={t('field.type')}
                    options={FIELD_TYPE_OPTIONS}
                    placeholder={t('field.placeholder.selectType')}
                />

                {fieldType === 'enum' && (
                    <ControlledEnumInput
                        name={`fields.${index}.enum`}
                        label={t('fieldType.enum')}
                        placeholder={t('field.placeholder.selectEnum')}
                    />
                )}

                {fieldType === 'category' && (
                    <ControlledCategoryInput
                        name={`fields.${index}.category`}
                        label={t('fieldType.category')}
                        placeholder={t('field.placeholder.selectCategory')}
                    />
                )}
            </div>

            <ControlledCheckbox name={`fields.${index}.isList`} label={t('articleTypes.allowMultiple')} />
        </div>
    );
}
