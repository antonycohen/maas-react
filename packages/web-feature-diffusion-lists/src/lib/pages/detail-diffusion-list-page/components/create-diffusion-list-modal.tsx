import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Button,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@maas/web-components';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateDiffusionList, createDiffusionListSchema } from '@maas/core-api-models';
import { useCreateDiffusionList, useGetFeatures } from '@maas/core-api';
import { useGetCurrentWorkspaceId, useRoutes } from '@maas/core-workspace';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';
import { IconLoader2 } from '@tabler/icons-react';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateDiffusionListModal = ({ open, onOpenChange }: Props) => {
    const { t } = useTranslation();
    const organizationId = useGetCurrentWorkspaceId();
    const routes = useRoutes();
    const navigate = useNavigate();

    const { data: featuresData } = useGetFeatures(
        {
            offset: 0,
            limit: 100,
            fields: { id: null, lookupKey: null, displayName: null, withQuota: null },
        },
        { enabled: open }
    );

    const quotaFeatures = (featuresData?.data ?? []).filter((f) => f.withQuota);

    const form = useForm<CreateDiffusionList>({
        resolver: zodResolver(createDiffusionListSchema),
        defaultValues: {
            name: '',
            type: '',
        },
    });

    const createMutation = useCreateDiffusionList({
        onSuccess: (data) => {
            onOpenChange(false);
            form.reset();
            navigate(routes.diffusionListDetail(data.id));
            toast.success(t('diffusionLists.createdSuccess'));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onSubmit = (data: CreateDiffusionList) => {
        if (!organizationId) return;
        createMutation.mutate({
            organizationId,
            data,
        });
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) form.reset();
                onOpenChange(value);
            }}
        >
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('diffusionLists.new')}</DialogTitle>
                    <DialogDescription>{t('diffusionLists.createDescription')}</DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">{t('field.name')}</Label>
                        <Input id="name" {...form.register('name')} placeholder={t('diffusionLists.namePlaceholder')} />
                        {form.formState.errors.name && (
                            <p className="text-destructive text-sm">{form.formState.errors.name.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">{t('field.type')}</Label>
                        <Select
                            value={form.watch('type')}
                            onValueChange={(value) =>
                                form.setValue('type', value, { shouldValidate: true, shouldDirty: true })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder={t('diffusionLists.selectType')} />
                            </SelectTrigger>
                            <SelectContent>
                                {quotaFeatures.map((feature) => (
                                    <SelectItem key={feature.id} value={feature.lookupKey ?? feature.id}>
                                        {feature.displayName ?? feature.lookupKey ?? feature.id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.formState.errors.type && (
                            <p className="text-destructive text-sm">{form.formState.errors.type.message}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? (
                                <>
                                    <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                    {t('common.creating')}
                                </>
                            ) : (
                                t('common.create')
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
