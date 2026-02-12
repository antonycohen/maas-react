import { Article } from '@maas/core-api-models';
import { useTranslation } from '@maas/core-translations';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@maas/web-components';
import { ControlledArticleInput } from '@maas/web-form';
import { IconFileText } from '@tabler/icons-react';
import { FormProvider, useForm } from 'react-hook-form';

type AddArticleToFolderModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folderId: string;
    onSelectExisting: (article: Article) => void;
    existingArticleIds?: string[];
};

type SearchFormData = {
    article: Article | null;
};

export function AddArticleToFolderModal({
    open,
    onOpenChange,
    onSelectExisting,
    existingArticleIds = [],
}: AddArticleToFolderModalProps) {
    const { t } = useTranslation();
    // Form for searching existing articles
    const searchForm = useForm<SearchFormData>({
        defaultValues: {
            article: null,
        },
    });

    const handleClose = () => {
        searchForm.reset();
        onOpenChange(false);
    };

    const handleSelectExisting = (data: SearchFormData) => {
        if (data.article) {
            onSelectExisting(data.article);
            handleClose();
        }
    };

    const selectedArticle = searchForm.watch('article');
    const isAlreadyAdded = selectedArticle && existingArticleIds.includes(selectedArticle.id);

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <FormProvider {...searchForm}>
                    <form onSubmit={searchForm.handleSubmit(handleSelectExisting)}>
                        <DialogHeader>
                            <DialogTitle>{t('folders.addArticle')}</DialogTitle>
                            <DialogDescription>{t('folders.searchForArticle')}</DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <ControlledArticleInput<SearchFormData>
                                name="article"
                                label="Article"
                                placeholder={t('field.placeholder.searchByTitle')}
                            />
                            {selectedArticle && (
                                <div
                                    className={`mt-4 rounded-lg border p-3 ${isAlreadyAdded ? 'border-orange-200 bg-orange-50' : 'bg-muted/50'}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <IconFileText className="text-muted-foreground h-4 w-4" />
                                        <span className="font-medium">{selectedArticle.title}</span>
                                    </div>
                                    {isAlreadyAdded && (
                                        <p className="mt-1 text-sm text-orange-600">
                                            {t('folders.articleAlreadyInFolder')}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={handleClose}>
                                {t('common.cancel')}
                            </Button>
                            <Button
                                type="button"
                                onClick={() => {
                                    searchForm.handleSubmit(handleSelectExisting)();
                                }}
                                disabled={!selectedArticle || !!isAlreadyAdded}
                            >
                                {t('folders.addArticle')}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
