import { useNavigate, useParams } from 'react-router-dom';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';
import {
  Button,
  Checkbox,
  Field,
  FieldGroup,
  Label,
} from '@maas/web-components';
import {
  useCreateBrand,
  useDeleteBrand,
  useGetBrandById,
  useUpdateBrand,
} from '@maas/core-api';
import { FormProvider, useForm } from 'react-hook-form';
import {
  CreateBrand,
  createBrandSchema,
  UpdateBrand,
  updateBrandSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import { ControlledTextareaInput, ControlledTextInput } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';

export function EditBrandManagerPage() {
  const { brandId = '' } = useParams<{ brandId: string }>();
  const navigate = useNavigate();

  const isCreateMode = brandId === 'new';

  const { data: brand, isLoading } = useGetBrandById(
    {
      id: brandId,
      fields: {
        id: null,
        name: null,
        description: null,
        isActive: null,
      },
    },
    {
      enabled: !isCreateMode,
    },
  );

  const createMutation = useCreateBrand({
    onSuccess: () => {
      navigate('/brands');
    },
  });

  const updateMutation = useUpdateBrand({
    onSuccess: () => {
      navigate('/brands');
    },
  });

  const deleteMutation = useDeleteBrand({
    onSuccess: () => {
      navigate('/brands');
    },
  });

  const form = useForm<CreateBrand | UpdateBrand>({
    resolver: zodResolver(isCreateMode ? createBrandSchema : updateBrandSchema),
    defaultValues: {
      name: '',
      description: '',
    },
    values:
      !isCreateMode && brand
        ? {
            name: brand.name,
            description: brand.description,
            isActive: brand.isActive ?? undefined,
          }
        : undefined,
  });

  function onSubmit(data: CreateBrand | UpdateBrand) {
    if (isCreateMode) {
      createMutation.mutate(data as CreateBrand);
    } else {
      updateMutation.mutate({
        brandId,
        data: data as UpdateBrand,
      });
    }
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      deleteMutation.mutate(brandId);
    }
  }

  const isSaving = createMutation.isPending || updateMutation.isPending;

  if (!isCreateMode && isLoading) {
    return <div>Loading...</div>;
  }

  if (!isCreateMode && !brand) {
    return <div>Brand not found</div>;
  }

  const pageTitle = isCreateMode ? 'New Brand' : (brand?.name ?? '');
  const breadcrumbLabel = isCreateMode ? 'New' : (brand?.name ?? '');

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Brands', to: '/brands' },
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
              {!isCreateMode && (
                <Field orientation="horizontal">
                  <Checkbox
                    id="isActive"
                    checked={form.watch('isActive') as boolean}
                    onCheckedChange={(checked) =>
                      form.setValue('isActive', checked as boolean)
                    }
                  />
                  <Label htmlFor="isActive">Active</Label>
                </Field>
              )}
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
