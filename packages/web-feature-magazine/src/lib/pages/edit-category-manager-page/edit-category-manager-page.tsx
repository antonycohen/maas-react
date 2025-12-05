import { useNavigate, useParams } from 'react-router-dom';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import { Button, Field, FieldGroup } from '@maas/web-components';
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategoryById,
  useUpdateCategory,
} from '@maas/core-api';
import { FormProvider, useForm } from 'react-hook-form';
import {
  CreateCategory,
  createCategorySchema,
  UpdateCategory,
  updateCategorySchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledTextareaInput, ControlledTextInput } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';

export function EditCategoryManagerPage() {
  const { categoryId = '' } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();

  const isCreateMode = categoryId === 'new';

  const { data: category, isLoading } = useGetCategoryById(
    {
      id: categoryId,
      fields: {
        id: null,
        name: null,
        description: null,
        parent: {
          fields: {
            id: null,
            name: null,
          },
        },
        childrenCount: null,
      },
    },
    {
      enabled: !isCreateMode,
    }
  );

  const createMutation = useCreateCategory({
    onSuccess: () => {
      navigate('/categories');
    },
  });

  const updateMutation = useUpdateCategory({
    onSuccess: () => {
      navigate('/categories');
    },
  });

  const deleteMutation = useDeleteCategory({
    onSuccess: () => {
      navigate('/categories');
    },
  });

  const form = useForm<CreateCategory | UpdateCategory>({
    resolver: zodResolver(isCreateMode ? createCategorySchema : updateCategorySchema),
    defaultValues: {
      name: '',
      description: '',
      parent: null,
    },
    values:
      !isCreateMode && category
        ? {
            name: category.name,
            description: category.description,
            parent: category.parent?.id ?? null,
          }
        : undefined,
  });

  function onSubmit(data: CreateCategory | UpdateCategory) {
    if (isCreateMode) {
      createMutation.mutate(data as CreateCategory);
    } else {
      updateMutation.mutate({
        categoryId,
        data: data as UpdateCategory,
      });
    }
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(categoryId);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (!isCreateMode && isLoading) {
    return <div>Loading...</div>;
  }

  if (!isCreateMode && !category) {
    return <div>Category not found</div>;
  }

  const pageTitle = isCreateMode ? 'New Category' : category?.name ?? '';
  const breadcrumbLabel = isCreateMode ? 'New' : category?.name ?? '';

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
      </header>
      <LayoutContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormProvider {...form}>
            <FieldGroup>
              <ControlledTextInput name="name" label="Name" />
              <ControlledTextareaInput name="description" label="Description" />
              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : isCreateMode ? 'Create' : 'Save'}
                </Button>
              </Field>
            </FieldGroup>
          </FormProvider>
        </form>
      </LayoutContent>
    </div>
  );
}
