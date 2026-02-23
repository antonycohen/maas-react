import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    ConfirmActionDialog,
} from '@maas/web-components';
import { LayoutBreadcrumb, LayoutContent } from '@maas/web-layout';
import { Link, useParams } from 'react-router';
import {
    useGetSubscriptionById,
    useCancelSubscriptionAtPeriodEnd,
    useCancelSubscriptionImmediately,
    useResumeSubscription,
    useSyncSubscription,
} from '@maas/core-api';
import { useRoutes } from '@maas/core-workspace';
import { SubscriptionStatus } from '@maas/core-api-models';
import { cn } from '@maas/core-utils';
import { IconRefresh, IconPlayerPause, IconPlayerPlay, IconX, IconCopy, IconCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useState } from 'react';

const getStatusColor = (status: SubscriptionStatus | null): 'default' | 'secondary' | 'destructive' | 'outline' => {
    switch (status) {
        case 'active':
            return 'default';
        case 'trialing':
            return 'outline';
        case 'past_due':
        case 'unpaid':
            return 'destructive';
        case 'canceled':
        case 'incomplete':
        case 'incomplete_expired':
        case 'paused':
        default:
            return 'secondary';
    }
};

function CopyField({ value }: { value: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-muted/50 flex items-center gap-2 rounded-md border px-3 py-2">
            <span className="min-w-0 flex-1 truncate font-mono text-sm">{value}</span>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
                {copied ? <IconCheck className="h-4 w-4 text-green-500" /> : <IconCopy className="h-4 w-4" />}
            </Button>
        </div>
    );
}

export function ViewSubscriptionManagerPage() {
    const { subscriptionId = '' } = useParams<{ subscriptionId: string }>();
    const routes = useRoutes();
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

    const {
        data: subscription,
        isLoading,
        refetch,
    } = useGetSubscriptionById({
        id: subscriptionId,
        fields: {
            id: null,
            status: null,
            currentPeriodStart: null,
            currentPeriodEnd: null,
            cancelAtPeriodEnd: null,
            customer: {
                fields: {
                    id: null,
                    email: null,
                    refId: null,
                },
            },
            canceledAt: null,
            metadata: null,
            plan: null,
        },
    });
    const cancelAtPeriodEndMutation = useCancelSubscriptionAtPeriodEnd({
        onSuccess: () => {
            toast.success('Subscription will be canceled at period end');
            refetch();
        },
        onError: () => {
            toast.error('Failed to cancel subscription');
        },
    });

    const cancelImmediatelyMutation = useCancelSubscriptionImmediately({
        onSuccess: () => {
            toast.success('Subscription canceled immediately');
            refetch();
        },
        onError: () => {
            toast.error('Failed to cancel subscription');
        },
    });

    const resumeMutation = useResumeSubscription({
        onSuccess: () => {
            toast.success('Subscription resumed');
            refetch();
        },
        onError: () => {
            toast.error('Failed to resume subscription');
        },
    });

    const syncMutation = useSyncSubscription({
        onSuccess: () => {
            toast.success('Subscription synced from Stripe');
            refetch();
        },
        onError: () => {
            toast.error('Failed to sync subscription');
        },
    });

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!subscription) {
        return <div className="flex h-screen items-center justify-center">Subscription not found</div>;
    }

    const isActive = subscription.status === 'active' || subscription.status === 'trialing';
    const isCancelingAtPeriodEnd = subscription.cancelAtPeriodEnd;

    const confirmCancelImmediately = () => {
        cancelImmediatelyMutation.mutate(subscriptionId);
    };

    return (
        <>
            <div>
                <header>
                    <LayoutBreadcrumb
                        items={[
                            { label: 'Home', to: routes.root() },
                            { label: 'Subscriptions', to: routes.pmsSubscriptions() },
                            { label: subscription.id.slice(0, 8) + '...' },
                        ]}
                    />
                </header>

                {/* Sticky Action Bar */}
                <div className="bg-background sticky top-0 z-10 flex items-center justify-between border-b px-6 py-3">
                    <div className="flex items-center gap-3">
                        <h1 className="font-mono text-xl font-semibold">{subscription.id.slice(0, 8)}...</h1>
                        <Badge variant={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                        {isCancelingAtPeriodEnd && <Badge variant="destructive">Canceling at Period End</Badge>}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => syncMutation.mutate(subscriptionId)}
                            disabled={syncMutation.isPending}
                        >
                            <IconRefresh className={cn('mr-1.5 h-4 w-4', syncMutation.isPending && 'animate-spin')} />
                            Sync
                        </Button>
                        {isActive && !isCancelingAtPeriodEnd && (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => cancelAtPeriodEndMutation.mutate(subscriptionId)}
                                    disabled={cancelAtPeriodEndMutation.isPending}
                                >
                                    <IconPlayerPause className="mr-1.5 h-4 w-4" />
                                    Cancel at Period End
                                </Button>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setCancelDialogOpen(true)}
                                    disabled={cancelImmediatelyMutation.isPending}
                                >
                                    <IconX className="mr-1.5 h-4 w-4" />
                                    Cancel Now
                                </Button>
                            </>
                        )}
                        {isCancelingAtPeriodEnd && (
                            <Button
                                type="button"
                                variant="default"
                                size="sm"
                                onClick={() => resumeMutation.mutate(subscriptionId)}
                                disabled={resumeMutation.isPending}
                            >
                                <IconPlayerPlay className="mr-1.5 h-4 w-4" />
                                Resume
                            </Button>
                        )}
                    </div>
                </div>

                <LayoutContent>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Left: Details */}
                        <div className="lg:col-span-2">
                            <Card className="gap-0 rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Subscription Details</CardTitle>
                                    <CardDescription>View and manage this subscription.</CardDescription>
                                </CardHeader>
                                <CardContent className="px-6 pt-2">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-muted-foreground mb-1 text-sm font-medium">
                                                Subscription ID
                                            </p>
                                            <CopyField value={subscription.id} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-muted-foreground text-sm font-medium">Status</p>
                                                <Badge variant={getStatusColor(subscription.status)} className="mt-1">
                                                    {subscription.status}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-sm font-medium">Plan</p>
                                                {subscription.plan ? (
                                                    <p className="mt-1 text-sm font-medium">
                                                        {subscription.plan.name ?? subscription.plan.id}
                                                    </p>
                                                ) : (
                                                    <p className="text-muted-foreground mt-1 text-sm">-</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-muted-foreground text-sm font-medium">User</p>
                                            {subscription.customer ? (
                                                <div className="mt-1">
                                                    <Link
                                                        to={routes.customerEdit(subscription.customer.id)}
                                                        className="text-primary text-sm font-medium underline underline-offset-4 hover:opacity-80"
                                                    >
                                                        {subscription.customer.name ??
                                                            subscription.customer.email ??
                                                            subscription.customer.id}
                                                    </Link>
                                                    {subscription.customer.email && subscription.customer.name && (
                                                        <p className="text-muted-foreground text-xs">
                                                            {subscription.customer.email}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-muted-foreground mt-1 text-sm">-</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-muted-foreground text-sm font-medium">
                                                    Current Period Start
                                                </p>
                                                <p className="mt-1 text-sm">
                                                    {subscription.currentPeriodStart
                                                        ? new Date(subscription.currentPeriodStart).toLocaleString()
                                                        : '-'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground text-sm font-medium">
                                                    Current Period End
                                                </p>
                                                <p className="mt-1 text-sm">
                                                    {subscription.currentPeriodEnd
                                                        ? new Date(subscription.currentPeriodEnd).toLocaleString()
                                                        : '-'}
                                                </p>
                                            </div>
                                        </div>

                                        {subscription.canceledAt && (
                                            <div>
                                                <p className="text-muted-foreground text-sm font-medium">Canceled At</p>
                                                <p className="mt-1 text-sm">
                                                    {new Date(subscription.canceledAt).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right: Metadata */}
                        <div>
                            <Card className="gap-0 rounded-2xl">
                                <CardHeader>
                                    <CardTitle className="text-xl">Metadata</CardTitle>
                                </CardHeader>
                                <CardContent className="px-6 pt-2">
                                    {subscription.metadata && Object.keys(subscription.metadata).length > 0 ? (
                                        <pre className="bg-muted/50 overflow-auto rounded-lg p-4 text-xs">
                                            {JSON.stringify(subscription.metadata, null, 2)}
                                        </pre>
                                    ) : (
                                        <p className="text-muted-foreground text-sm">No metadata available.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </LayoutContent>
            </div>

            <ConfirmActionDialog
                open={cancelDialogOpen}
                onOpenChange={setCancelDialogOpen}
                onConfirm={confirmCancelImmediately}
                title="Cancel Subscription"
                description="Are you sure you want to cancel this subscription immediately?"
                confirmLabel="Cancel Now"
                isLoading={cancelImmediatelyMutation.isPending}
            />
        </>
    );
}
