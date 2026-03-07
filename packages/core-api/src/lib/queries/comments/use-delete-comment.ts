import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { ApiError, maasApi } from '../../api';

export const deleteComment = async (commentId: string): Promise<void> => {
    return await maasApi.comments.deleteComment(commentId);
};

export const useDeleteComment = (options?: Omit<UseMutationOptions<void, ApiError, string>, 'mutationFn'>) => {
    const queryClient = useQueryClient();
    const { onSuccess, ...restOptions } = options ?? {};

    return useMutation({
        mutationFn: deleteComment,
        onSuccess: (...args) => {
            queryClient.invalidateQueries({ queryKey: ['comments'] });
            onSuccess?.(...args);
        },
        ...restOptions,
    });
};
