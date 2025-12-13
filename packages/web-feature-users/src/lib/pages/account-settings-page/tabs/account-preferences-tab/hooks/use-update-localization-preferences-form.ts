import {useForm} from 'react-hook-form';
import {ReadUser, UpdateLocalizationPreferences, updateLocalizationPreferencesSchema,} from '@maas/core-api-models';
import {zodResolver} from '@hookform/resolvers/zod';
import {useUpdateUser} from "@maas/core-api";
import {handleApiError} from "@maas/web-form";
import {toast} from "sonner";

export const useUpdateLocalizationPreferencesForm = (user: ReadUser) => {
  const form = useForm<UpdateLocalizationPreferences>({
    resolver: zodResolver(updateLocalizationPreferencesSchema),
    defaultValues: {
      localizationPreferences: {
        language: null,
        dateFormat: null,
      }
    },
    values: {
      localizationPreferences: {
        language: user.localizationPreferences?.language ?? 'en',
        dateFormat: user.localizationPreferences?.dateFormat ?? 'dd/mm/yyyy',
        timezone: null,
      }
    }
  });

  const updateLocalizationPreferences = useUpdateUser({
    onSuccess: () => {
      toast.success("Localization preferences updated");
    },
    onError: (error) => handleApiError(error, form),
  });

  const handleSubmit = form.handleSubmit((data) => {
    updateLocalizationPreferences.mutate({
      userId: user.id as string,
      data
    })
  });

  return { form, handleSubmit };
};
