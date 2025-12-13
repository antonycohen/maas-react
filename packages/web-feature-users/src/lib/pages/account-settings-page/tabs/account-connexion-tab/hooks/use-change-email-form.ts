import {useForm} from 'react-hook-form';
import {ChangeEmailRequest, changeEmailRequestSchema, ReadUser,} from '@maas/core-api-models';
import {zodResolver} from '@hookform/resolvers/zod';
import {useChangeEmail} from "@maas/core-api";
import {handleApiError} from "@maas/web-form";
import {toast} from "sonner";

export const useChangeEmailForm = (user: ReadUser) => {

  const form = useForm<ChangeEmailRequest>({
    resolver: zodResolver(changeEmailRequestSchema),
    defaultValues: {
      newEmail: '',
    },
    values: {
        newEmail: user.email ?? '',
      }
  });

  const changeEmail = useChangeEmail({
    onSuccess: () => {
      toast.success("Email updated successfully");
    },
    onError: (error) => handleApiError(error, form),
  });

  const handleSubmit = form.handleSubmit((data) => {
    changeEmail.mutate({
      userId: user.id as string,
      data
    })
  });

  return { form, handleSubmit, isLoading: changeEmail.isPending };
};
