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
  Checkbox,
  Field,
  FieldGroup,
  Label,
} from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Brand } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditBrandForm } from './hooks/use-edit-brand-form';
import { useEditActions } from './hooks/use-edit-actions';

export function EditBrandManagerPage() {
  const { brandId = '' } = useParams<{ brandId: string }>();

  const { brand, isLoading, form, isCreateMode } = useEditBrandForm(brandId);

  const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(
    form,
    isCreateMode,
    brandId,
  );

  if (!isCreateMode && !isLoading && !brand) {
    return <div>Brand not found</div>;
  }

  const { ControlledTextInput, ControlledImageInput, ControlledTextAreaInput } =
    createConnectedInputHelpers<Brand>();

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
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card
              className={cn(
                'max-w-xl transition-opacity',
                isLoading && 'pointer-events-none opacity-50',
              )}
            >
              <CardHeader>
                <CardTitle>Brand Details</CardTitle>
                <CardDescription>
                  View and update your brand information here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <ControlledTextInput name="name" label="Name" />
                  <ControlledImageInput name="logo" label="Logo" />
                  <ControlledTextAreaInput
                    name="description"
                    label="Description"
                    rows={4}
                  />
                  {!isCreateMode && (
                    <Field orientation="horizontal">
                      <Checkbox
                        id="isActive"
                        checked={form.watch('isActive') as boolean}
                        onCheckedChange={(checked) =>
                          form.setValue('isActive', checked as boolean, {
                            shouldDirty: true,
                          })
                        }
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </Field>
                  )}
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
