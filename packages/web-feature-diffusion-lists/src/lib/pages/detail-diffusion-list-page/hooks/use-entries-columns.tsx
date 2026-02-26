import { ColumnDef } from '@tanstack/react-table';
import { DiffusionListEntry } from '@maas/core-api-models';
import { Badge, Button } from '@maas/web-components';
import { CollectionColumnHeader } from '@maas/web-collection';
import { IconTrash, IconAlertTriangle, IconRefresh } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';
import { useRoutes } from '@maas/core-workspace';
import { Link } from 'react-router';

export function useEntriesColumns(options?: {
    isDraft: boolean;
    onRemove?: (entry: DiffusionListEntry) => void;
    isRemoving?: boolean;
    onRefreshEntry?: (entry: DiffusionListEntry) => void;
    isRefreshingEntryId?: string | null;
}): ColumnDef<DiffusionListEntry>[] {
    const { t } = useTranslation();
    const routes = useRoutes();
    const { isDraft = false, onRemove, isRemoving, onRefreshEntry, isRefreshingEntryId } = options ?? {};

    const columns: ColumnDef<DiffusionListEntry>[] = [
        {
            accessorKey: 'firstName',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.firstName')} />,
            cell: ({ row }) => {
                const name = [row.original.firstName, row.original.lastName].filter(Boolean).join(' ');
                return name || '-';
            },
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'email',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.email')} />,
            cell: ({ row }) => {
                const email = row.getValue('email') as string | null;
                const customerId = row.original.customerId;
                if (!email) return '-';
                if (!customerId) return email;
                return (
                    <Link
                        to={routes.customerEdit(customerId)}
                        className="text-primary underline underline-offset-4 hover:opacity-80"
                    >
                        {email}
                    </Link>
                );
            },
        },
        {
            accessorKey: 'phone',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.phone')} />,
            cell: ({ row }) => row.getValue('phone') || '-',
            enableSorting: false,
        },
        {
            id: 'address',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.address')} />,
            cell: ({ row }) => {
                const entry = row.original;
                const parts = [entry.addressLine1, entry.addressPostalCode, entry.addressCity, entry.addressCountry];
                return parts.filter(Boolean).join(', ') || '-';
            },
            enableSorting: false,
        },
        {
            accessorKey: 'needsAttention',
            header: ({ column }) => (
                <CollectionColumnHeader column={column} title={t('diffusionLists.needsAttention')} />
            ),
            cell: ({ row }) => {
                const entry = row.original;
                if (!entry.needsAttention) return null;
                return (
                    <div className="flex flex-col gap-0.5">
                        <Badge variant="destructive" className="gap-1">
                            <IconAlertTriangle className="h-3 w-3" />
                            {t('diffusionLists.needsAttention')}
                        </Badge>
                        {entry.attentionReason && (
                            <span className="text-muted-foreground text-xs">{entry.attentionReason}</span>
                        )}
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'isManual',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.manual')} />,
            cell: ({ row }) => (row.original.isManual ? <Badge variant="outline">{t('field.manual')}</Badge> : null),
            enableSorting: false,
        },
    ];

    const hasActions = (isDraft && onRemove) || onRefreshEntry;
    if (hasActions) {
        columns.push({
            id: 'actions',
            cell: ({ row }) => {
                const entry = row.original;
                const isRefreshing = isRefreshingEntryId === entry.id;
                return (
                    <div className="flex items-center gap-1">
                        {onRefreshEntry && entry.needsAttention && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRefreshEntry(entry)}
                                disabled={isRefreshing}
                            >
                                <IconRefresh className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            </Button>
                        )}
                        {isDraft && onRemove && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onRemove(entry)}
                                disabled={isRemoving}
                                className="text-destructive hover:text-destructive"
                            >
                                <IconTrash className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            },
            meta: { className: 'w-24' },
        });
    }

    return columns;
}
