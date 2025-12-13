import {useForm} from 'react-hook-form';
import {ReadUser, UpdateUserInfo, updateUserInfoSchema,} from '@maas/core-api-models';
import {zodResolver} from '@hookform/resolvers/zod';
import {useDeleteUser, useUpdateUser} from "@maas/core-api";
import {handleApiError} from "@maas/web-form";
import {toast} from "sonner";

export const useAccountProfileForm = (user?: ReadUser) => {
  const form = useForm<UpdateUserInfo>({
    resolver: zodResolver(updateUserInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      profileImage: null,
    },
    values: user
      ? {
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        profileImage: user.profileImage
      }
      : undefined,
  });

  const updateUser = useUpdateUser({
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => handleApiError(error, form),
  });

  const deleteUser = useDeleteUser({
    onSuccess: () => {
      toast.success("Account deleted successfully");
    },
    onError: (error) => handleApiError(error, form),
  })

  const handleDeleteAccount = () => {
    if (!user) return;
    deleteUser.mutate({ userId: user.id as string });
  }


  const handleSubmit = form.handleSubmit((data: UpdateUserInfo) => {
    if (!user) return;
    updateUser.mutate({
      userId: user.id as string,
      data,
    })
  });

  return { form, handleSubmit, handleDeleteAccount, isUpdating: updateUser.isPending, isDeleting: deleteUser.isPending };
};
