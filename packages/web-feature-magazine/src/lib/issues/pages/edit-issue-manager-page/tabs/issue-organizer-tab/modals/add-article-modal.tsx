import { useState } from 'react';
import {
  CreateArticle,
  createArticleSchema,
  ReadArticleRef,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
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
  ControlledArticleInput,
  createConnectedInputHelpers,
} from '@maas/web-form';
import { IconFileText, IconPlus, IconSearch } from '@tabler/icons-react';
import { FormProvider, useForm } from 'react-hook-form';

type AddArticleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectExisting: (article: ReadArticleRef) => void;
  onCreate: (data: CreateArticle) => void;
};

type Mode = 'select' | 'search' | 'create';

type SearchFormData = {
  article: ReadArticleRef | null;
};

export function AddArticleModal({
  open,
  onOpenChange,
  onSelectExisting,
  onCreate,
}: AddArticleModalProps) {
  const {
    ControlledTextInput,
    ControlledTextAreaInput,
    ControlledArticleTypeInput,
  } = createConnectedInputHelpers<CreateArticle>();

  const [mode, setMode] = useState<Mode>('select');

  // Form for searching existing articles
  const searchForm = useForm<SearchFormData>({
    defaultValues: {
      article: null,
    },
  });

  // Form for creating new articles
  const createForm = useForm<CreateArticle>({
    resolver: zodResolver(createArticleSchema),
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

  const handleCreate = (data: CreateArticle) => {
    onCreate(data);
    handleClose();
  };

  const selectedArticle = searchForm.watch('article');

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {mode === 'select' && (
          <>
            <DialogHeader>
              <DialogTitle>Add Article</DialogTitle>
              <DialogDescription>
                Search for an existing article or create a new one.
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
                  <div className="font-medium">Search existing article</div>
                  <div className="text-sm text-muted-foreground">
                    Find and add an article that already exists
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
                  <div className="font-medium">Create new article</div>
                  <div className="text-sm text-muted-foreground">
                    Create a brand new article for this issue
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
                <DialogTitle>Search Article</DialogTitle>
                <DialogDescription>
                  Search for an existing article to add to this folder.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <ControlledArticleInput<SearchFormData>
                  name="article"
                  label="Article"
                  placeholder="Search by title..."
                />
                {selectedArticle && (
                  <div className="mt-4 p-3 rounded-lg border bg-muted/50">
                    <div className="flex items-center gap-2">
                      <IconFileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {selectedArticle.title}
                      </span>
                    </div>
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
                <Button type="submit" disabled={!selectedArticle}>
                  Add Article
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
                <DialogTitle>Create Article</DialogTitle>
                <DialogDescription>
                  Create a new article for this issue.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <FieldGroup>
                  <ControlledArticleTypeInput
                    name="type"
                    label="Type"
                    placeholder="Select article type..."
                  />
                  <ControlledTextInput
                    name="title"
                    label="Title"
                    placeholder="Enter article title..."
                  />
                  <ControlledTextAreaInput
                    name="description"
                    label="Description"
                    placeholder="Brief description of the article..."
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
                <Button type="submit">Create Article</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
}
