import { useState } from 'react';
import { useTranslation } from '@maas/core-translations';
import { CreateFolder, ReadFolderRef } from '@maas/core-api-models';
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
import { ControlledMagazineFolderInput, createConnectedInputHelpers } from '@maas/web-form';
import { IconFolder, IconPlus, IconSearch } from '@tabler/icons-react';
import { FormProvider, useForm } from 'react-hook-form';

type AddFolderModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectExisting: (folder: ReadFolderRef) => void;
    onCreate: (data: CreateFolder) => void;
    existingFolderIds?: string[];
};

type Mode = 'select' | 'search' | 'create';

type SearchFormData = {
    folder: ReadFolderRef | null;
};

export function AddFolderModal({
    open,
    onOpenChange,
    onSelectExisting,
    onCreate,
    existingFolderIds = [],
}: AddFolderModalProps) {
    const { t } = useTranslation();
    const [mode, setMode] = useState<Mode>('select');

    const { ControlledTextInput, ControlledTextAreaInput, ControlledImageInput } =
        createConnectedInputHelpers<CreateFolder>();

    // Form for searching existing folders
    const searchForm = useForm<SearchFormData>({
        defaultValues: {
            folder: null,
        },
    });

    // Form for creating new folders
    const createForm = useForm<CreateFolder>({
        defaultValues: {
            name: '',
            description: '',
            cover: null,
        },
    });

    const handleClose = () => {
        setMode('select');
        searchForm.reset();
        createForm.reset({
            name: '',
            description: '',
            cover: null,
        });
        onOpenChange(false);
    };

    const handleSelectExisting = (data: SearchFormData) => {
        if (data.folder) {
            // Check if folder is already in the issue
            if (existingFolderIds.includes(data.folder.id)) {
                searchForm.setError('folder', {
                    type: 'manual',
                    message: 'This folder is already in the issue',
                });
                return;
            }
            onSelectExisting(data.folder);
            handleClose();
        }
    };

    const handleCreate = (data: CreateFolder) => {
        try {
            onCreate(data);
            handleClose();
        } catch (error) {
            console.error('Zod parse error:', error);
        }
    };

    const selectedFolder = searchForm.watch('folder');
    const isAlreadyAdded = selectedFolder ? existingFolderIds.includes(selectedFolder.id) : false;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                {mode === 'select' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{t('issues.addFolder')}</DialogTitle>
                            <DialogDescription>{t('issues.addFolderDescription')}</DialogDescription>
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
                                    <div className="font-medium">{t('issues.searchExistingFolder')}</div>
                                    <div className="text-muted-foreground text-sm">
                                        {t('issues.searchExistingFolderDescription')}
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
                                    <div className="font-medium">{t('issues.createNewFolder')}</div>
                                    <div className="text-muted-foreground text-sm">
                                        {t('issues.createNewFolderDescription')}
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
                                <DialogTitle>{t('issues.searchFolder')}</DialogTitle>
                                <DialogDescription>{t('issues.searchForFolder')}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <ControlledMagazineFolderInput<SearchFormData>
                                    name="folder"
                                    label="Folder"
                                    placeholder={t('field.placeholder.searchByName')}
                                />
                                {selectedFolder && (
                                    <div
                                        className={`mt-4 rounded-lg border p-3 ${isAlreadyAdded ? 'border-orange-300 bg-orange-50' : 'bg-muted/50'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <IconFolder className="text-muted-foreground h-4 w-4" />
                                            <span className="font-medium">{selectedFolder.name}</span>
                                        </div>
                                        {isAlreadyAdded && (
                                            <p className="mt-1 text-sm text-orange-600">
                                                {t('issues.folderAlreadyInIssue')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setMode('select')}>
                                    {t('common.back')}
                                </Button>
                                <Button type="submit" disabled={!selectedFolder || isAlreadyAdded}>
                                    {t('issues.addFolder')}
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
                                createForm.handleSubmit(handleCreate, (errors) => {
                                    console.log('Form errors:', errors);
                                })(e);
                            }}
                        >
                            <DialogHeader>
                                <DialogTitle>{t('issues.createFolderTitle')}</DialogTitle>
                                <DialogDescription>{t('issues.createFolderDescription')}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <FieldGroup>
                                    <ControlledTextInput name="name" label={t('field.name')} />
                                    <ControlledTextAreaInput
                                        name="description"
                                        label={t('field.description')}
                                        maxLength={300}
                                    />
                                    <ControlledImageInput name="cover" label={t('field.cover')} ratio={1536 / 1024} />
                                </FieldGroup>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="ghost" onClick={() => setMode('select')}>
                                    {t('common.back')}
                                </Button>
                                <Button type="submit">{t('issues.createFolderTitle')}</Button>
                            </DialogFooter>
                        </form>
                    </FormProvider>
                )}
            </DialogContent>
        </Dialog>
    );
}
