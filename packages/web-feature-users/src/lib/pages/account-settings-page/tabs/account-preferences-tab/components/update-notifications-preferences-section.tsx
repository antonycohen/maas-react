import { ReadUser, UpdateNotificationsPreferences } from '@maas/core-api-models';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { useUpdateNotificationsPreferencesForm } from '../hooks/use-update-notifications-preferences-form';
import { createConnectedInputHelpers } from '@maas/web-form';
import { useTranslation } from '@maas/core-translations';

type UpdateNotificationsPreferencesSectionProps = {
    user: ReadUser;
};

export const UpdateNotificationsPreferencesSection = ({ user }: UpdateNotificationsPreferencesSectionProps) => {
    const { t } = useTranslation();
    const { form, handleSubmit } = useUpdateNotificationsPreferencesForm(user);

    const NOTIFICATION_OPTIONS = [
        { key: 'notificationsPreferences.channels.products' as const, label: t('users.productUpdates') },
        { key: 'notificationsPreferences.channels.news' as const, label: t('users.newsAndAnnouncements') },
    ];

    const { ControlledSwitchInput } = createConnectedInputHelpers<UpdateNotificationsPreferences>();

    return (
        <FormProvider {...form}>
            <form id="update-notifications-preferences-form" onSubmit={handleSubmit}>
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{t('users.notifications')}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="flex flex-wrap gap-6 py-6">
                            {NOTIFICATION_OPTIONS.map((option) => (
                                <ControlledSwitchInput key={option.key} name={option.key} label={option.label} inline />
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t">
                        <Button type="submit" form="update-notifications-preferences-form">
                            {t('common.save')}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    );
};
