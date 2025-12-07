import { useGetCategoryById } from '@maas/core-api';
import { useForm } from 'react-hook-form';
import {
  CreateCategory,
  createCategorySchema,
  UpdateCategory,
  updateCategorySchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEditCategoryForm = (categoryId: string) => {
  const isCreateMode = categoryId === 'new';
  const { data: category, isLoading } = useGetCategoryById(
    {
      id: categoryId,
      fields: {
        id: null,
        name: null,
        description: null,
        cover: null,
        parent: {
          fields: {
            id: null,
            name: null,
          },
        },
        childrenCount: null,
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const form = useForm<CreateCategory | UpdateCategory>({
    resolver: zodResolver(
      isCreateMode ? createCategorySchema : updateCategorySchema,
    ),
    defaultValues: {
      name: '',
      description: '',
      parent: null,
    },
    values:
      !isCreateMode && category
        ? {
            name: category.name,
            description: category.description,
            cover: category.cover,
            parent: category.parent?.id
              ? {
                  id: category.parent.id,
                }
              : null,
          }
        : undefined,
  });

  return { isCreateMode, category, isLoading, form };
};
