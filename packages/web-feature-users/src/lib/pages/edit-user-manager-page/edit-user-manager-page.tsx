import { useParams } from 'react-router-dom';
import {
  LayoutBreadcrumb,
  LayoutContent,
  LayoutHeader,
} from '@maas/web-layout';

import {
  ControlledTextareaInput,
  createConnectedInputHelpers,
} from '@maas/web-form';
import { Button, Field, FieldGroup } from '@maas/web-components';
import { useGetUserById } from '@maas/core-api';
import { FormProvider, useForm } from 'react-hook-form';
import { User, userSchema } from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';

export function EditUserManagerPage() {
  const { userId = '' } = useParams<{ userId: string }>();
  const { data: user } = useGetUserById({
    id: userId,
    fields: {
      firstName: null,
      lastName: null,
      email: null,
    },
  });

  const form = useForm<User>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
    values: user,
  });

  function onSubmit(data: User) {
    console.log(data);
  }

  console.log('user', user);
  if (!user) {
    return <div>Loading...</div>;
  }

  const { ControlledTextInput, ControlledImageInput } = createConnectedInputHelpers<User>();

  return (
    <div>
      <header>
        <LayoutBreadcrumb
          items={[
            { label: 'Home', to: '/' },
            { label: 'Users', to: '/users' },
            { label: `${userId}` },
          ]}
        />
        <LayoutHeader pageTitle={'Détail User'} />
      </header>
      <LayoutContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormProvider {...form}>
            <FieldGroup>
              <ControlledTextInput name={'firstName'} label={'First Name'} />
              <ControlledTextareaInput name={'lastName'} label={'Last Name'} />
              <ControlledImageInput name={'profileImage'} label={"Image"}/>
              <Field orientation="horizontal">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button type="submit">Submit</Button>
              </Field>
            </FieldGroup>
          </FormProvider>
        </form>
      </LayoutContent>
    </div>
  );
}
