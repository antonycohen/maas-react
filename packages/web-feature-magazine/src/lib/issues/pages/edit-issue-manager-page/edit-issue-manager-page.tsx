import { Badge, Button, TabNavLinks } from '@maas/web-components';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { Outlet, useParams } from 'react-router';
import { useGetIssueById } from '@maas/core-api';
import { useRoutes } from '@maas/core-workspace';
import { type WorkspaceRoutes } from '@maas/core-routes';
import { useTranslation } from '@maas/core-translations';
import { useState } from 'react';
import { Folder, Issue } from '@maas/core-api-models';
import { UseFormReturn } from 'react-hook-form';
import { useEditIssueForm, useEditIssueActions, IssueFormValues } from './hooks';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';
import { FormProvider } from 'react-hook-form';

const getTabItems = (routes: WorkspaceRoutes, issueId: string, t: (key: string) => string) => {
    if (issueId === 'new') {
        return [{ title: t('common.info'), url: routes.issueNewInfo() }];
    }

    return [
        { title: t('common.info'), url: routes.issueInfo(issueId) },
        { title: t('issues.organizer'), url: routes.issueOrganizer(issueId) },
    ];
};

export type EditIssueOutletContext = {
    issueId: string;
    isCreateMode: boolean;
    issue: Issue | undefined;
    isLoading: boolean;
    refetchIssue: () => void;
    // Form
    form: UseFormReturn<IssueFormValues>;
    // Selection state
    selectedFolderId: string | null;
    setSelectedFolderId: (id: string | null) => void;
    selectedArticleId: string | null;
    setSelectedArticleId: (id: string | null) => void;
    // Folder cache for display (folders from API + newly created folders)
    folderCache: Map<string, Folder>;
    setFolderCache: React.Dispatch<React.SetStateAction<Map<string, Folder>>>;
};

export function EditIssueManagerPage() {
    const { issueId = '' } = useParams<{ issueId: string }>();
    const isCreateMode = issueId === 'new';
    const routes = useRoutes();
    const { t } = useTranslation();

    // Selection state
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
    // Folder cache for display
    const [folderCache, setFolderCache] = useState<Map<string, Folder>>(new Map());

    // Data fetching - include folders with articles
    const {
        data: issue,
        isLoading,
        refetch: refetchIssue,
    } = useGetIssueById(
        {
            id: issueId,
            fields: {
                id: null,
                slug: null,
                title: null,
                description: null,
                issueNumber: null,
                cover: null,
                publishedAt: null,
                isPublished: null,
                pdf: null,
                pageCount: null,
                brand: {
                    fields: {
                        id: null,
                        name: null,
                        issueConfiguration: null,
                    },
                },
                folders: {
                    fields: {
                        id: null,
                        name: null,
                        description: null,
                        cover: null,
                        isPublished: null,
                        metadata: null,
                        articles: {
                            fields: {
                                id: null,
                                title: null,
                                description: null,
                                type: null,
                                isPublished: null,
                                featuredImage: null,
                            },
                        },
                    },
                },
            },
        },
        {
            enabled: !isCreateMode,
        }
    );
    // Form
    const { form } = useEditIssueForm({
        issue,
        isCreateMode,
    });
    // Actions
    const { onSubmit, handleDelete, isSaving, deleteMutation } = useEditIssueActions(form, isCreateMode, issueId);

    const isPublished = form.watch('isPublished');
    const pageTitle = isCreateMode ? 'New Issue' : (issue?.title ?? '');

    if (!isCreateMode && isLoading) {
        return <div className="flex h-screen items-center justify-center">{t('common.loading')}</div>;
    }

    if (!isCreateMode && !isLoading && !issue) {
        return <div className="flex h-screen items-center justify-center">{t('issues.notFound')}</div>;
    }

    const breadcrumbLabel = isCreateMode ? 'New' : (issue?.title ?? '');

    const outletContext: EditIssueOutletContext = {
        issueId,
        isCreateMode,
        issue,
        isLoading,
        refetchIssue,
        form,
        selectedFolderId,
        setSelectedFolderId,
        selectedArticleId,
        setSelectedArticleId,
        folderCache,
        setFolderCache,
    };

    return (
        <FormProvider {...form}>
            <form id="issue-form" onSubmit={form.handleSubmit(onSubmit)} className="flex h-[calc(100vh-4rem)] flex-col">
                <header className="shrink-0">
                    <LayoutBreadcrumb
                        items={[
                            { label: t('common.home'), to: routes.root() },
                            { label: t('issues.title'), to: routes.issues() },
                            { label: breadcrumbLabel },
                        ]}
                    />
                    <TabNavLinks items={getTabItems(routes, issueId, t)} />
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

                <Outlet context={outletContext} />
            </form>
        </FormProvider>
    );
}
