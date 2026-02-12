import { ChangePasswordRequest, ReadUser } from '@maas/core-api-models';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { createConnectedInputHelpers } from '@maas/web-form';
import { useChangePasswordForm } from '../hooks/use-change-password-form';
import { useTranslation } from '@maas/core-translations';

const { ControlledPasswordInput } = createConnectedInputHelpers<ChangePasswordRequest>();

type ChangePasswordSectionProps = {
    user: ReadUser;
};

export const ChangePasswordSection = ({ user }: ChangePasswordSectionProps) => {
    const { t } = useTranslation();
    const { form, handleSubmit, isLoading } = useChangePasswordForm(user);

    return (
        <form id="change-password-form" onSubmit={handleSubmit} className="flex flex-col">
            <FormProvider {...form}>
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{t('users.password')}</CardTitle>
                        <CardDescription>{t('users.changePasswordDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ControlledPasswordInput
                            name="currentPassword"
                            label={t('users.currentPassword')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledPasswordInput
                            name="newPassword"
                            label={t('users.newPassword')}
                            direction="horizontal"
                            className="border-t py-6"
                        />
                        <ControlledPasswordInput
                            name="repeatNewPassword"
                            label={t('users.repeatNewPassword')}
                            direction="horizontal"
                            className="border-t py-6"
                        />
                    </CardContent>
                    <CardFooter className="justify-end border-t">
                        <Button type="submit" form="change-password-form" isLoading={isLoading}>
                            {t('common.save')}
                        </Button>
                    </CardFooter>
                </Card>
            </FormProvider>
        </form>
    );
};
