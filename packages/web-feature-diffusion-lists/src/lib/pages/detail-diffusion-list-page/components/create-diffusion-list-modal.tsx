import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Button,
    Input,
    Label,
    Textarea,
    Checkbox,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    useResizedImage,
} from '@maas/web-components';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateDiffusionList, createDiffusionListSchema } from '@maas/core-api-models';
import { useCreateDiffusionList, useGetFeatures, useGetBrands, useGetIssues } from '@maas/core-api';
import { useGetCurrentWorkspaceId, useRoutes } from '@maas/core-workspace';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';
import { IconLoader2 } from '@tabler/icons-react';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from '@maas/core-utils';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CreateDiffusionListModal = ({ open, onOpenChange }: Props) => {
    const { t, isKeyExist } = useTranslation();
    const organizationId = useGetCurrentWorkspaceId();
    const routes = useRoutes();
    const navigate = useNavigate();

    const { data: featuresData } = useGetFeatures(
        {
            offset: 0,
            limit: 100,
            fields: { id: null, lookupKey: null, displayName: null, withQuota: null, currentIssueNumber: null },
        },
        { enabled: open }
    );

    const { data: brandsData } = useGetBrands(
        {
            offset: 0,
            limit: 100,
            fields: { id: null, name: null, lookupKey: null },
        },
        { enabled: open }
    );

    const quotaFeatures = (featuresData?.data ?? []).filter((f) => f?.lookupKey !== 'digital_access' && f.withQuota);

    // Map featureKey (lookupKey) → brandId
    const featureKeyToBrandId = useMemo(() => {
        const map: Record<string, string> = {};
        for (const brand of brandsData?.data ?? []) {
            if (brand.lookupKey) {
                map[brand.lookupKey] = brand.id;
            }
        }
        return map;
    }, [brandsData]);

    const form = useForm<CreateDiffusionList>({
        resolver: zodResolver(createDiffusionListSchema),
        defaultValues: {
            name: '',
            features: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'features',
    });

    const selectedFeatureKeys = fields.map((f) => f.featureKey);

    const toggleFeature = (lookupKey: string) => {
        const index = selectedFeatureKeys.indexOf(lookupKey);
        if (index >= 0) {
            remove(index);
        } else {
            append({
                featureKey: lookupKey,
                issueNumber: 0,
            });
        }
    };

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

    const getFeatureLabel = (lookupKey: string) => {
        const key = `diffusionLists.featureKey.${lookupKey}`;
        return isKeyExist(key) ? t(key) : lookupKey;
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(value) => {
                if (!value) form.reset();
                onOpenChange(value);
            }}
        >
            <DialogContent className="max-w-lg">
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
                        <Label>{t('diffusionLists.features')}</Label>
                        <div className="space-y-3">
                            {quotaFeatures.map((feature) => {
                                const lookupKey = feature.lookupKey ?? feature.id;
                                const isSelected = selectedFeatureKeys.includes(lookupKey);
                                const fieldIndex = selectedFeatureKeys.indexOf(lookupKey);
                                const brandId = featureKeyToBrandId[lookupKey];

                                return (
                                    <div key={feature.id} className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                checked={isSelected}
                                                onCheckedChange={() => toggleFeature(lookupKey)}
                                            />
                                            <span className="text-sm font-medium">
                                                {feature.displayName ?? getFeatureLabel(lookupKey)}
                                            </span>
                                        </div>
                                        {isSelected && fieldIndex >= 0 && (
                                            <div className="ml-7">
                                                {brandId ? (
                                                    <IssueSelect
                                                        brandId={brandId}
                                                        fieldIndex={fieldIndex}
                                                        form={form}
                                                    />
                                                ) : (
                                                    <Input
                                                        type="number"
                                                        className="h-8 w-32"
                                                        placeholder={t('diffusionLists.issueNumber')}
                                                        {...form.register(`features.${fieldIndex}.issueNumber`, {
                                                            valueAsNumber: true,
                                                        })}
                                                    />
                                                )}
                                                {form.formState.errors.features?.[fieldIndex]?.issueNumber && (
                                                    <p className="text-destructive mt-1 text-xs">
                                                        {
                                                            form.formState.errors.features[fieldIndex].issueNumber
                                                                ?.message
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        {form.formState.errors.features && (
                            <p className="text-destructive text-sm">
                                {form.formState.errors.features.message ?? form.formState.errors.features.root?.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="comments">{t('diffusionLists.comments')}</Label>
                        <Textarea
                            id="comments"
                            {...form.register('comments')}
                            placeholder={t('diffusionLists.commentsPlaceholder')}
                            rows={3}
                        />
                        {form.formState.errors.comments && (
                            <p className="text-destructive text-sm">{form.formState.errors.comments.message}</p>
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

function IssueSelect({
    brandId,
    fieldIndex,
    form,
}: {
    brandId: string;
    fieldIndex: number;
    form: ReturnType<typeof useForm<CreateDiffusionList>>;
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const { data: issuesData } = useGetIssues({
        offset: 0,
        limit: 200,
        fields: { id: null, title: null, issueNumber: null, cover: { fields: { resizedImages: null } } },
        filters: { brandId },
        sort: { field: 'issueNumber', direction: 'desc' },
    });

    const issues = (issuesData?.data ?? []).filter((i) => i.issueNumber != null && i.issueNumber !== '');

    return (
        <Controller
            control={form.control}
            name={`features.${fieldIndex}.issueNumber`}
            render={({ field }) => {
                const selected = issues.find((i) => Number(i.issueNumber) === field.value);
                return (
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="h-8 w-64 justify-between font-normal"
                            >
                                {selected ? (
                                    <span className="flex items-center gap-2 truncate">
                                        <IssueCover images={selected.cover?.resizedImages} />
                                        <span className="truncate">
                                            {selected.title} (#{selected.issueNumber})
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground">{t('diffusionLists.selectIssue')}</span>
                                )}
                                <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                            <Command>
                                <CommandInput placeholder={t('diffusionLists.searchIssue')} />
                                <CommandList>
                                    <CommandEmpty>{t('diffusionLists.noIssuesAvailable')}</CommandEmpty>
                                    <CommandGroup>
                                        {issues.map((issue) => {
                                            const num = Number(issue.issueNumber);
                                            const isSelected = num === field.value;
                                            return (
                                                <CommandItem
                                                    key={issue.id}
                                                    value={`${issue.title} ${issue.issueNumber ?? ''}`}
                                                    onSelect={() => {
                                                        field.onChange(num);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <CheckIcon
                                                        className={cn(
                                                            'mr-1 h-4 w-4',
                                                            isSelected ? 'opacity-100' : 'opacity-0'
                                                        )}
                                                    />
                                                    <IssueCover images={issue.cover?.resizedImages} />
                                                    <span className="truncate">
                                                        {issue.title} (#{issue.issueNumber})
                                                    </span>
                                                </CommandItem>
                                            );
                                        })}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                );
            }}
        />
    );
}

function IssueCover({ images }: { images?: { url: string; width: number; height: number; mode: string }[] | null }) {
    const { resizedImage } = useResizedImage({ images, width: 80 });
    if (!resizedImage) return null;
    return <img src={resizedImage.url} alt="" className="h-6 w-auto shrink-0 rounded-sm object-cover" />;
}
