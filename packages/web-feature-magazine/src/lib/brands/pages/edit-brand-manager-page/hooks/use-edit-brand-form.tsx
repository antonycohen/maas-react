import { useGetBrandById } from '@maas/core-api';
import { useForm } from 'react-hook-form';
import {
  CreateBrand,
  createBrandSchema,
  UpdateBrand,
  updateBrandSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEditBrandForm = (brandId: string) => {
  const isCreateMode = brandId === 'new';
  const { data: brand, isLoading } = useGetBrandById(
    {
      id: brandId,
      fields: {
        id: null,
        name: null,
        description: null,
        logo: null,
        isActive: null,
        issueConfiguration: { fields: { defaultFolders: null, coverRatio: null, color: null } },
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const form = useForm<CreateBrand | UpdateBrand>({
    resolver: zodResolver(isCreateMode ? createBrandSchema : updateBrandSchema),
    defaultValues: {
      name: '',
      description: '',
      isActive: null,
      issueConfiguration: {
        defaultFolders: brand?.issueConfiguration?.defaultFolders ?? null,
        coverRatio: brand?.issueConfiguration?.coverRatio ?? '',
        color: brand?.issueConfiguration?.color ?? '',
      },
    },
    values:
      !isCreateMode && brand
        ? {
            name: brand.name,
            description: brand.description,
            logo: brand.logo,
            isActive: brand.isActive ?? undefined,
            issueConfiguration: {
              defaultFolders: brand?.issueConfiguration?.defaultFolders ?? null,
              coverRatio: brand?.issueConfiguration?.coverRatio ?? '',
              color: brand?.issueConfiguration?.color ?? '',
            },
          }
        : undefined,
  });

  return { isCreateMode, brand, isLoading, form };
};
