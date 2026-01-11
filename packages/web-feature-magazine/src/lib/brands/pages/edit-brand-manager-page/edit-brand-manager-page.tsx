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
  CardHeader,
  CardTitle,
  FieldGroup,
} from '@maas/web-components';
import { FormProvider } from 'react-hook-form';
import { Brand } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditBrandForm } from './hooks/use-edit-brand-form';
import { useEditActions } from './hooks/use-edit-actions';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';

export function EditBrandManagerPage() {
  const { brandId = '' } = useParams<{ brandId: string }>();

  const { brand, isLoading, form, isCreateMode } = useEditBrandForm(brandId);
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(
    form,
    isCreateMode,
    brandId,
  );

  if (!isCreateMode && !isLoading && !brand) {
    return <div>Brand not found</div>;
  }

  const {
    ControlledTextInput,
    ControlledImageInput,
    ControlledTextAreaInput,
    ControlledCheckbox,
    ControlledRatioInput,
    ControlledColorPickerInput,
  } = createConnectedInputHelpers<Brand>();

  const pageTitle = isCreateMode ? 'New Brand' : (brand?.name ?? '');
  const breadcrumbLabel = isCreateMode ? 'New' : (brand?.name ?? '');

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: `${workspaceBaseUrl}` },
            { label: 'Brands', to: `${workspaceBaseUrl}/brands` },
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
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={cn(
              'space-y-6 transition-opacity',
              isLoading && 'pointer-events-none opacity-50',
            )}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
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
                    />
                    <ControlledCheckbox name="isActive" label="Active" />
                  </FieldGroup>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Issue Configuration</CardTitle>
                  <CardDescription>
                    Default settings for new issues created under this brand.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ControlledRatioInput
                      name="issueConfiguration.coverRatio"
                      label="Cover Ratio"
                      placeholder="e.g., 16:9, 1:1.414"
                    />
                    <ControlledColorPickerInput
                      name="issueConfiguration.color"
                      label="Brand Color"
                    />

                  </FieldGroup>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-3">
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
            </div>
          </form>
        </FormProvider>
      </LayoutContent>
    </div>
  );
}
