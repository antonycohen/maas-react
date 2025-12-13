import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { EditUserOutletContext } from '../../types';
import { FormProvider } from 'react-hook-form';
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
import { UpdateUserInfo } from '@maas/core-api-models';
import { useAccountProfileForm } from './hooks/use-account-profile-form';
import { DeleteAccountConfirmationAlertDialog } from './modals/delete-account-confirmation-alert-dialog';

export const AccountProfileTab = () => {
  const { user, isLoading } = useOutletContext<EditUserOutletContext>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { form, handleSubmit, handleDeleteAccount, isDeleting, isUpdating } =
    useAccountProfileForm(user);

  const { ControlledTextInput, ControlledImageInput } =
    createConnectedInputHelpers<UpdateUserInfo>();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-8">
        {/* Profile Card */}
        <form onSubmit={handleSubmit}>
          <Card className="rounded-2xl gap-0">
            <CardHeader>
              <CardTitle className="text-xl">Profile</CardTitle>
              <CardDescription>
                Enter your full name or a display name you'd like to use.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pt-2">
              <div className="flex flex-col divide-y">
                <ControlledTextInput
                  name="firstName"
                  label="First name"
                  direction="horizontal"
                  className="py-6"
                />
                <ControlledTextInput
                  name="lastName"
                  label="Last name"
                  direction="horizontal"
                  className="py-6"
                />
                <ControlledImageInput
                  name="profileImage"
                  label="Profile picture"
                  direction="horizontal"
                  className="py-6"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t justify-end">
              <Button type="submit" isLoading={isUpdating}>Save</Button>
            </CardFooter>
          </Card>
        </form>

        {/* Delete Account Card */}
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl">Delete account</CardTitle>
            <CardDescription>
              This will permanently delete your Personal Account. Please note
              that this action is irreversible, so proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardFooter className="border-t justify-between">
            <p className="text-sm text-destructive">
              This action cannot be undone!
            </p>
            <Button
              variant="destructive"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete account
            </Button>
          </CardFooter>
        </Card>
      </div>

      <DeleteAccountConfirmationAlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteAccount}
        isLoading={isDeleting}
      />
    </FormProvider>
  );
};
