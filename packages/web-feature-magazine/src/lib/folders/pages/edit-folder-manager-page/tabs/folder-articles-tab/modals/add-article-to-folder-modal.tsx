import { Article } from '@maas/core-api-models';
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
  const isAlreadyAdded =
    selectedArticle && existingArticleIds.includes(selectedArticle.id);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <FormProvider {...searchForm}>
          <form onSubmit={searchForm.handleSubmit(handleSelectExisting)}>
            <DialogHeader>
              <DialogTitle>Add Article</DialogTitle>
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
                <div
                  className={`mt-4 p-3 rounded-lg border ${isAlreadyAdded ? 'bg-orange-50 border-orange-200' : 'bg-muted/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <IconFileText className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{selectedArticle.title}</span>
                  </div>
                  {isAlreadyAdded && (
                    <p className="text-sm text-orange-600 mt-1">
                      This article is already in the folder
                    </p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  searchForm.handleSubmit(handleSelectExisting)();
                }}
                disabled={!selectedArticle || !!isAlreadyAdded}
              >
                Add Article
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
