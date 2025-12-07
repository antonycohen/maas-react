import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { Issue, CreateIssue } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createIssue = async (data: CreateIssue): Promise<Issue> => {
  return await maasApi.issues.createIssue(data);
};

export const useCreateIssue = (
  options?: Omit<UseMutationOptions<Issue, ApiError, CreateIssue>, 'mutationFn'>
) => {
  const { onSuccess, ...restOptions } = options || {};
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createIssue,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ['issues'] });
      onSuccess?.(data, variables, onMutateResult, context);
    },
    ...restOptions,
  });
};
