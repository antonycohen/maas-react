import { useState } from 'react';
import { useTranslation } from '@maas/core-translations';
import { ReadArticleRef, articleTypeRefSchema } from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    FieldGroup,
} from '@maas/web-components';
import { ControlledArticleInput, createConnectedInputHelpers } from '@maas/web-form';
import { IconFileText, IconPlus, IconSearch } from '@tabler/icons-react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';

// Modal-specific schema (organization is added by the hook, not the form)
const createArticleModalSchema = z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(5000).nullable().optional(),
    keywords: z.array(z.string().max(500)).nullable(),
    type: articleTypeRefSchema.nullable().refine((data) => data?.id, {
        message: 'Please select an article type',
    }),
});

type CreateArticleModalData = z.infer<typeof createArticleModalSchema>;

type AddArticleModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectExisting: (article: ReadArticleRef) => void;
    onCreate: (data: CreateArticleModalData) => void;
};

type Mode = 'select' | 'search' | 'create';

type SearchFormData = {
    article: ReadArticleRef | null;
};

export function AddArticleModal({ open, onOpenChange, onSelectExisting, onCreate }: AddArticleModalProps) {
    const { t } = useTranslation();
    const { ControlledTextInput, ControlledTextAreaInput, ControlledArticleTypeInput } =
        createConnectedInputHelpers<CreateArticleModalData>();

    const [mode, setMode] = useState<Mode>('select');

    // Form for searching existing articles
    const searchForm = useForm<SearchFormData>({
        defaultValues: {
            article: null,
        },
    });

    // Form for creating new articles
    const createForm = useForm<CreateArticleModalData>({
        resolver: zodResolver(createArticleModalSchema),
        defaultValues: {
            title: '',
            description: '',
            type: null,
            keywords: null,
        },
    });

    const handleClose = () => {
        setMode('select');
        searchForm.reset();
        createForm.reset({
            title: '',
            description: '',
            type: null,
            keywords: null,
        });
        onOpenChange(false);
    };

    const handleSelectExisting = (data: SearchFormData) => {
        if (data.article) {
            onSelectExisting(data.article);
            handleClose();
        }
    };

    const handleCreate = (data: CreateArticleModalData) => {
        onCreate(data);
        handleClose();
    };

    const selectedArticle = useWatch({ control: searchForm.control, name: 'article' });

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                {mode === 'select' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{t('issues.addArticle')}</DialogTitle>
                            <DialogDescription>{t('issues.addArticleDescription')}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-auto justify-start gap-3 py-4"
                                onClick={() => setMode('search')}
                            >
                                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                    <IconSearch className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium">{t('issues.searchExistingArticle')}</div>
                                    <div className="text-muted-foreground text-sm">
                                        {t('issues.searchExistingArticleDescription')}
                                    </div>
                                </div>
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="h-auto justify-start gap-3 py-4"
                                onClick={() => setMode('create')}
                            >
                                <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-lg">
                                    <IconPlus className="h-5 w-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium">{t('issues.createNewArticle')}</div>
                                    <div className="text-muted-foreground text-sm">
                                        {t('issues.createNewArticleDescription')}
                                    </div>
                                </div>
                            </Button>
                        </div>
                    </>
                )}

                {mode === 'search' && (
                    <FormProvider {...searchForm}>
                        <form
                            onSubmit={(e) => {
                                e.stopPropagation();
                                searchForm.handleSubmit(handleSelectExisting)(e);
                            }}
                        >
                            <DialogHeader>
                                <DialogTitle>{t('issues.searchArticle')}</DialogTitle>
                                <DialogDescription>{t('issues.searchForArticle')}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <ControlledArticleInput<SearchFormData>
                                    name="article"
                                    label="Article"
                                    placeholder={t('field.placeholder.searchByTitle')}
                                />
                                {selectedArticle && (
                                    <div className="bg-muted/50 mt-4 rounded-lg border p-3">
                                        <div className="flex items-center gap-2">
                                            <IconFileText className="text-muted-foreground h-4 w-4" />
                                            <span className="font-medium">{selectedArticle.title}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setMode('select')}>
                                    {t('common.back')}
                                </Button>
                                <Button type="submit" disabled={!selectedArticle}>
                                    {t('issues.addArticle')}
                                </Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                )}

                {mode === 'create' && (
                    <FormProvider {...createForm}>
                        <form
                            onSubmit={(e) => {
                                e.stopPropagation();
                                createForm.handleSubmit(handleCreate)(e);
                            }}
                        >
                            <DialogHeader>
                                <DialogTitle>{t('issues.createArticle')}</DialogTitle>
                                <DialogDescription>{t('issues.createArticleDescription')}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <FieldGroup>
                                    <ControlledArticleTypeInput
                                        name="type"
                                        label={t('field.type')}
                                        placeholder={t('field.placeholder.selectArticleType')}
                                    />
                                    <ControlledTextInput
                                        name="title"
                                        label={t('field.title')}
                                        placeholder={t('field.placeholder.enterArticleTitle')}
                                    />
                                    <ControlledTextAreaInput
                                        name="description"
                                        label={t('field.description')}
                                        placeholder={t('field.placeholder.briefDescription')}
                                    />
                                </FieldGroup>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setMode('select')}>
                                    {t('common.back')}
                                </Button>
                                <Button type="submit">{t('issues.createArticle')}</Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                )}
            </DialogContent>
        </Dialog>
    );
}
