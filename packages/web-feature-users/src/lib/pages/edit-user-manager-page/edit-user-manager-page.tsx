import { useParams, Link } from 'react-router';
import { LayoutBreadcrumb, LayoutContent, LayoutHeader } from '@maas/web-layout';
import { useRoutes } from '@maas/core-workspace';
import { createConnectedInputHelpers } from '@maas/web-form';
import { Button, Field, FieldGroup } from '@maas/web-components';
import { useGetUserById, useCreateUserCustomer } from '@maas/core-api';
import { FormProvider, useForm } from 'react-hook-form';
import { User, userSchema } from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from '@maas/core-translations';
import { IconExternalLink, IconPlus } from '@tabler/icons-react';

export function EditUserManagerPage() {
    const { userId = '' } = useParams<{ userId: string }>();
    const routes = useRoutes();
    const { t } = useTranslation();
    const { data: user } = useGetUserById({
        id: userId,
        fields: {
            firstName: null,
            lastName: null,
            email: null,
            customer: null,
        },
    });

    const { mutate: createCustomer, isPending: isCreatingCustomer } = useCreateUserCustomer();

    const form = useForm<User>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
        },
        values: user,
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function onSubmit(_data: User) {}

    if (!user) {
        return <div>Loading...</div>;
    }

    const { ControlledTextInput, ControlledImageInput } = createConnectedInputHelpers<User>();

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: routes.root() },
                        { label: t('nav.users'), to: routes.users() },
                        { label: `${userId}` },
                    ]}
                />
            </header>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('users.editPageTitle')}
                    actions={
                        user.customer ? (
                            <Button variant="outline" asChild>
                                <Link to={routes.customerEdit(user.customer.id)}>
                                    <IconExternalLink className="mr-2 h-4 w-4" />
                                    {t('users.viewStripeCustomer')}
                                </Link>
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                disabled={isCreatingCustomer}
                                onClick={(e) => {
                                    e.preventDefault();
                                    createCustomer({ userId }, { onSuccess: () => window.location.reload() });
                                }}
                            >
                                <IconPlus className="mr-2 h-4 w-4" />
                                {t('users.createStripeCustomer')}
                            </Button>
                        )
                    }
                />
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormProvider {...form}>
                        <FieldGroup>
                            <ControlledTextInput name={'email'} label={t('users.email')} readOnly />
                            <ControlledTextInput name={'firstName'} label={t('users.firstName')} />
                            <ControlledTextInput name={'lastName'} label={t('users.lastName')} />
                            <ControlledImageInput name={'profileImage'} label={'Image'} />
                            <Field orientation="horizontal">
                                <Button type="button" variant="outline" onClick={() => form.reset()}>
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
