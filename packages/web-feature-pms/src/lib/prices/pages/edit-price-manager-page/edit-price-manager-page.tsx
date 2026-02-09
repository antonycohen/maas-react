import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Input,
    Label,
} from '@maas/web-components';
import { LayoutBreadcrumb, LayoutContent } from '@maas/web-layout';
import { useNavigate, useParams } from 'react-router-dom';
import { useDeletePrice, useGetPriceById, useUpdatePrice } from '@maas/core-api';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UpdatePrice } from '@maas/core-api-models';
import { IconDeviceFloppy, IconLoader2, IconTrash } from '@tabler/icons-react';
import { toast } from 'sonner';

export function EditPriceManagerPage() {
    const { priceId = '' } = useParams<{ priceId: string }>();
    const isCreateMode = priceId === 'new';
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();
    const navigate = useNavigate();

    const { data: price, isLoading } = useGetPriceById(
        {
            id: priceId,
            fields: {
                id: null,
                currency: null,
                unitAmountInCents: null,
                active: null,
                lookupKey: null,
                recurringInterval: null,
                recurringIntervalCount: null,
                recurringUsageType: null,
            },
        },
        {
            enabled: !isCreateMode,
        }
    );

    const form = useForm<UpdatePrice>({
        defaultValues: {
            active: true,
            lookupKey: '',
        },
    });

    useEffect(() => {
        if (price) {
            form.reset({
                active: price.active ?? true,
                lookupKey: price.lookupKey ?? '',
            });
        }
    }, [price, form]);

    const updateMutation = useUpdatePrice({
        onSuccess: () => {
            toast.success('Price updated successfully');
        },
    });

    const deleteMutation = useDeletePrice({
        onSuccess: () => {
            navigate(`${workspaceUrl}/pms/prices`);
            toast.success('Price deleted successfully');
        },
    });

    const onSubmit = (data: UpdatePrice) => {
        updateMutation.mutate({
            priceId,
            data,
        });
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this price?')) {
            deleteMutation.mutate(priceId);
        }
    };

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!price) {
        return <div className="flex h-screen items-center justify-center">Price not found</div>;
    }

    const formatPrice = (amount: number, currency: string): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.toUpperCase(),
        }).format(amount / 100);
    };

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: `${workspaceUrl}/` },
                        { label: 'Prices', to: `${workspaceUrl}/pms/prices` },
                        { label: formatPrice(price.unitAmountInCents ?? 0, price.currency ?? 'usd') },
                    ]}
                />
            </header>

            {/* Sticky Action Bar */}
            <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl font-semibold">
                        {formatPrice(price.unitAmountInCents ?? 0, price.currency ?? 'usd')}
                    </h1>
                    <Badge variant={price.active ? 'default' : 'secondary'}>
                        {price.active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>

                <div className="flex items-center gap-2">
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
                    <Button type="submit" size="sm" disabled={updateMutation.isPending}>
                        {updateMutation.isPending ? (
                            <>
                                <IconLoader2 className="mr-1.5 h-4 w-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <IconDeviceFloppy className="mr-1.5 h-4 w-4" />
                                Save
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <LayoutContent>
                <Card className="gap-0 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Price Details</CardTitle>
                        <CardDescription>
                            Update the price configuration. Note: Some fields cannot be modified after creation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Amount</Label>
                                    <p className="text-lg font-semibold">
                                        {formatPrice(price.unitAmountInCents ?? 0, price.currency ?? 'usd')}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Currency</Label>
                                    <p className="text-lg">{price.currency?.toUpperCase()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground">Billing Interval</Label>
                                    <p>
                                        {price.recurringInterval
                                            ? `${price.recurringIntervalCount ?? 1} ${price.recurringInterval}`
                                            : 'One-time'}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Usage Type</Label>
                                    <p>{price.recurringUsageType || '-'}</p>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="lookupKey">Lookup Key</Label>
                                        <Input
                                            id="lookupKey"
                                            placeholder="e.g., monthly_basic"
                                            {...form.register('lookupKey')}
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="active"
                                            {...form.register('active')}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="active">Active</Label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </LayoutContent>
        </form>
    );
}
