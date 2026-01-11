import { useOutletContext } from 'react-router-dom';
import { FolderFormValues } from '../../hooks';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditFolderOutletContext } from '../../edit-folder-manager-page';

export const FolderInfoTab = () => {
  const { isCreateMode, isLoading } =
    useOutletContext<EditFolderOutletContext>();

  const {
    ControlledTextInput,
    ControlledTextAreaInput,
    ControlledImageInput,
    ControlledSwitchInput,
  } = createConnectedInputHelpers<FolderFormValues>();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LayoutContent>
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
              maxLength={300}
              className="py-6"
            />
            <ControlledImageInput
              name="cover"
              label="Cover"
              direction="horizontal"
              className="py-6"
              ratio={1536 / 1024}
            />
            {!isCreateMode && (
              <ControlledSwitchInput
                name="isPublished"
                label="Published"
                className="py-6"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </LayoutContent>
  );
};
