import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@maas/web-components';
import { LayoutBreadcrumb, LayoutContent } from '@maas/web-layout';
import { useParams } from 'react-router-dom';
import {
    useGetSubscriptionById,
    useCancelSubscriptionAtPeriodEnd,
    useCancelSubscriptionImmediately,
    useResumeSubscription,
    useSyncSubscription,
} from '@maas/core-api';
import { useCurrentWorkspaceUrlPrefix } from '@maas/core-workspace';
import { SubscriptionStatus } from '@maas/core-api-models';
import { IconRefresh, IconPlayerPause, IconPlayerPlay, IconX } from '@tabler/icons-react';
import { toast } from 'sonner';

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

export function ViewSubscriptionManagerPage() {
    const { subscriptionId = '' } = useParams<{ subscriptionId: string }>();
    const workspaceUrl = useCurrentWorkspaceUrlPrefix();

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
            canceledAt: null,
            metadata: null,
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

    return (
        <div>
            <header>
                <LayoutBreadcrumb
                    items={[
                        { label: 'Home', to: `${workspaceUrl}/` },
                        { label: 'Subscriptions', to: `${workspaceUrl}/pms/subscriptions` },
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
                                onClick={() => {
                                    if (
                                        window.confirm('Are you sure you want to cancel this subscription immediately?')
                                    ) {
                                        cancelImmediatelyMutation.mutate(subscriptionId);
                                    }
                                }}
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
                <Card className="gap-0 rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xl">Subscription Details</CardTitle>
                        <CardDescription>View and manage this subscription.</CardDescription>
                    </CardHeader>
                    <CardContent className="px-6 pt-2">
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Status</p>
                                    <Badge variant={getStatusColor(subscription.status)} className="mt-1">
                                        {subscription.status}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">ID</p>
                                    <p className="font-mono text-sm">{subscription.id}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Current Period Start</p>
                                    <p>
                                        {subscription.currentPeriodStart
                                            ? new Date(subscription.currentPeriodStart).toLocaleString()
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Current Period End</p>
                                    <p>
                                        {subscription.currentPeriodEnd
                                            ? new Date(subscription.currentPeriodEnd).toLocaleString()
                                            : '-'}
                                    </p>
                                </div>
                            </div>

                            {subscription.canceledAt && (
                                <div>
                                    <p className="text-muted-foreground text-sm font-medium">Canceled At</p>
                                    <p>{new Date(subscription.canceledAt).toLocaleString()}</p>
                                </div>
                            )}

                            {subscription.metadata && Object.keys(subscription.metadata).length > 0 && (
                                <div className="border-t pt-6">
                                    <p className="text-muted-foreground mb-2 text-sm font-medium">Metadata</p>
                                    <pre className="bg-muted/50 overflow-auto rounded-lg p-4 text-xs">
                                        {JSON.stringify(subscription.metadata, null, 2)}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </LayoutContent>
        </div>
    );
}

function cn(...classes: (string | boolean | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}
