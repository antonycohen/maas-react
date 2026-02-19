import { useCallback, useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useGetArticleTypeById, useGetEnumById } from '@maas/core-api';
import { useTranslation } from '@maas/core-translations';
import { Article, ArticleType, ArticleTypeField, ReadArticleTypeRef } from '@maas/core-api-models';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    Skeleton,
} from '@maas/web-components';
import { camelize } from '@nx/devkit/src/utils/string-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { editorPlugins } from '../edit-article-manager-page';
import { camelCase } from 'change-case';
import CodeMirror from '@uiw/react-codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter } from '@codemirror/lint';

type DynamicFieldProps = {
    field: ArticleTypeField;
};

const {
    ControlledTextInput,
    ControlledTextAreaInput,
    ControlledSelectInput,
    ControlledCategoryInput,
    ControlledCMSInput,
    ControlledImageInput,
    ControlledVideoInput,
    ControlledCheckbox,
} = createConnectedInputHelpers<any>();

function DynamicEnumField({ field }: DynamicFieldProps) {
    const enumId = field.enum?.id;

    const { data: enumData, isLoading } = useGetEnumById(
        {
            id: enumId ?? '',
            fields: { id: null, name: null, values: null },
        },
        {
            enabled: !!enumId,
        }
    );

    if (isLoading) {
        return <Skeleton className="h-10 w-full" />;
    }

    const options =
        enumData?.values?.map((v) => ({
            value: v.value,
            label: v.label,
        })) ?? [];

    return (
        <ControlledSelectInput
            name={`customFields.${field.key}` as keyof Article}
            label={field.label}
            options={options}
            placeholder={`Select ${field.label.toLowerCase()}...`}
        />
    );
}

const jsonExtensions = [json(), linter(jsonParseLinter())];

function DynamicJsonField({ field }: DynamicFieldProps) {
    const fieldName = `customFields.${camelize(field.key)}`;
    const { control, setValue, formState } = useFormContext();

    const value = useWatch({ control, name: fieldName });
    const fieldError = formState.errors?.customFields?.[
        camelize(field.key) as keyof typeof formState.errors.customFields
    ] as { message?: string } | undefined;

    const displayValue = typeof value === 'string' ? value : (JSON.stringify(value, null, 2) ?? '');

    const handleChange = useCallback(
        (val: string) => {
            try {
                setValue(fieldName, JSON.parse(val?.trim()), { shouldDirty: true });
            } catch {
                setValue(fieldName, val?.trim(), { shouldDirty: true });
            }
        },
        [fieldName, setValue]
    );

    return (
        <Field data-invalid={!!fieldError}>
            <FieldLabel>{field.label}</FieldLabel>
            <CodeMirror
                value={displayValue}
                extensions={jsonExtensions}
                onChange={handleChange}
                height="200px"
                basicSetup={{ lineNumbers: true, foldGutter: true }}
                className="overflow-hidden rounded-md border"
            />
            {fieldError && <FieldError errors={[fieldError]} />}
        </Field>
    );
}

function DynamicField({ field }: DynamicFieldProps) {
    const fieldName = `customFields.${camelize(field.key)}` as keyof Article;
    const { t } = useTranslation();

    switch (field.type) {
        case 'string':
            return <ControlledTextInput name={fieldName} label={field.label} />;

        case 'text':
            return <ControlledTextAreaInput name={fieldName} label={field.label} />;

        case 'number':
            return (
                <ControlledTextInput
                    name={fieldName}
                    label={field.label}
                    placeholder={t('field.placeholder.enterNumber')}
                />
            );

        case 'enum':
            return <DynamicEnumField field={field} />;

        case 'category':
            return <ControlledCategoryInput name={fieldName} label={field.label} />;

        case 'cms':
            return <ControlledCMSInput name={fieldName} label={field.label} plugins={editorPlugins} />;

        case 'image':
            return <ControlledImageInput name={fieldName} label={field.label} />;

        case 'video':
            return <ControlledVideoInput name={fieldName} label={field.label} />;

        case 'boolean':
            return <ControlledCheckbox name={fieldName} label={field.label} />;

        case 'json':
            return <DynamicJsonField field={field} />;

        default:
            return null;
    }
}

function initCustomFields(articleType: ArticleType): Record<string, unknown> {
    const fields: Record<string, unknown> = {};
    if (articleType?.fields) {
        articleType.fields.forEach((field) => {
            const key = camelCase(field.key);
            switch (field.type) {
                case 'text':
                case 'string':
                    fields[key] = field.isList ? [] : '';
                    break;
                case 'number':
                    fields[key] = field.isList ? [] : null;
                    break;
                case 'boolean':
                    fields[key] = false;
                    break;
                case 'json':
                    fields[key] = null;
                    break;
                case 'enum':
                case 'category':
                case 'cms':
                case 'image':
                case 'video':
                    fields[key] = field.isList ? [] : null;
                    break;
                default:
                    fields[key] = null;
                    break;
            }
        });
    }
    return fields;
}

export function DynamicCustomFields() {
    const { t } = useTranslation();
    const { control, setValue, getValues } = useFormContext<Article>();
    useWatch({
        control,
        name: 'customFields',
    });

    const previousTypeIdRef = useRef<string | null>(null);

    const articleType = useWatch({
        control,
        name: 'type',
    }) as ReadArticleTypeRef | null | undefined;

    const { data: articleTypeData, isLoading } = useGetArticleTypeById(
        {
            id: articleType?.id ?? '',
            fields: {
                id: null,
                name: null,
                fields: {
                    fields: {
                        key: null,
                        type: null,
                        validators: null,
                        isList: null,
                        label: null,
                        enum: null,
                        category: null,
                    },
                },
            },
        },
        {
            enabled: !!articleType?.id,
        }
    );

    // Initialize customFields when article type changes
    useEffect(() => {
        if (articleTypeData && articleType?.id !== previousTypeIdRef.current) {
            previousTypeIdRef.current = articleType?.id ?? null;

            const currentCustomFields = getValues('customFields') ?? {};
            const initializedFields = initCustomFields(articleTypeData);

            // Merge: keep existing values, add new fields with defaults
            const mergedFields = { ...initializedFields };
            for (const key of Object.keys(initializedFields)) {
                if (currentCustomFields[key] !== undefined) {
                    mergedFields[key] = currentCustomFields[key];
                }
            }

            setValue('customFields', mergedFields, { shouldDirty: false });
        }
    }, [articleTypeData, articleType?.id, setValue, getValues]);

    if (!articleType?.id) {
        return null;
    }

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t('articles.customFields')}</CardTitle>
                    <CardDescription>{t('articles.loadingFieldDefinitions')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const fields = articleTypeData?.fields ?? [];

    if (fields.length === 0) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('articles.customFields')}</CardTitle>
                <CardDescription>Fields defined by the article type "{articleTypeData?.name}".</CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    {fields.map((field) => (
                        <DynamicField key={field.key} field={field} />
                    ))}
                </FieldGroup>
            </CardContent>
        </Card>
    );
}
