import { useForm } from 'react-hook-form';
import { ReadUser, UpdateNotificationsPreferences, updateNotificationsPreferencesSchema } from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUser } from '@maas/core-api';
import { handleApiError } from '@maas/web-form';
import { toast } from 'sonner';

export const useUpdateNotificationsPreferencesForm = (user: ReadUser) => {
    const form = useForm<UpdateNotificationsPreferences>({
        resolver: zodResolver(updateNotificationsPreferencesSchema),
        defaultValues: {
            notificationsPreferences: {
                channels: {
                    products: false,
                    news: false,
                },
            },
        },
        values: {
            notificationsPreferences: {
                channels: {
                    products: user.notificationsPreferences?.channels?.products ?? false,
                    news: user.notificationsPreferences?.channels?.news ?? false,
                },
            },
        },
    });

    const updateNotificationPreferences = useUpdateUser({
        onSuccess: () => {
            toast.success('Notification preferences updated');
        },
        onError: (error) => handleApiError(error, form),
    });

    const handleSubmit = form.handleSubmit((data) => {
        updateNotificationPreferences.mutate({
            userId: user.id as string,
            data,
        });
    });

    return { form, handleSubmit };
};
