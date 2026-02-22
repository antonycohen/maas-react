import { useOutletContext } from 'react-router';
import { EditUserOutletContext } from '../../types';
import { FormProvider } from 'react-hook-form';
import { Button } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { UpdateUserInfo } from '@maas/core-api-models';
import { useAccountProfileForm } from './hooks/use-account-profile-form';
import { useTranslation } from '@maas/core-translations';

export const AccountProfileTab = () => {
    const { t } = useTranslation();
    const { user, isLoading } = useOutletContext<EditUserOutletContext>();

    const { form, handleSubmit, isUpdating } = useAccountProfileForm(user);

    const { ControlledTextInput, ControlledImageInput } = createConnectedInputHelpers<UpdateUserInfo>();

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }

    const inputClassName =
        '[&_label]:uppercase [&_label]:text-[11px] [&_label]:font-semibold [&_label]:tracking-[0.33px] [&_label]:text-gray-500 [&_label]:mb-1 [&_input]:bg-[#f5f5f5] [&_input]:border-[#e0e0e0] [&_input]:h-[40px] [&_input]:rounded [&_input]:px-3 [&_input]:text-sm';

    return (
        <div className="flex flex-col gap-10">
            <h1 className="font-barlow-semi-condensed text-5xl font-semibold tracking-tight">
                <span className="text-[#e31b22]">{t('users.welcome')}</span>
                <span> {user.firstName}</span>
            </h1>

            <FormProvider {...form}>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-6 rounded-[20px] border border-gray-200 bg-white p-10">
                        <div className="flex flex-col gap-4">
                            <h2 className="font-barlow-semi-condensed text-2xl font-semibold">
                                {t('users.generalInformation')}
                            </h2>
                            <p className="text-sm text-gray-500">
                                Contrary to popular belief, Lorem Ipsum is not simply random text.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4">
                            <ControlledImageInput
                                name="profileImage"
                                label={t('users.profilePhoto')}
                                direction="horizontal"
                                className="py-2"
                            />

                            <div className="flex gap-5">
                                <div className="flex-1">
                                    <ControlledTextInput
                                        name="lastName"
                                        label={t('users.lastName')}
                                        placeholder={t('users.lastNamePlaceholder')}
                                        className={inputClassName}
                                    />
                                </div>
                                <div className="flex-1">
                                    <ControlledTextInput
                                        name="firstName"
                                        label={t('users.firstName')}
                                        placeholder={t('users.firstNamePlaceholder')}
                                        className={inputClassName}
                                    />
                                </div>
                            </div>

                            <div className="w-full">
                                <div className="flex flex-col gap-1">
                                    <label className="mb-1 text-[11px] font-semibold tracking-wider text-gray-500 uppercase">
                                        {t('field.email')}
                                    </label>
                                    <div className="flex h-[40px] w-full items-center rounded border border-[#e0e0e0] bg-[#f5f5f5] px-3 py-2 text-sm text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <Button type="submit" isLoading={isUpdating}>
                                {t('common.save')}
                            </Button>
                        </div>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
