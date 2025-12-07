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
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const form = useForm<CreateBrand | UpdateBrand>({
    resolver: zodResolver(
      isCreateMode ? createBrandSchema : updateBrandSchema,
    ),
    defaultValues: {
      name: '',
      description: '',
    },
    values:
      !isCreateMode && brand
        ? {
            name: brand.name,
            description: brand.description,
            logo: brand.logo,
            isActive: brand.isActive ?? undefined,
          }
        : undefined,
  });

  return { isCreateMode, brand, isLoading, form };
};
