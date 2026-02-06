import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Checkbox,
    Input,
    Label,
    Textarea,
} from '@maas/web-components';
import { LayoutBreadcrumb, LayoutContent } from '@maas/web-layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateFeature, useDeleteFeature, useGetFeatureById, useUpdateFeature } from '@maas/core-api';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CreateFeature, UpdateFeature } from '@maas/core-api-models';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';

type FeatureFormValues = CreateFeature | UpdateFeature;

export function EditFeatureManagerPage() {
    const { featureId = '' } = useParams<{ featureId: string }>();
    const isCreateMode = featureId === 'new';
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();
    const navigate = useNavigate();

    const { data: feature, isLoading } = useGetFeatureById(
        {
            id: featureId,
            fields: {
                id: null,
                displayName: null,
                lookupKey: null,
                withQuota: null,
                quotaAggregationFormula: null,
            },
        },
        {
            enabled: !isCreateMode,
        }
    );

    const form = useForm<FeatureFormValues>({
        defaultValues: {
            displayName: '',
            lookupKey: '',
            withQuota: false,
            quotaAggregationFormula: null,
        },
    });

    useEffect(() => {
        if (feature) {
            form.reset({
                displayName: feature.displayName ?? '',
                lookupKey: feature.lookupKey ?? '',
                withQuota: feature.withQuota ?? false,
                quotaAggregationFormula: feature.quotaAggregationFormula ?? null,
            });
        }
    }, [feature, form]);

    const createMutation = useCreateFeature({
        onSuccess: (data) => {
            navigate(`${workspaceUrl}/pms/features/${data.id}`);
            toast.success('Feature created successfully');
        },
    });

    const updateMutation = useUpdateFeature({
        onSuccess: () => {
            toast.success('Feature updated successfully');
        },
    });

    const deleteMutation = useDeleteFeature({
        onSuccess: () => {
            navigate(`${workspaceUrl}/pms/features`);
            toast.success('Feature deleted successfully');
        },
    });

    const onSubmit = (data: FeatureFormValues) => {
        if (isCreateMode) {
            createMutation.mutate(data as CreateFeature);
        } else {
            updateMutation.mutate({
                featureId,
                data: data as UpdateFeature,
            });
        }
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this feature?')) {
            deleteMutation.mutate(featureId);
        }
    };

    if (!isCreateMode && isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isCreateMode && !feature) {
        return <div className="flex h-screen items-center justify-center">Feature not found</div>;
    }

    const isSaving = createMutation.isPending || updateMutation.isPending;
    const pageTitle = isCreateMode ? 'New Feature' : (feature?.displayName ?? '');

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: `${workspaceUrl}/` },
                        { label: 'Features', to: `${workspaceUrl}/pms/features` },
                        { label: isCreateMode ? 'New' : (feature?.displayName ?? '') },
                    ]}
                />
            </header>

            {/* Sticky Action Bar */}
            <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold">{pageTitle || 'Untitled'}</h1>
                    {feature?.withQuota && <Badge variant="outline">Has Quota</Badge>}
                </div>

                <div className="flex items-center gap-2">
                    {!isCreateMode && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            <IconTrash className="mr-1.5 h-4 w-4" />
                            Delete
                        </Button>
                    )}
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => form.reset()}
                        disabled={!form.formState.isDirty}
                    >
                        Discard
                    </Button>
                    <Button type="submit" size="sm" disabled={isSaving}>
                        {isSaving ? (
                            <>
                                <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                                {isCreateMode ? 'Create' : 'Save'}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <LayoutContent>
                <Card className="gap-0 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">{isCreateMode ? 'Create Feature' : 'Feature Details'}</CardTitle>
                        <CardDescription>
                            {isCreateMode
                                ? 'Fill in the details to create a new feature.'
                                : 'Update the feature configuration.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">Display Name</Label>
                                <Input
                                    id="displayName"
                                    placeholder="e.g., API Calls"
                                    {...form.register('displayName')}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="lookupKey">Lookup Key</Label>
                                <Input
                                    id="lookupKey"
                                    placeholder="e.g., api_calls"
                                    className="font-mono"
                                    {...form.register('lookupKey')}
                                />
                                <p className="text-muted-foreground text-sm">
                                    A unique identifier for this feature, used in code.
                                </p>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="withQuota"
                                    checked={form.watch('withQuota') ?? false}
                                    onCheckedChange={(checked) => form.setValue('withQuota', checked === true)}
                                />
                                <Label htmlFor="withQuota">Enable Quota</Label>
                            </div>

                            {form.watch('withQuota') && (
                                <div className="space-y-2">
                                    <Label htmlFor="quotaAggregationFormula">Quota Aggregation Formula</Label>
                                    <Textarea
                                        id="quotaAggregationFormula"
                                        placeholder="e.g., SUM(usage)"
                                        className="min-h-[100px] font-mono"
                                        {...form.register('quotaAggregationFormula')}
                                    />
                                    <p className="text-muted-foreground text-sm">
                                        Optional. Define how quota usage is aggregated.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </LayoutContent>
        </form>
    );
}
