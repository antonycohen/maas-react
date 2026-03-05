import { ReadUser, UpdateUserInfo } from '@maas/core-api-models';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { createConnectedInputHelpers } from '@maas/web-form';
import { useAccountProfileForm } from '../../account-profile-tab/hooks/use-account-profile-form';
import { useTranslation } from '@maas/core-translations';

type ProfileNameSectionProps = {
    user: ReadUser;
};

const { ControlledTextInput } = createConnectedInputHelpers<UpdateUserInfo>();

export const ProfileNameSection = ({ user }: ProfileNameSectionProps) => {
    const { t } = useTranslation();
    const { form, handleSubmit, isUpdating } = useAccountProfileForm(user);

    return (
        <form id="profile-name-form" onSubmit={handleSubmit}>
            <FormProvider {...form}>
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{t('users.generalInformation')}</CardTitle>
                        <CardDescription>{t('users.generalInformationDescription')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ControlledTextInput
                            name="lastName"
                            label={t('users.lastName')}
                            placeholder={t('users.lastNamePlaceholder')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledTextInput
                            name="firstName"
                            label={t('users.firstName')}
                            placeholder={t('users.firstNamePlaceholder')}
                            direction="horizontal"
                            className="border-t py-6"
                        />
                    </CardContent>
                    <CardFooter className="justify-end border-t">
                        <Button type="submit" form="profile-name-form" isLoading={isUpdating}>
                            {t('common.save')}
                        </Button>
                    </CardFooter>
                </Card>
            </FormProvider>
        </form>
    );
};
