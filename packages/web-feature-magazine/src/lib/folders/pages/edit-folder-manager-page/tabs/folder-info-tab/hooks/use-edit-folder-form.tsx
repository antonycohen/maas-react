import { useGetFolderById } from '@maas/core-api';
import { useForm } from 'react-hook-form';
import {
  CreateFolder,
  createFolderSchema,
  UpdateFolder,
  updateFolderSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEditFolderForm = (folderId: string, organizationId: string) => {
  const isCreateMode = folderId === 'new';
  const { data: folderData, isLoading } = useGetFolderById(
    {
      id: folderId,
      fields: {
        id: null,
        name: null,
        description: null,
        cover: null,
        isPublished: null,
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const form = useForm<CreateFolder | UpdateFolder>({
    resolver: zodResolver(
      isCreateMode ? createFolderSchema : updateFolderSchema,
    ),
    defaultValues: {
      name: '',
      description: '',
      cover: null,
      isPublished: false,
      organization: {
        id: organizationId,
      },
    },
    values:
      !isCreateMode && folderData
        ? {
            name: folderData.name,
            description: folderData.description ?? '',
            cover: folderData.cover ?? null,
            isPublished: folderData.isPublished ?? false,
          }
        : undefined,
  });

  return { isCreateMode, folderData, isLoading, form };
};
