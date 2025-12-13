import {ChangePasswordRequest, ReadUser} from '@maas/core-api-models';
import {Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from '@maas/web-components';
import {FormProvider} from 'react-hook-form';
import {createConnectedInputHelpers} from '@maas/web-form';
import {useChangePasswordForm} from '../hooks/use-change-password-form';

const {ControlledPasswordInput} = createConnectedInputHelpers<ChangePasswordRequest>();

type ChangePasswordSectionProps = {
  user: ReadUser;
};

export const ChangePasswordSection = ({user}: ChangePasswordSectionProps) => {
  const {form, handleSubmit, isLoading} = useChangePasswordForm(user);

  return (
    <form id="change-password-form" onSubmit={handleSubmit} className="flex flex-col">
      <FormProvider {...form}>
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-xl">Password</CardTitle>
            <CardDescription>
              To change your password please fill the current one.
            </CardDescription>
          </CardHeader>
          <CardContent>

            <ControlledPasswordInput
              name="currentPassword"
              label="Current password"
              direction="horizontal"
              className="py-6"
            />
            <ControlledPasswordInput
              name="newPassword"
              label="New password"
              direction="horizontal"
              className="py-6 border-t"
            />
            <ControlledPasswordInput
              name="repeatNewPassword"
              label="Repeat new password"
              direction="horizontal"
              className="py-6 border-t"
            />
          </CardContent>
          <CardFooter className="justify-end border-t">
            <Button type="submit" form="change-password-form" isLoading={isLoading}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </FormProvider>
    </form>
  );
};
