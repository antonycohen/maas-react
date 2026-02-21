import { useParams } from 'react-router-dom';
import { LayoutBreadcrumb } from '@maas/web-layout';
import { useTranslation } from '@maas/core-translations';
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    FieldGroup,
    Separator,
} from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Article } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import {
    IconChevronDown,
    IconDeviceFloppy,
    IconLoader2,
    IconPhoto,
    IconSettings,
    IconTag,
    IconTrash,
} from '@tabler/icons-react';
import { useEditArticleForm } from './hooks/use-edit-article-form';
import { useEditActions } from './hooks/use-edit-actions';
import { useRoutes } from '@maas/core-workspace';
import { DynamicCustomFields } from './components/dynamic-custom-fields';
import {
    CardEventPlugin,
    CardsTextWithImagePlugin,
    FramePlugin,
    HeadingPlugin,
    HighlightPlugin,
    IframePlugin,
    ImagesPlugin,
    ImageWithTextPlugin,
    MosaicGalleryPlugin,
    ParagraphPlugin,
    PodcastCarouselPlugin,
    QuotesPlugin,
    VideoPlugin,
} from '@maas/web-cms-editor';
import { useState } from 'react';

const useVisibilityOptions = () => {
    const { t } = useTranslation();
    return [
        { value: 'public', label: t('status.public') },
        { value: 'private', label: t('status.private') },
        { value: 'draft', label: t('status.draft') },
        { value: 'subscribers', label: t('status.subscribers') },
    ];
};

export const editorPlugins = [
    HeadingPlugin,
    ParagraphPlugin,
    QuotesPlugin,
    CardsTextWithImagePlugin,
    CardEventPlugin,
    PodcastCarouselPlugin,
    VideoPlugin,
    MosaicGalleryPlugin,
    ImagesPlugin,
    ImageWithTextPlugin,
    IframePlugin,
    HighlightPlugin,
    FramePlugin,
];

type SidebarSectionProps = {
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
};

function SidebarSection({ title, icon, children, defaultOpen = true }: SidebarSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger className="hover:text-foreground text-muted-foreground flex w-full items-center justify-between py-3 text-sm font-medium transition-colors">
                <div className="flex items-center gap-2">
                    {icon}
                    {title}
                </div>
                <IconChevronDown className={cn('h-4 w-4 transition-transform duration-200', isOpen && 'rotate-180')} />
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div className="pb-4">{children}</div>
            </CollapsibleContent>
        </Collapsible>
    );
}

export function EditArticleManagerPage() {
    const { articleId = '' } = useParams<{ articleId: string }>();
    const { t } = useTranslation();
    const VISIBILITY_OPTIONS = useVisibilityOptions();

    const { article, isLoading, form, isCreateMode } = useEditArticleForm(articleId);
    const routes = useRoutes();

    const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(form, isCreateMode, articleId);

    const {
        ControlledTextInput,
        ControlledTokenInput,
        ControlledTextAreaInput,
        ControlledImageInput,
        ControlledSelectInput,
        ControlledCMSInput,
        ControlledSwitchInput,
        ControlledCategoriesInput,
        ControlledArticleTypeInput,
    } = createConnectedInputHelpers<Article>();

    const pageTitle = isCreateMode ? 'New Article' : (article?.title ?? '');
    const breadcrumbLabel = isCreateMode ? 'New' : (article?.title ?? '');

    const isPublished = form.watch('isPublished');
    const visibility = form.watch('visibility');

    if (!isCreateMode && isLoading) {
        return (
            <div className="min-h-[calc(100vh-4rem)]">
                <header className="bg-background sticky top-0 z-10 border-b">
                    <LayoutBreadcrumb
                        items={[
                            { label: t('common.home'), to: routes.root() },
                            { label: t('articles.title'), to: routes.articles() },
                            { label: t('common.loading') },
                        ]}
                    />
                </header>
                <div className="flex h-[50vh] items-center justify-center">
                    <IconLoader2 className="text-muted-foreground h-8 w-8 animate-spin" />
                </div>
            </div>
        );
    }

    if (!isCreateMode && !article) {
        return (
            <div className="min-h-[calc(100vh-4rem)]">
                <header className="bg-background sticky top-0 z-10 border-b">
                    <LayoutBreadcrumb
                        items={[
                            { label: t('common.home'), to: routes.root() },
                            { label: t('articles.title'), to: routes.articles() },
                            { label: t('articles.notFound') },
                        ]}
                    />
                </header>
                <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
                    <p className="text-muted-foreground text-lg">{t('articles.articleNotFound')}</p>
                    <Button variant="outline" onClick={() => (window.location.href = routes.articles())}>
                        {t('articles.backToArticles')}
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {/* Breadcrumb - scrolls with content */}
            <header className="shrink-0">
                <LayoutBreadcrumb
                    items={[
                        { label: t('common.home'), to: routes.root() },
                        { label: t('articles.title'), to: routes.articles() },
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
                        {visibility && (
                            <Badge variant="outline" className="capitalize">
                                {visibility}
                            </Badge>
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
                    <Button type="submit" size="sm" disabled={isSaving || isLoading} form="article-form">
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

            {/* Main Content */}
            <FormProvider {...form}>
                <form
                    id="article-form"
                    onSubmit={form.handleSubmit(onSubmit, (errors) => console.error('Form validation errors:', errors))}
                    className="flex flex-1"
                >
                    {/* Content Area */}
                    <div className="min-w-0 flex-1">
                        <div className="mx-auto max-w-4xl space-y-6 p-6">
                            {/* Title & Description */}
                            <Card>
                                <CardContent className="pt-6">
                                    <FieldGroup>
                                        <ControlledTextInput
                                            name="title"
                                            label={t('field.title')}
                                            placeholder={t('field.placeholder.enterArticleTitle')}
                                        />
                                        <ControlledTextAreaInput
                                            name="description"
                                            label={t('field.description')}
                                            placeholder={t('field.placeholder.articleDescription')}
                                        />
                                    </FieldGroup>
                                </CardContent>
                            </Card>

                            {/* Content Editor */}
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-base">{t('field.content')}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ControlledCMSInput
                                        name="content"
                                        label=""
                                        plugins={editorPlugins}
                                        author={article?.author?.firstName ?? 'Author'}
                                        lastModifiedAt={article?.updatedAt}
                                    />
                                </CardContent>
                            </Card>

                            {/* Dynamic Custom Fields */}
                            <DynamicCustomFields />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="bg-muted/30 sticky top-[57px] h-[calc(100svh-57px)] w-80 shrink-0 self-start overflow-y-auto border-l">
                        <div className="space-y-1 p-4">
                            {/* Publishing */}
                            <SidebarSection
                                title={t('articles.publishing')}
                                icon={<IconSettings className="h-4 w-4" />}
                                defaultOpen={true}
                            >
                                <FieldGroup className="space-y-4">
                                    <ControlledSwitchInput name="isPublished" label={t('status.published')} />
                                    <ControlledSwitchInput name="isFeatured" label={t('field.featured')} />
                                    <ControlledArticleTypeInput name="type" label={t('field.articleType')} />
                                    <ControlledSelectInput
                                        name="visibility"
                                        label={t('field.visibility')}
                                        options={VISIBILITY_OPTIONS}
                                        placeholder="Select visibility..."
                                    />
                                </FieldGroup>
                            </SidebarSection>

                            <Separator />

                            {/* Media */}
                            <SidebarSection
                                title={t('articles.media')}
                                icon={<IconPhoto className="h-4 w-4" />}
                                defaultOpen={true}
                            >
                                <FieldGroup className="space-y-4">
                                    <ControlledImageInput name="featuredImage" label={t('field.featuredImage')} />
                                    <ControlledImageInput
                                        name="cover"
                                        label={t('field.coverImage')}
                                        ratio={1 / 1.414}
                                    />
                                </FieldGroup>
                            </SidebarSection>

                            <Separator />

                            {/* Classification */}
                            <SidebarSection
                                title={t('articles.classification')}
                                icon={<IconTag className="h-4 w-4" />}
                                defaultOpen={true}
                            >
                                <FieldGroup className="space-y-4">
                                    <ControlledCategoriesInput name="categories" label={t('field.categories')} />
                                    <ControlledTokenInput name="keywords" label={t('field.keywords')} />
                                </FieldGroup>
                            </SidebarSection>
                        </div>
                    </aside>
                </form>
            </FormProvider>
        </div>
    );
}
