import { useGetIssueById } from '@maas/core-api';
import { useEditIssueContext } from '../context';

export function useIssueData() {
  const { issueId, isCreateMode } = useEditIssueContext();

  const { data: issue, isLoading } = useGetIssueById(
    {
      id: issueId,
      fields: {
        id: null,
        title: null,
        description: null,
        issueNumber: null,
        isPublished: null,
        brand: { fields: { id: null, name: null } },
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  return {
    issue: isCreateMode ? null : issue,
    isLoading: isCreateMode ? false : isLoading,
  };
}
