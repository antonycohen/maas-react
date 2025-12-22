import {
  useCreateIssue,
  useGetIssueById,
  useUpdateIssue,
} from '@maas/core-api';
import { useForm } from 'react-hook-form';
import {
  CreateIssue,
  createIssueSchema,
  UpdateIssue,
  updateIssueSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { handleApiError } from '@maas/web-form';
import { useNavigate } from 'react-router-dom';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export const useEditIssueForm = (issueId: string) => {
  const currentWorkspaceUrl = useCurrentWorkspaceUrlPrefix();
  const navigate = useNavigate();
  const isCreateMode = issueId === 'new';
  const { data: issue, isLoading } = useGetIssueById(
    {
      id: issueId,
      fields: {
        id: null,
        title: null,
        description: null,
        issueNumber: null,
        cover: null,
        publishedAt: null,
        isPublished: null,
        pdf: null,
        pageCount: null,
        brand: {
          fields: {
            id: null,
            name: null,
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
    defaultValues: {
      title: '',
      description: '',
      issueNumber: '',
      cover: null,
      pdf: null,
      pageCount: 0,
      ...(isCreateMode ? { brand: null } : {}),
    },
    values:
      !isCreateMode && issue
        ? {
            title: issue.title,
            description: issue.description,
            issueNumber: issue.issueNumber,
            cover: issue.cover,
            publishedAt: issue.publishedAt,
            isPublished: issue.isPublished ?? undefined,
            pdf: issue.pdf,
            pageCount: issue.pageCount ?? undefined,
          }
        : undefined,
  });

  const createIssue = useCreateIssue({
    onSuccess: (data) => {
      toast.success('Issue created successfully');
      console.log(data)
      navigate(`${currentWorkspaceUrl}/issues/${data.id}/info`);
    },
    onError: (error) => handleApiError(error, form),
  });

  const updateIssue = useUpdateIssue({
    onSuccess: () => {
      toast.success('Issue updated successfully');
    },
    onError: (error) => handleApiError(error, form),
  });

  const handleSubmit = form.handleSubmit((data: CreateIssue | UpdateIssue) => {
    if (isCreateMode) {
      createIssue.mutate(data as CreateIssue);
    } else {
      updateIssue.mutate({
        issueId,
        data: data as UpdateIssue,
      });
    }
  });

  return {
    isCreateMode,
    issue,
    isLoading,
    form,
    handleSubmit,
    isPending: createIssue.isPending || updateIssue.isPending,
  };
};
