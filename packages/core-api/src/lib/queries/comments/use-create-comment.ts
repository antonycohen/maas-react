import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { CreateComment, ReadComment } from '@maas/core-api-models';
import { ApiError, maasApi } from '../../api';

export const createComment = async (data: CreateComment): Promise<ReadComment> => {
    return await maasApi.comments.createComment(data);
};

export const useCreateComment = (
    options?: Omit<UseMutationOptions<ReadComment, ApiError, CreateComment>, 'mutationFn'>
) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};

    return useMutation({
        mutationFn: createComment,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            onSuccess?.(...args);
        },
        ...restOptions,
    });
};
