import { ColumnDef } from '@tanstack/react-table';
import { DiffusionListEntry } from '@maas/core-api-models';
import {
    Badge,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@maas/web-components';
import { CollectionColumnHeader } from '@maas/web-collection';
import { IconTrash, IconAlertTriangle, IconDotsVertical, IconEye } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';
import { useRoutes } from '@maas/core-workspace';
import { Link } from 'react-router';

export function useEntriesColumns(options?: {
    isDraft: boolean;
    onRemove?: (entry: DiffusionListEntry) => void;
    onPreview?: (entry: DiffusionListEntry) => void;
    isRemoving?: boolean;
}): ColumnDef<DiffusionListEntry>[] {
    const { t, isKeyExist } = useTranslation();
    const routes = useRoutes();
    const { isDraft = false, onRemove, onPreview, isRemoving } = options ?? {};

    const columns: ColumnDef<DiffusionListEntry>[] = [
        {
            accessorKey: 'name',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.name')} />,
            cell: ({ row }) => row.original.name || '-',
            meta: { className: 'w-48' },
        },
        {
            accessorKey: 'email',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.email')} />,
            cell: ({ row }) => {
                const email = row.getValue('email') as string | null;
                const refId = row.original.refId;
                const refType = row.original.refType;
                if (!email) return '-';
                if (!refId || refType !== 'customer') return email;
                return (
                    <Link
                        to={routes.customerEdit(refId)}
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
            accessorKey: 'features',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('diffusionLists.features')} />,
            cell: ({ row }) => {
                const features = row.original.features;
                if (!features) return '-';
                const included = Object.entries(features).filter(([, feat]) => feat.hasQuota);
                if (included.length === 0) return '-';
                return (
                    <div className="flex flex-wrap gap-1">
                        {included.map(([key, feat]) => {
                            const tKey = `diffusionLists.featureKey.${key}`;
                            const label = isKeyExist(tKey) ? t(tKey) : key;
                            return (
                                <Badge key={key} variant="default" className="text-xs">
                                    {label} {feat.issueNumber != null ? `#${feat.issueNumber}` : ''}
                                </Badge>
                            );
                        })}
                    </div>
                );
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
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('diffusionLists.freeEntry')} />,
            cell: ({ row }) =>
                row.original.isManual ? <Badge variant="outline">{t('diffusionLists.freeEntry')}</Badge> : null,
            enableSorting: false,
        },
        {
            id: 'actions',
            cell: ({ row }) => {
                const entry = row.original;

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <IconDotsVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {onPreview && (
                                <DropdownMenuItem onClick={() => onPreview(entry)}>
                                    <IconEye className="mr-2 h-4 w-4" />
                                    {t('common.preview')}
                                </DropdownMenuItem>
                            )}
                            {isDraft && onRemove && (
                                <DropdownMenuItem
                                    onClick={() => onRemove(entry)}
                                    disabled={isRemoving}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <IconTrash className="mr-2 h-4 w-4" />
                                    {t('common.remove')}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
            meta: { className: 'w-12' },
        },
    ];

    return columns;
}
