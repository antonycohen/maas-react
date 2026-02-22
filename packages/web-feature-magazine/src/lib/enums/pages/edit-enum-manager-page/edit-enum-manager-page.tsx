import { useParams } from 'react-router';
import { useTranslation } from '@maas/core-translations';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FieldGroup } from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Enum } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditEnumForm } from './hooks/use-edit-enum-form';
import { useEditActions } from './hooks/use-edit-actions';
import { useRoutes, useGetCurrentWorkspaceId } from '@maas/core-workspace';

export function EditEnumManagerPage() {
    const { enumId = '' } = useParams<{ enumId: string }>();
    const { t } = useTranslation();

    const workspaceId = useGetCurrentWorkspaceId();
    const { enumData, isLoading, form, isCreateMode } = useEditEnumForm(enumId, workspaceId as string);
    const routes = useRoutes();

    const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(form, isCreateMode, enumId);

    if (!isCreateMode && !isLoading && !enumData) {
        return <div>{t('enums.notFound')}</div>;
    }

    const { ControlledTextInput, ControlledSlugValueArrayInput } = createConnectedInputHelpers<Enum>();

    const pageTitle = isCreateMode ? t('enums.new') : (enumData?.name ?? '');
    const breadcrumbLabel = isCreateMode ? 'New' : (enumData?.name ?? '');

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: routes.root() },
                        { label: 'Enums', to: routes.enums() },
                        { label: breadcrumbLabel },
                    ]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={pageTitle}
                    actions={
                        !isCreateMode && (
                            <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
                                <IconTrash className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        )
                    }
                />
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className={cn('space-y-6 transition-opacity', isLoading && 'pointer-events-none opacity-50')}
                    >
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('enums.enumDetails')}</CardTitle>
                                    <CardDescription>{t('enums.enumDetailsDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <ControlledTextInput name="name" label="Name" />
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('enums.enumValues')}</CardTitle>
                                    <CardDescription>{t('enums.enumValuesDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <ControlledSlugValueArrayInput
                                            name="values"
                                            label={t('field.values')}
                                            slugPath="value"
                                            valuePath="label"
                                            valueLabel={t('field.label')}
                                            valuePlaceholder={t('field.placeholder.enumLabel')}
                                        />
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" variant="outline" onClick={() => form.reset()} disabled={isLoading}>
                                {t('common.reset')}
                            </Button>
                            <Button type="submit" disabled={isSaving || isLoading}>
                                {isSaving ? t('common.saving') : isCreateMode ? t('common.create') : t('common.save')}
                            </Button>
                        </div>
                    </form>
                </FormProvider>
            </LayoutContent>
        </div>
    );
}
