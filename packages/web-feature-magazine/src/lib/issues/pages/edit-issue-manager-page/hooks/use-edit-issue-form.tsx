import { useForm } from 'react-hook-form';
import {
  CreateIssue,
  createIssueSchema,
  Issue,
  UpdateIssue,
  updateIssueSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

type UseEditIssueFormParams = {
  issue: Issue | undefined;
  isCreateMode: boolean;
};

export type IssueFormValues = CreateIssue | UpdateIssue;

export const useEditIssueForm = ({
  issue,
  isCreateMode,
}: UseEditIssueFormParams) => {
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(isCreateMode ? createIssueSchema : updateIssueSchema),
    defaultValues: {
      brand: {
        id: issue?.brand?.id ?? '',
        name: issue?.brand?.name ?? '',
      },
      title: '',
      description: '',
      issueNumber: '',
      cover: issue?.cover,
      pdf: null,
      pageCount: 0,
    },
    values:
      !isCreateMode && issue
        ? {
            brand: {
              id: issue.brand?.id ?? '',
              name: issue?.brand?.name ?? '',
            },
            title: issue.title,
            description: issue.description ?? '',
            issueNumber: issue.issueNumber ?? '',
            cover: issue.cover ?? null,
            publishedAt: issue.publishedAt ?? null,
            isPublished: issue.isPublished ?? false,
            pdf: issue.pdf ?? null,
            pageCount: issue.pageCount ?? 0,
            folders:
              issue.folders?.map((f) => ({
                id: f.id,
                articles: f.articles?.map((a) => ({ id: a.id })) ?? [],
              })) ?? [],
          }
        : undefined,
  });

  return { form };
};
