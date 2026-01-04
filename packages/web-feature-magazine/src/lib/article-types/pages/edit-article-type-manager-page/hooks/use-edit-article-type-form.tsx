import { useGetArticleTypeById } from '@maas/core-api';
import { useForm } from 'react-hook-form';
import {
  CreateArticleType,
  createArticleTypeSchema,
  UpdateArticleType,
  updateArticleTypeSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEditArticleTypeForm = (
  articleTypeId: string,
  organizationId: string,
) => {
  const isCreateMode = articleTypeId === 'new';
  const { data: articleTypeData, isLoading } = useGetArticleTypeById(
    {
      id: articleTypeId,
      fields: {
        id: null,
        name: null,
        fields: {
          fields: {
            type: null,
            key: null,
            enum: null,
            label: null,
            category: null,
            isList: null,
            validators: null,
          }
        },
        isActive: null,
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const form = useForm<CreateArticleType | UpdateArticleType>({
    resolver: zodResolver(
      isCreateMode ? createArticleTypeSchema : updateArticleTypeSchema,
    ),
    defaultValues: {
      name: '',
      fields: [],
      isActive: true,
      organization: {
        id: organizationId,
      },
    },
    values:
      !isCreateMode && articleTypeData
        ? {
            name: articleTypeData.name,
            fields: articleTypeData.fields ?? [],
            isActive: articleTypeData.isActive ?? true,
            organization: {
              id: organizationId,
            },
          }
        : undefined,
  });

  return { isCreateMode, articleTypeData, isLoading, form };
};
