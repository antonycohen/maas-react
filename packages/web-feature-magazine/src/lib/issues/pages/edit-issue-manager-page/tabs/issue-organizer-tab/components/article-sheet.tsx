import {
  CreateArticle,
  createArticleSchema,
  ReadFolderRef,
} from '@maas/core-api-models';
import {
  Button,
  FieldGroup,
  ScrollArea,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@maas/web-components';
import {
  ControlledCheckbox,
  ControlledMagazineFolderInput,
  createConnectedInputHelpers,
} from '@maas/web-form';
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form';
import { ArticleFormData, useEditArticleForm } from '../hooks';

const { ControlledTextInput, ControlledTextAreaInput } =
  createConnectedInputHelpers<CreateArticle>();

type ArticleSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issueId: string;
  currentFolder?: ReadFolderRef | null;
  onCreate: (data: CreateArticle) => void;
};

export function ArticleSheet({
  open,
  onOpenChange,
  issueId,
  currentFolder,
  onCreate,
}: ArticleSheetProps) {
  const { form } = useEditArticleForm({
    article: null,
    issueId,
  });

  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (open) {
      reset({
        issue: { id: issueId },
        title: '',
        description: '',
        type: 'feature',
        folder: currentFolder ?? null,
        isFeatured: false,
      });
    }
  }, [currentFolder, issueId, open, reset]);

  function onSubmit(data: ArticleFormData) {
    const createData = data as CreateArticle;

    const parsed: CreateArticle = createArticleSchema.parse({
      issue: { id: issueId },
      title: createData.title,
      description: createData.description,
      type: createData.type,
      folder: createData.folder,
      isFeatured: createData.isFeatured,
    });
    onCreate(parsed);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col h-full"
          >
            <SheetHeader>
              <SheetTitle>New Article</SheetTitle>
              <SheetDescription>
                Create a new article for this issue.
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="flex-1 px-4">
              <FieldGroup className="py-4">
                <ControlledTextInput
                  name="title"
                  label="Title"
                  placeholder="Enter article title..."
                />
                <ControlledTextAreaInput
                  name="description"
                  label="Description"
                  placeholder="Brief description of the article..."
                  rows={3}
                />
                <ControlledMagazineFolderInput
                  name="folder"
                  label="Folder"
                  issueId={issueId}
                />
                <ControlledCheckbox name="isFeatured" label="Featured" />
              </FieldGroup>
            </ScrollArea>
            <SheetFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
