import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from '@tanstack/react-query';
import { Issue, UpdateIssue } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export type UpdateIssueParams = {
  issueId: string;
  data: UpdateIssue;
};

export const updateIssue = async (
  params: UpdateIssueParams,
): Promise<Issue> => {
  return await maasApi.issues.patchIssue(params.issueId, params.data);
};

export const useUpdateIssue = (
  options?: Omit<
    UseMutationOptions<Issue, ApiError, UpdateIssueParams>,
    'mutationFn'
  >,
) => {
  const { onSuccess, ...restOptions } = options || {};

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateIssue,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      queryClient.invalidateQueries({
        queryKey: ['issue', variables.issueId],
      });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
