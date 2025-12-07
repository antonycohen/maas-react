import { useGetIssueById } from '@maas/core-api';
import { useForm } from 'react-hook-form';
import {
  CreateIssue,
  createIssueSchema,
  UpdateIssue,
  updateIssueSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

export const useEditIssueForm = (issueId: string) => {
  const isCreateMode = issueId === 'new';
  const { data: issue, isLoading } = useGetIssueById(
    {
      id: issueId,
      fields: {
        id: null,
        title: null,
        description: null,
        cover: null,
        brand: {
          fields: {
            id: null,
            name: null,
            issueConfiguration: null,
          },
        },
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const form = useForm<CreateIssue | UpdateIssue>({
    resolver: zodResolver(isCreateMode ? createIssueSchema : updateIssueSchema),
    defaultValues: {},
    values:
      !isCreateMode && issue
        ? {
            title: issue.title,
            description: issue.description,
            cover: issue.cover,
          }
        : undefined,
  });

  return { isCreateMode, issue, isLoading, form };
};
