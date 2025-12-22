import { FormProvider } from 'react-hook-form';
import { useEditIssueContext } from '../issue-organizer-tab/context';
import { useEditIssueForm } from './hooks/use-edit-issue-form';
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
import { CreateIssue, UpdateIssue } from '@maas/core-api-models';
import { LayoutContent } from '@maas/web-layout';

export const IssueInfoTab = () => {
  const { issueId } = useEditIssueContext();
  const { isCreateMode, isLoading, form, handleSubmit, isPending } =
    useEditIssueForm(issueId);

  const {
    ControlledTextInput,
    ControlledTextAreaInput,
    ControlledImageInput,
    ControlledCheckbox,
    ControlledDateInput,
    ControlledMagazineBrandInput,
  } = createConnectedInputHelpers<CreateIssue | UpdateIssue>();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <LayoutContent>
      <FormProvider {...form}>
        <form onSubmit={handleSubmit}>
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
                    <ControlledCheckbox
                      name="isPublished"
                      label="Published"
                      direction="horizontal"
                      className="py-6"
                    />
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t justify-end">
              <Button
                type="submit"
                isLoading={isPending}
              >
                {isCreateMode ? 'Create' : 'Save'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </FormProvider>
    </LayoutContent>
  );
};
