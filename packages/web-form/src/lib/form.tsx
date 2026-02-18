import { DefaultValues, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { PropsWithChildren, useId } from 'react';

type FormProps<T> = {
    defaultValues?: DefaultValues<T> | undefined;
};
export function Form<T extends FieldValues>(props: PropsWithChildren<FormProps<T>>) {
    const { defaultValues } = props;
    const form = useForm<T>({
        defaultValues: defaultValues,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    function onSubmit(_data: T) {}

    const id = useId();

    return (
        <form id={id} onSubmit={form.handleSubmit(onSubmit)}>
            <FormProvider {...form}>{props.children}</FormProvider>
        </form>
    );
}
