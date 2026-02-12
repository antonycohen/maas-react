import { ReadUser, UpdateLocalizationPreferences } from '@maas/core-api-models';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle, Field, FieldLabel } from '@maas/web-components';
import { FormProvider, useController } from 'react-hook-form';
import { createConnectedInputHelpers } from '@maas/web-form';
import { useUpdateLocalizationPreferencesForm } from '../hooks/use-update-localization-preferences-form';
import { cn } from '@maas/core-utils';
import { useTranslation } from '@maas/core-translations';

type UpdateLocalizationPreferencesSectionProps = {
    user: ReadUser;
};

const DATE_FORMAT_OPTIONS = [
    { value: 'DD/MM/YYYY', label: '21/12/2025' },
    { value: 'MM/DD/YYYY', label: '12/21/2025' },
];

export const UpdateLocalizationPreferencesSection = ({ user }: UpdateLocalizationPreferencesSectionProps) => {
    const { t } = useTranslation();
    const { form, handleSubmit } = useUpdateLocalizationPreferencesForm(user);

    const LANGUAGE_OPTIONS = [
        { iso2: 'en', label: t('users.english'), flag: '🇬🇧' },
        { iso2: 'fr', label: t('users.french'), flag: '🇫🇷' },
        { iso2: 'es', label: t('users.spanish'), flag: '🇪🇸' },
        { iso2: 'de', label: t('users.german'), flag: '🇩🇪' },
    ];

    const { ControlledLanguageInput } = createConnectedInputHelpers<UpdateLocalizationPreferences>();

    return (
        <FormProvider {...form}>
            <form id="update-localization-preferences-form" onSubmit={handleSubmit}>
                <Card className="rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{t('users.displayPreferences')}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                        <div className="flex flex-col">
                            <ControlledLanguageInput
                                name="localizationPreferences.language"
                                label={t('field.language')}
                                languages={LANGUAGE_OPTIONS}
                                direction="horizontal"
                                className="py-6"
                            />
                            <DateFormatRadioGroup />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-end border-t">
                        <Button type="submit" form="update-localization-preferences-form">
                            {t('common.save')}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </FormProvider>
    );
};

function DateFormatRadioGroup() {
    const { t } = useTranslation();
    const { field } = useController<UpdateLocalizationPreferences>({
        name: 'localizationPreferences.dateFormat',
    });

    return (
        <Field orientation="vertical" className="py-6">
            <FieldLabel className="font-medium">{t('field.dateFormat')}</FieldLabel>
            <div className="flex flex-wrap gap-3">
                {DATE_FORMAT_OPTIONS.map((option) => (
                    <label key={option.value} className="flex cursor-pointer items-start gap-3">
                        <span
                            className={cn(
                                'mt-0.5 size-4 rounded-full border',
                                field.value === option.value
                                    ? 'border-primary bg-primary'
                                    : 'border-border bg-background'
                            )}
                        >
                            {field.value === option.value && (
                                <span className="flex size-full items-center justify-center">
                                    <span className="size-1.5 rounded-full bg-white" />
                                </span>
                            )}
                        </span>
                        <span className="text-sm font-medium">{option.label}</span>
                        <input
                            type="radio"
                            name="dateFormat"
                            value={option.value}
                            checked={field.value === option.value}
                            onChange={() => field.onChange(option.value)}
                            className="sr-only"
                        />
                    </label>
                ))}
            </div>
        </Field>
    );
}
