import { ColumnDef } from '@tanstack/react-table';
import { DiffusionListEntry } from '@maas/core-api-models';
import { Badge, Button } from '@maas/web-components';
import { CollectionColumnHeader } from '@maas/web-collection';
import { IconTrash } from '@tabler/icons-react';
import { useTranslation } from '@maas/core-translations';

export function useEntriesColumns(options?: {
    isDraft: boolean;
    onRemove?: (entry: DiffusionListEntry) => void;
    isRemoving?: boolean;
}): ColumnDef<DiffusionListEntry>[] {
    const { t } = useTranslation();
    const { isDraft = false, onRemove, isRemoving } = options ?? {};

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
            cell: ({ row }) => row.getValue('email') || '-',
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
            accessorKey: 'isManual',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.manual')} />,
            cell: ({ row }) => (row.original.isManual ? <Badge variant="outline">{t('field.manual')}</Badge> : null),
            enableSorting: false,
        },
    ];

    if (isDraft && onRemove) {
        columns.push({
            id: 'actions',
            cell: ({ row }) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(row.original)}
                    disabled={isRemoving}
                    className="text-destructive hover:text-destructive"
                >
                    <IconTrash className="h-4 w-4" />
                </Button>
            ),
            meta: { className: 'w-16' },
        });
    }

    return columns;
}
