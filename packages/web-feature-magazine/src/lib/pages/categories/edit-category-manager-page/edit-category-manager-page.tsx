import { useParams } from 'react-router-dom';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  FieldGroup,
} from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Category } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditCategoryForm } from './hooks/use-edit-category-form';
import { useEditActions } from './hooks/use-edit-actions';

export function EditCategoryManagerPage() {
  const { categoryId = '' } = useParams<{ categoryId: string }>();

  const { category, isLoading, form, isCreateMode } =
    useEditCategoryForm(categoryId);

  const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(
    form,
    isCreateMode,
    categoryId,
  );

  if (!isCreateMode && !isLoading && !category) {
    return <div>Category not found</div>;
  }

  const {
    ControlledTextInput,
    ControlledImageInput,
    ControlledTextAreaInput,
    ControlledMagazineCategoryInput,
  } = createConnectedInputHelpers<Category>();

  const pageTitle = isCreateMode ? 'New Category' : (category?.name ?? '');
  const breadcrumbLabel = isCreateMode ? 'New' : (category?.name ?? '');

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Categories', to: '/categories' },
            { label: breadcrumbLabel },
          ]}
        />
      </header>
      <LayoutContent>
        <LayoutHeader
          pageTitle={pageTitle}
          actions={
            !isCreateMode && (
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <IconTrash className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )
          }
        />
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card
              className={cn(
                'max-w-xl transition-opacity',
                isLoading && 'pointer-events-none opacity-50',
              )}
            >
              <CardHeader>
                <CardTitle>Category Details</CardTitle>
                <CardDescription>
                  View and update your category information here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <ControlledTextInput name="name" label="Name" />
                  <ControlledMagazineCategoryInput
                    name="parent"
                    label="Parent Category"
                    placeholder="No Parent"
                  />
                  <ControlledImageInput name="cover" label="Cover" />
                  <ControlledTextAreaInput
                    name="description"
                    label="Description"
                  />
                </FieldGroup>
              </CardContent>
              <CardFooter className="border-t pt-6 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isLoading}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSaving || isLoading}>
                  {isSaving ? 'Saving...' : isCreateMode ? 'Create' : 'Save'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </FormProvider>
      </LayoutContent>
    </div>
  );
}
