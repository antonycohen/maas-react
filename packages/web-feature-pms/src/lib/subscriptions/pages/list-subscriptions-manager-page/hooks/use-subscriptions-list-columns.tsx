import { ColumnDef } from '@tanstack/react-table';
import { Subscription, SubscriptionStatus } from '@maas/core-api-models';
import { Badge, Checkbox } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { cn } from '@maas/core-utils';
import { Link } from 'react-router';
import { IconEye, IconCreditCard } from '@tabler/icons-react';
import { useRoutes } from '@maas/core-workspace';
import { useTranslation } from '@maas/core-translations';

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

export function useSubscriptionsListColumns(): ColumnDef<Subscription>[] {
    const routes = useRoutes();
    const { t } = useTranslation();

    return [
        {
            id: 'select',
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            meta: {
                className: cn(
                    'sticky md:table-cell left-0 z-10 rounded-tl',
                    'transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted pr-2! md:pr-0'
                ),
            },
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('subscriptions.title')} />,
            cell: ({ row }) => {
                return (
                    <Link to={routes.pmsSubscriptionView(row.original.id)} className="flex items-center gap-3">
                        <div className="bg-muted h-10 w-10 shrink-0 overflow-hidden rounded-md">
                            <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                                <IconCreditCard className="h-5 w-5" />
                            </div>
                        </div>
                        <span className="font-mono text-xs underline">
                            {row.getValue('id')?.toString().slice(0, 8)}...
                        </span>
                    </Link>
                );
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.status')} />,
            cell: ({ row }) => {
                const status = row.getValue('status') as SubscriptionStatus | null;
                return <Badge variant={getStatusColor(status)}>{status || 'Unknown'}</Badge>;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'currentPeriodStart',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('subscriptions.periodStart')} />,
            cell: ({ row }) => {
                const date = row.getValue('currentPeriodStart');
                if (!date) return <span>-</span>;
                return <span>{new Date(date as string).toLocaleDateString()}</span>;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'currentPeriodEnd',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('subscriptions.periodEnd')} />,
            cell: ({ row }) => {
                const date = row.getValue('currentPeriodEnd');
                if (!date) return <span>-</span>;
                return <span>{new Date(date as string).toLocaleDateString()}</span>;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'cancelAtPeriodEnd',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('subscriptions.canceling')} />,
            cell: ({ row }) => {
                const cancelAtPeriodEnd = row.getValue('cancelAtPeriodEnd');
                if (cancelAtPeriodEnd) {
                    return <Badge variant="destructive">{t('common.yes')}</Badge>;
                }
                return <span className="text-muted-foreground">{t('common.no')}</span>;
            },
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <CollectionRowActions
                    row={row}
                    actions={[
                        {
                            label: t('subscriptions.viewSubscription'),
                            icon: IconEye,
                            linkTo: (subscription: Subscription) => routes.pmsSubscriptionView(subscription.id),
                        },
                    ]}
                />
            ),
        },
    ];
}
