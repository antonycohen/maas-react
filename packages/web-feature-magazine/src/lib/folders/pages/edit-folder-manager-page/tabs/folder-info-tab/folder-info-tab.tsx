import { useOutletContext } from 'react-router';
import { useTranslation } from '@maas/core-translations';
import { FolderFormValues } from '../../hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, ReadonlyCopyField } from '@maas/web-components';
import { publicUrlBuilders } from '@maas/core-routes';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditFolderOutletContext } from '../../edit-folder-manager-page';

export const FolderInfoTab = () => {
    const { t } = useTranslation();
    const { isCreateMode, isLoading, folder } = useOutletContext<EditFolderOutletContext>();

    const { ControlledTextInput, ControlledTextAreaInput, ControlledImageInput, ControlledSwitchInput } =
        createConnectedInputHelpers<FolderFormValues>();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <LayoutContent>
            <Card className="gap-0 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">
                        {isCreateMode ? t('folders.createFolder') : t('folders.folderInformation')}
                    </CardTitle>
                    <CardDescription>
                        {isCreateMode ? t('folders.fillDetails') : t('folders.updateDetails')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-6 pt-2">
                    <div className="flex flex-col divide-y">
                        {!isCreateMode && folder?.slug && (
                            <ReadonlyCopyField
                                label={t('field.slug')}
                                value={folder.slug}
                                copyValue={`${window.location.origin}${publicUrlBuilders.folder(folder.slug)}`}
                                direction="horizontal"
                                className="py-6"
                            />
                        )}
                        <ControlledTextInput
                            name="name"
                            label={t('field.name')}
                            direction="horizontal"
                            className="py-6"
                        />
                        <ControlledTextAreaInput
                            name="description"
                            label={t('field.description')}
                            direction="horizontal"
                            maxLength={300}
                            className="py-6"
                        />
                        <ControlledImageInput
                            name="cover"
                            label={t('field.cover')}
                            direction="horizontal"
                            className="py-6"
                            ratio={1536 / 1024}
                        />
                        <ControlledSwitchInput name="isPublished" label={t('field.published')} className="py-6" />
                    </div>
                </CardContent>
            </Card>
        </LayoutContent>
    );
};
