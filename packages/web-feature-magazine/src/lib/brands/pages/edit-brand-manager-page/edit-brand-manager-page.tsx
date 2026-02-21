import { useParams } from 'react-router-dom';
import { useTranslation } from '@maas/core-translations';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, FieldGroup } from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Brand } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditBrandForm } from './hooks/use-edit-brand-form';
import { useEditActions } from './hooks/use-edit-actions';
import { useRoutes } from '@maas/core-workspace';

export function EditBrandManagerPage() {
    const { brandId = '' } = useParams<{ brandId: string }>();
    const { t } = useTranslation();

    const { brand, isLoading, form, isCreateMode } = useEditBrandForm(brandId);
    const routes = useRoutes();

    const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(form, isCreateMode, brandId);

    if (!isCreateMode && !isLoading && !brand) {
        return <div>Brand not found</div>;
    }

    const {
        ControlledTextInput,
        ControlledImageInput,
        ControlledTextAreaInput,
        ControlledCheckbox,
        ControlledRatioInput,
        ControlledColorPickerInput,
    } = createConnectedInputHelpers<Brand>();

    const pageTitle = isCreateMode ? t('brands.new') : (brand?.name ?? '');
    const breadcrumbLabel = isCreateMode ? 'New' : (brand?.name ?? '');

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: routes.root() },
                        { label: 'Brands', to: routes.brands() },
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
                                    <CardTitle>{t('brands.brandDetails')}</CardTitle>
                                    <CardDescription>{t('brands.brandDetailsDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <ControlledTextInput name="name" label="Name" />
                                        <ControlledImageInput name="logo" label="Logo" />
                                        <ControlledTextAreaInput name="description" label="Description" />
                                        <ControlledCheckbox name="isActive" label="Active" />
                                    </FieldGroup>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t('brands.issueConfiguration')}</CardTitle>
                                    <CardDescription>{t('brands.issueConfigurationDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <ControlledRatioInput
                                            name="issueConfiguration.coverRatio"
                                            label={t('field.coverRatio')}
                                            placeholder={t('field.placeholder.coverRatio')}
                                        />
                                        <ControlledColorPickerInput
                                            name="issueConfiguration.color"
                                            label={t('field.brandColor')}
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
