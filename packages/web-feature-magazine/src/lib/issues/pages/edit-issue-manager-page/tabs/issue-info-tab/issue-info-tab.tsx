import { useOutletContext } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@maas/web-components';
import { createConnectedInputHelpers } from '@maas/web-form';
import { LayoutContent } from '@maas/web-layout';
import { EditIssueOutletContext } from '../../edit-issue-manager-page';
import { IssueFormValues } from '../../hooks';

export const IssueInfoTab = () => {
  const { isCreateMode, isLoading } =
    useOutletContext<EditIssueOutletContext>();

  const {
    ControlledTextInput,
    ControlledTextAreaInput,
    ControlledImageInput,
    ControlledSwitchInput,
    ControlledDateInput,
    ControlledMagazineBrandInput,
  } = createConnectedInputHelpers<IssueFormValues>();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LayoutContent>
      <Card className="rounded-2xl gap-0">
        <CardHeader>
          <CardTitle className="text-xl">
            {isCreateMode ? 'Create Issue' : 'Issue Information'}
          </CardTitle>
          <CardDescription>
            {isCreateMode
              ? 'Fill in the details to create a new issue.'
              : 'Update the issue details below.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pt-2">
          <div className="flex flex-col divide-y">
            {isCreateMode && (
              <ControlledMagazineBrandInput
                name="brand"
                label="Brand"
                direction="horizontal"
                className="py-6"
              />
            )}
            <ControlledTextInput
              name="title"
              label="Title"
              direction="horizontal"
              className="py-6"
            />
            <ControlledTextAreaInput
              name="description"
              label="Description"
              direction="horizontal"
              className="py-6"
            />
            <ControlledTextInput
              name="issueNumber"
              label="Issue Number"
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
              <>
                <ControlledDateInput
                  name="publishedAt"
                  label="Published At"
                  direction="horizontal"
                  className="py-6"
                />
                <ControlledSwitchInput
                  name="isPublished"
                  label="Published"
                  className="py-6"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </LayoutContent>
  );
};
