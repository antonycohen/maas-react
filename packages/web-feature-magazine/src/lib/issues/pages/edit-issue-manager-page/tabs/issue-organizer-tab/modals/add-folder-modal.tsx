import { useState } from 'react';
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
import {
  ControlledMagazineFolderInput,
  createConnectedInputHelpers,
} from '@maas/web-form';
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
  const isAlreadyAdded = selectedFolder
    ? existingFolderIds.includes(selectedFolder.id)
    : false;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {mode === 'select' && (
          <>
            <DialogHeader>
              <DialogTitle>Add Folder</DialogTitle>
              <DialogDescription>
                Search for an existing folder or create a new one.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 justify-start gap-3"
                onClick={() => setMode('search')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <IconSearch className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Search existing folder</div>
                  <div className="text-sm text-muted-foreground">
                    Find and add a folder that already exists
                  </div>
                </div>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-auto py-4 justify-start gap-3"
                onClick={() => setMode('create')}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <IconPlus className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Create new folder</div>
                  <div className="text-sm text-muted-foreground">
                    Create a brand new folder for this issue
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
                <DialogTitle>Search Folder</DialogTitle>
                <DialogDescription>
                  Search for an existing folder to add to this issue.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ControlledMagazineFolderInput<SearchFormData>
                  name="folder"
                  label="Folder"
                  placeholder="Search by name..."
                />
                {selectedFolder && (
                  <div
                    className={`mt-4 p-3 rounded-lg border ${isAlreadyAdded ? 'border-orange-300 bg-orange-50' : 'bg-muted/50'}`}
                  >
                    <div className="flex items-center gap-2">
                      <IconFolder className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedFolder.name}</span>
                    </div>
                    {isAlreadyAdded && (
                      <p className="text-sm text-orange-600 mt-1">
                        This folder is already in the issue
                      </p>
                    )}
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMode('select')}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={!selectedFolder || isAlreadyAdded}
                >
                  Add Folder
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
                <DialogTitle>Create Folder</DialogTitle>
                <DialogDescription>
                  Create a new folder for this issue.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <FieldGroup>
                  <ControlledTextInput name="name" label="Name" />
                  <ControlledTextAreaInput
                    name="description"
                    label="Description"
                    maxLength={300}
                  />
                  <ControlledImageInput
                    name="cover"
                    label="Cover"
                    ratio={1536 / 1024}
                  />
                </FieldGroup>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setMode('select')}
                >
                  Back
                </Button>
                <Button type="submit">Create Folder</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
