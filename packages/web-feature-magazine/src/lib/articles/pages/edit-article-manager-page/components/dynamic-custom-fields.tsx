import { useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useGetArticleTypeById, useGetEnumById } from '@maas/core-api';
import {
  Article,
  ArticleType,
  ArticleTypeField,
  ReadArticleTypeRef,
} from '@maas/core-api-models';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  FieldGroup,
  Skeleton,
} from '@maas/web-components';
import { camelize } from '@nx/devkit/src/utils/string-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { editorPlugins } from '../edit-article-manager-page';

type DynamicFieldProps = {
  field: ArticleTypeField;
};

const {
  ControlledTextInput,
  ControlledTextAreaInput,
  ControlledSelectInput,
  ControlledCategoryInput,
  ControlledCMSInput,
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
    },
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

function DynamicField({ field }: DynamicFieldProps) {
  const fieldName = `customFields.${camelize(field.key)}` as keyof Article;

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
          placeholder="Enter a number..."
        />
      );

    case 'enum':
      return <DynamicEnumField field={field} />;

    case 'category':
      return <ControlledCategoryInput name={fieldName} label={field.label} />;

    case 'cms':
      return (
        <ControlledCMSInput
          name={fieldName}
          label={field.label}
          plugins={editorPlugins}
        />
      );

    default:
      return null;
  }
}

function initCustomFields(articleType: ArticleType): Record<string, unknown> {
  const fields: Record<string, unknown> = {};
  if (articleType?.fields) {
    articleType.fields.forEach((field) => {
      switch (field.type) {
        case 'text':
        case 'string':
          fields[field.key] = field.isList ? [] : '';
          break;
        case 'number':
          fields[field.key] = field.isList ? [] : null;
          break;
        case 'enum':
        case 'category':
        case 'cms':
          fields[field.key] = field.isList ? [] : null;
          break;
        default:
          fields[field.key] = null;
          break;
      }
    });
  }
  return fields;
}

export function DynamicCustomFields() {
  const { control, setValue, getValues } = useFormContext<Article>();
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
    },
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
          <CardTitle>Custom Fields</CardTitle>
          <CardDescription>Loading field definitions...</CardDescription>
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
        <CardTitle>Custom Fields</CardTitle>
        <CardDescription>
          Fields defined by the article type "{articleTypeData?.name}".
        </CardDescription>
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
