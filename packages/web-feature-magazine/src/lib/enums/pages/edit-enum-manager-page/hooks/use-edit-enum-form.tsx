import { useGetEnumById } from '@maas/core-api';
import { useForm } from 'react-hook-form';
import {
  CreateEnum,
  createEnumSchema,
  UpdateEnum,
  updateEnumSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEditEnumForm = (enumId: string, organizationId: string) => {
  const isCreateMode = enumId === 'new';
  const { data: enumData, isLoading } = useGetEnumById(
    {
      id: enumId,
      fields: {
        id: null,
        name: null,
        values: null,
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const form = useForm<CreateEnum | UpdateEnum>({
    resolver: zodResolver(isCreateMode ? createEnumSchema : updateEnumSchema),
    defaultValues: {
      name: '',
      values: [],
      organization: {
        id: organizationId,
      },
    },
    values:
      !isCreateMode && enumData
        ? {
            name: enumData.name,
            values: enumData.values ?? [],
            organization: {
              id: organizationId
            }
          }
        : undefined,
  });

  return { isCreateMode, enumData, isLoading, form };
};
