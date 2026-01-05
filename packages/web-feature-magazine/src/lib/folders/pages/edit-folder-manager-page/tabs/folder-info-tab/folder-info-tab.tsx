import { FormProvider } from 'react-hook-form';
import { useEditFolderContext } from '../../context';
import { useEditFolderForm } from './hooks/use-edit-folder-form';
import { useEditFolderActions } from './hooks/use-edit-folder-actions';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { CreateFolder, UpdateFolder } from '@maas/core-api-models';
import { LayoutContent } from '@maas/web-layout';
import { useGetCurrentWorkspaceId } from '@maas/core-workspace';

export const FolderInfoTab = () => {
  const { folderId } = useEditFolderContext();
  const workspaceId = useGetCurrentWorkspaceId();
  const { isCreateMode, isLoading, form } = useEditFolderForm(
    folderId,
    workspaceId as string,
  );
  const { onSubmit, isSaving } = useEditFolderActions(
    form,
    isCreateMode,
    folderId,
  );

  const {
    ControlledTextInput,
    ControlledTextAreaInput,
    ControlledImageInput,
    ControlledSwitchInput,
  } = createConnectedInputHelpers<CreateFolder | UpdateFolder>();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LayoutContent>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="rounded-2xl gap-0">
            <CardHeader>
              <CardTitle className="text-xl">
                {isCreateMode ? 'Create Folder' : 'Folder Information'}
              </CardTitle>
              <CardDescription>
                {isCreateMode
                  ? 'Fill in the details to create a new folder.'
                  : 'Update the folder details below.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pt-2">
              <div className="flex flex-col divide-y">
                <ControlledTextInput
                  name="name"
                  label="Name"
                  direction="horizontal"
                  className="py-6"
                />
                <ControlledTextAreaInput
                  name="description"
                  label="Description"
                  direction="horizontal"
                  className="py-6"
                />
                <ControlledImageInput
                  name="cover"
                  label="Cover"
                  direction="horizontal"
                  className="py-6"
                />
                {!isCreateMode && (
                  <ControlledSwitchInput
                    name="isPublished"
                    label="Published"
                    direction="horizontal"
                    className="py-6"
                  />
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t justify-end">
              <Button type="submit" isLoading={isSaving}>
                {isCreateMode ? 'Create' : 'Save'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </LayoutContent>
  );
};
