import { useOutletContext } from 'react-router';
import { useTranslation } from '@maas/core-translations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ReadonlyCopyField } from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { useGetBrandById } from '@maas/core-api';
import { EditIssueOutletContext } from '../../edit-issue-manager-page';
import { IssueFormValues } from '../../hooks';
import { parseRatio } from '@maas/core-utils';

export const IssueInfoTab = () => {
    const { t } = useTranslation();
    const { isCreateMode, isLoading, form, issue } = useOutletContext<EditIssueOutletContext>();

    const brandRef = form.watch('brand');

    // Fetch brand configuration when brand is selected
    const { data: brand } = useGetBrandById(
        {
            id: brandRef?.id ?? '',
            fields: {
                id: null,
                issueConfiguration: {
                    fields: {
                        coverRatio: null,
                    },
                },
            },
        },
        {
            enabled: !!brandRef?.id,
        }
    );

    const coverRatio = parseRatio(brand?.issueConfiguration?.coverRatio);

    const {
        ControlledTextInput,
        ControlledTextAreaInput,
        ControlledImageInput,
        ControlledSwitchInput,
        ControlledDateInput,
        ControlledMagazineBrandInput,
    } = createConnectedInputHelpers<IssueFormValues>();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <LayoutContent>
            <Card className="gap-0 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {isCreateMode ? t('issues.createIssue') : t('issues.issueInformation')}
                    </CardTitle>
                    <CardDescription>
                        {isCreateMode ? t('issues.fillDetails') : t('issues.updateDetails')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-2">
                    <div className="flex flex-col divide-y">
                        {!isCreateMode && issue?.slug && (
                            <ReadonlyCopyField
                                label={t('field.slug')}
                                value={issue.slug}
                                direction="horizontal"
                                className="py-6"
                            />
                        )}
                        <ControlledMagazineBrandInput
                            name="brand"
                            label={t('field.brand')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledTextInput
                            name="title"
                            label={t('field.title')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledTextAreaInput
                            name="description"
                            label={t('field.description')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledTextInput
                            name="issueNumber"
                            label={t('field.issueNumber')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledImageInput
                            name="cover"
                            label={t('field.cover')}
                            direction="horizontal"
                            className="py-6"
                            ratio={coverRatio}
                        />
                        {!isCreateMode && (
                            <>
                                <ControlledDateInput
                                    name="publishedAt"
                                    label={t('field.publishedAt')}
                                    direction="horizontal"
                                    className="py-6"
                                />
                                <ControlledSwitchInput
                                    name="isPublished"
                                    label={t('field.published')}
                                    className="py-6"
                                />
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </LayoutContent>
    );
};
