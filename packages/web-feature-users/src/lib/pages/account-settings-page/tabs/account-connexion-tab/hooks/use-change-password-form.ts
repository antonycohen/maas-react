import {useForm} from 'react-hook-form';
import {ChangePasswordRequest, changePasswordRequestSchema, ReadUser,} from '@maas/core-api-models';
import {zodResolver} from '@hookform/resolvers/zod';
import {useChangePassword} from "@maas/core-api";
import {handleApiError} from "@maas/web-form";
import {toast} from "sonner";

export const useChangePasswordForm = (user: ReadUser) => {
  const form = useForm<ChangePasswordRequest>({
    resolver: zodResolver(changePasswordRequestSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      repeatNewPassword: '',
    },
  });

  const changePassword = useChangePassword({
    onSuccess: () => {
      toast.success("Password changed successfully");
      form.reset();
    },
    onError: (error) => handleApiError(error, form),
  });


  const handleSubmit = form.handleSubmit((data) => {
    changePassword.mutate({
      userId: user.id as string,
      data
    })
  });

  return {form, handleSubmit, isLoading: changePassword.isPending};
};
