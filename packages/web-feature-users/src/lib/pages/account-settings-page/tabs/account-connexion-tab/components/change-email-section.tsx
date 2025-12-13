import {ChangeEmailRequest, ReadUser} from '@maas/core-api-models';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@maas/web-components';
import {FormProvider} from 'react-hook-form';
import {createConnectedInputHelpers} from '@maas/web-form';
import {useChangeEmailForm} from '../hooks/use-change-email-form';

type ChangeEmailSectionProps = {
  user: ReadUser;
};

export const ChangeEmailSection = ({ user }: ChangeEmailSectionProps) => {
  const { form, handleSubmit, isLoading } = useChangeEmailForm(user);

  // TODO: Get verification status from user data when available
  const isVerified = true;

  const { ControlledTextInput } = createConnectedInputHelpers<ChangeEmailRequest>();

  return (
    <form id="change-email-form" onSubmit={handleSubmit}>
      <FormProvider {...form}>
        <Card className="rounded-2xl">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Email</CardTitle>
              <Badge
                variant="outline"
                className={
                  isVerified
                    ? 'gap-1.5 rounded-md border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700'
                    : 'gap-1.5 rounded-md border-muted bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground'
                }
              >
              <span
                className={`size-2 rounded-full ${
                  isVerified ? 'bg-emerald-400' : 'bg-muted-foreground/50'
                }`}
              />
                {isVerified ? 'Verified' : 'Not verified'}
              </Badge>
            </div>
            <CardDescription>
              If needed, change your email below, and we will send you a verification link.
            </CardDescription>
          </CardHeader>
          <CardContent>

            <ControlledTextInput
              name="newEmail"
              label="Email"
              direction="horizontal"
              className="py-6"
            />
          </CardContent>
          <CardFooter className="justify-end border-t">
            <Button type="submit" form="change-email-form" isLoading={isLoading}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </FormProvider>
    </form>
  );
};
