import { Badge, Button, ConfirmActionDialog, TabNavLinks } from '@maas/web-components';
import { useTranslation } from '@maas/core-translations';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router';
import { useGetFolderById } from '@maas/core-api';
import { useRoutes, useGetCurrentWorkspaceId } from '@maas/core-workspace';
import { type WorkspaceRoutes } from '@maas/core-routes';
import { useState } from 'react';
import { Folder } from '@maas/core-api-models';
import { FormProvider, UseFormReturn } from 'react-hook-form';
import { FolderFormValues, useEditFolderActions, useEditFolderForm } from './hooks';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';

const getTabItems = (routes: WorkspaceRoutes, folderId: string, t: (key: string) => string) => {
    return [
        { title: t('common.info'), url: routes.folderInfo(folderId) },
        { title: t('articles.title'), url: routes.folderArticles(folderId) },
    ];
};

export type EditFolderOutletContext = {
    folderId: string;
    isCreateMode: boolean;
    folder: Folder | undefined;
    isLoading: boolean;
    refetchFolder: () => void;
    // Form
    form: UseFormReturn<FolderFormValues>;
    // Selection state
    selectedArticleId: string | null;
    setSelectedArticleId: (id: string | null) => void;
    // Modal state
    addArticleModalOpen: boolean;
    setAddArticleModalOpen: (open: boolean) => void;
};

export function EditFolderManagerPage() {
    const { folderId = '' } = useParams<{ folderId: string }>();
    const isCreateMode = folderId === 'new';
    const routes = useRoutes();
    const { t } = useTranslation();
    const workspaceId = useGetCurrentWorkspaceId();

    // Selection state
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    // Modal state
    const [addArticleModalOpen, setAddArticleModalOpen] = useState(false);

    // Data fetching - include articles
    const {
        data: folder,
        isLoading,
        refetch: refetchFolder,
    } = useGetFolderById(
        {
            id: folderId,
            fields: {
                id: null,
                slug: null,
                name: null,
                description: null,
                cover: null,
                isPublished: null,
                issues: {
                    fields: {
                        id: null,
                        title: null,
                    },
                },
                articles: {
                    fields: {
                        id: null,
                        title: null,
                        description: null,
                        type: null,
                        isPublished: null,
                    },
                },
            },
        },
        {
            enabled: !isCreateMode,
        }
    );

    // Form
    const { form } = useEditFolderForm({
        folder,
        isCreateMode,
        organizationId: workspaceId as string,
    });

    // Actions
    const { onSubmit, handleDelete, confirmDelete, deleteDialogOpen, setDeleteDialogOpen, isSaving, deleteMutation } =
        useEditFolderActions(form, isCreateMode, folderId);

    const isPublished = form.watch('isPublished');
    const pageTitle = isCreateMode ? 'New Folder' : (folder?.name ?? '');

    if (!isCreateMode && isLoading) {
        return <div className="flex h-screen items-center justify-center">{t('common.loading')}</div>;
    }

    if (!isCreateMode && !isLoading && !folder) {
        return <div className="flex h-screen items-center justify-center">{t('folders.notFound')}</div>;
    }

    const breadcrumbLabel = isCreateMode ? 'New' : (folder?.name ?? '');

    const outletContext: EditFolderOutletContext = {
        folderId,
        isCreateMode,
        folder,
        isLoading,
        refetchFolder,
        form,
        selectedArticleId,
        setSelectedArticleId,
        addArticleModalOpen,
        setAddArticleModalOpen,
    };

    return (
        <FormProvider {...form}>
            <form
                id="folder-form"
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex h-[calc(100vh-4rem)] flex-col"
            >
                <header className="shrink-0">
                    <LayoutBreadcrumb
                        items={[
                            { label: t('common.home'), to: routes.root() },
                            { label: t('folders.title'), to: routes.folders() },
                            { label: breadcrumbLabel },
                        ]}
                    />
                </header>

                {/* Sticky Action Bar */}
                <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                    <div className="flex items-center gap-3">
                        <h1 className="max-w-md truncate text-xl font-semibold">{pageTitle || 'Untitled'}</h1>
                        <div className="flex items-center gap-2">
                            {isPublished ? (
                                <Badge variant="default">{t('status.published')}</Badge>
                            ) : (
                                <Badge variant="secondary">{t('status.draft')}</Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isCreateMode && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={deleteMutation.isPending}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <IconTrash className="mr-1.5 h-4 w-4" />
                                {t('common.delete')}
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => form.reset()}
                            disabled={isLoading || !form.formState.isDirty}
                        >
                            {t('common.discard')}
                        </Button>
                        <Button type="submit" size="sm" disabled={isSaving || isLoading}>
                            {isSaving ? (
                                <>
                                    <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    {t('common.saving')}
                                </>
                            ) : (
                                <>
                                    <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                                    {isCreateMode ? t('common.create') : t('common.save')}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
                <TabNavLinks items={getTabItems(routes, folderId, t)} />

                <Outlet context={outletContext} />
            </form>

            <ConfirmActionDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
                title={t('message.confirm.delete', { entity: t('folders.title') })}
                description={t('message.confirm.deleteDescription')}
                confirmLabel={t('common.delete')}
                isLoading={deleteMutation.isPending}
            />
        </FormProvider>
    );
}
