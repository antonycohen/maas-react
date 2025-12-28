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
import { Enum } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { createConnectedInputHelpers } from '@maas/web-form';
import { IconTrash } from '@tabler/icons-react';
import { useEditEnumForm } from './hooks/use-edit-enum-form';
import { useEditActions } from './hooks/use-edit-actions';
import { useCurrentWorkspaceUrlPrefix, useGetCurrentWorkspaceId } from '@maas/core-workspace';

export function EditEnumManagerPage() {
  const { enumId = '' } = useParams<{ enumId: string }>();

  const workspaceId = useGetCurrentWorkspaceId();
  const { enumData, isLoading, form, isCreateMode } = useEditEnumForm(
    enumId,
    workspaceId as string,
  );
  const workspaceBaseUrl = useCurrentWorkspaceUrlPrefix();

  const { deleteMutation, handleDelete, isSaving, onSubmit } = useEditActions(
    form,
    isCreateMode,
    enumId,
  );

  if (!isCreateMode && !isLoading && !enumData) {
    return <div>Enum not found</div>;
  }

  const { ControlledTextInput, ControlledSlugValueInput } =
    createConnectedInputHelpers<Enum>();

  const pageTitle = isCreateMode ? 'New Enum' : (enumData?.name ?? '');
  const breadcrumbLabel = isCreateMode ? 'New' : (enumData?.name ?? '');

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: `${workspaceBaseUrl}` },
            { label: 'Enums', to: `${workspaceBaseUrl}/enums` },
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
                  <CardTitle>Enum Details</CardTitle>
                  <CardDescription>
                    Define the enum name and key identifier.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ControlledTextInput name="name" label="Name" />
                  </FieldGroup>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Enum Values</CardTitle>
                  <CardDescription>
                    Define the key-label pairs for this enum.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <ControlledSlugValueInput
                      name="values"
                      label="Values"
                      slugPath="value"
                      valuePath="label"
                      valueLabel="Label"
                      valuePlaceholder="e.g., Pending"
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
