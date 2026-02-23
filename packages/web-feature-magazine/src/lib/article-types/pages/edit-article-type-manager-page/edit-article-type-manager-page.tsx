import { useParams } from 'react-router';
import { useTranslation } from '@maas/core-translations';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ConfirmActionDialog,
    FieldGroup,
} from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { ArticleType } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditArticleTypeForm } from './hooks/use-edit-article-type-form';
import { useEditActions } from './hooks/use-edit-actions';
import { FieldsList } from './components';
import { useRoutes, useGetCurrentWorkspaceId } from '@maas/core-workspace';

export function EditArticleTypeManagerPage() {
    const { articleTypeId = '' } = useParams<{ articleTypeId: string }>();
    const { t } = useTranslation();
    const workspaceId = useGetCurrentWorkspaceId() as string;

    const { articleTypeData, isLoading, form, isCreateMode } = useEditArticleTypeForm(articleTypeId, workspaceId);
    const routes = useRoutes();

    const { deleteMutation, handleDelete, confirmDelete, deleteDialogOpen, setDeleteDialogOpen, isSaving, onSubmit } =
        useEditActions(form, isCreateMode, articleTypeId);

    if (!isCreateMode && !isLoading && !articleTypeData) {
        return <div>{t('articleTypes.notFound')}</div>;
    }

    const { ControlledTextInput, ControlledCheckbox } = createConnectedInputHelpers<ArticleType>();

    const pageTitle = isCreateMode ? t('articleTypes.new') : (articleTypeData?.name ?? '');
    const breadcrumbLabel = isCreateMode ? 'New' : (articleTypeData?.name ?? '');

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: routes.root() },
                        { label: 'Article Types', to: routes.articleTypes() },
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
                                    <CardTitle>{t('articleTypes.articleTypeDetails')}</CardTitle>
                                    <CardDescription>{t('articleTypes.articleTypeDetailsDescription')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <FieldGroup>
                                        <ControlledTextInput name="name" label={t('field.name')} />
                                        <ControlledCheckbox name="isActive" label={t('field.active')} />
                                    </FieldGroup>
                                    <FieldsList />
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

            <ConfirmActionDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title={t('message.confirm.delete', { entity: t('articleTypes.title') })}
                description={t('message.confirm.deleteDescription')}
                confirmLabel={t('common.delete')}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
