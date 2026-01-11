import { useForm } from 'react-hook-form';
import {
  CreateFolder,
  createFolderSchema,
  Folder,
  UpdateFolder,
  updateFolderSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

type UseEditFolderFormParams = {
  folder: Folder | undefined;
  isCreateMode: boolean;
  organizationId: string;
};

export type FolderFormValues = CreateFolder | UpdateFolder;

export const useEditFolderForm = ({
  folder,
  isCreateMode,
  organizationId,
}: UseEditFolderFormParams) => {
  const form = useForm<FolderFormValues>({
    resolver: zodResolver(
      isCreateMode ? createFolderSchema : updateFolderSchema,
    ),
    defaultValues: {
      name: '',
      description: '',
      cover: folder?.cover ?? null,
      isPublished: false,
      articles: [],
      organization: {
        id: organizationId,
      },
    },
    values:
      !isCreateMode && folder
        ? {
            name: folder.name,
            description: folder.description ?? '',
            cover: folder.cover ?? null,
            isPublished: folder.isPublished ?? false,
            articles: folder.articles?.map((a) => ({ id: a.id })) ?? [],
          }
        : undefined,
  });

  return { form };
};
