import { useParams } from 'react-router';
import { useTranslation } from '@maas/core-translations';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    FieldGroup,
} from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Category } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditCategoryForm } from './hooks/use-edit-category-form';
import { useEditActions } from './hooks/use-edit-actions';
import { useRoutes } from '@maas/core-workspace';

export function EditCategoryManagerPage() {
    const { categoryId = '' } = useParams<{ categoryId: string }>();
    const { t } = useTranslation();
    const routes = useRoutes();

    const { category, isLoading, form, isCreateMode } = useEditCategoryForm(categoryId);

    const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(form, isCreateMode, categoryId);

    if (!isCreateMode && !isLoading && !category) {
        return <div>{t('categories.notFound')}</div>;
    }

    const { ControlledTextInput, ControlledImageInput, ControlledTextAreaInput, ControlledCategoryInput } =
        createConnectedInputHelpers<Category>();

    const pageTitle = isCreateMode ? t('categories.new') : (category?.name ?? '');
    const breadcrumbLabel = isCreateMode ? 'New' : (category?.name ?? '');

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: routes.root() },
                        {
                            label: 'Categories',
                            to: routes.categories(),
                        },
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
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <Card className={cn('transition-opacity', isLoading && 'pointer-events-none opacity-50')}>
                            <CardHeader>
                                <CardTitle>{t('categories.categoryDetails')}</CardTitle>
                                <CardDescription>{t('categories.categoryDetailsDescription')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <FieldGroup>
                                    <ControlledTextInput name="name" label={t('field.name')} />
                                    <ControlledCategoryInput
                                        name="parent"
                                        label={t('field.parentCategory')}
                                        placeholder={t('field.noParent')}
                                    />
                                    <ControlledImageInput name="cover" label={t('field.cover')} ratio={1536 / 1024} />
                                    <ControlledTextAreaInput
                                        name="description"
                                        label={t('field.description')}
                                        maxLength={300}
                                    />
                                </FieldGroup>
                            </CardContent>
                            <CardFooter className="gap-3 border-t pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                    disabled={isLoading}
                                >
                                    {t('common.reset')}
                                </Button>
                                <Button type="submit" disabled={isSaving || isLoading}>
                                    {isSaving
                                        ? t('common.saving')
                                        : isCreateMode
                                          ? t('common.create')
                                          : t('common.save')}
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </FormProvider>
            </LayoutContent>
        </div>
    );
}
