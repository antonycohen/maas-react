import { ColumnDef } from '@tanstack/react-table';
import { OrganizationMember } from '@maas/core-api-models';
import { Avatar, AvatarFallback, AvatarImage, Badge } from '@maas/web-components';
import { CollectionColumnHeader, CollectionRowActions } from '@maas/web-collection';
import { format } from 'date-fns';
import { IconBan, IconCircleCheck } from '@tabler/icons-react';
import { Trash, UserCog } from 'lucide-react';
import { useTranslation } from '@maas/core-translations';

const roleVariants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    ADMIN: 'default',
    MEMBER: 'secondary',
    OWNER: 'default',
    VIEWER: 'secondary',
    EDITOR: 'secondary',
};

const statusColors: Record<string, string> = {
    accepted: 'bg-emerald-400',
    invited: 'bg-amber-400',
    suspended: 'bg-rose-500',
};

type UseTeamMembersColumnsOptions = {
    organizationId: string;
    onChangeRole?: (member: OrganizationMember) => void;
    onSuspendMember?: (member: OrganizationMember) => void;
    onUnsuspendMember?: (member: OrganizationMember) => void;
    onRemoveMember?: (member: OrganizationMember) => void;
};

export function useTeamMembersColumns(options: UseTeamMembersColumnsOptions): ColumnDef<OrganizationMember>[] {
    const { t } = useTranslation();
    const { onChangeRole, onSuspendMember, onUnsuspendMember, onRemoveMember } = options;

    const statusLabels: Record<string, string> = {
        accepted: t('status.accepted'),
        invited: t('status.pending'),
        suspended: t('status.suspended'),
    };

    return [
        {
            id: 'email',
            accessorKey: 'email',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.member')} />,
            cell: ({ row }) => {
                const { email, user } = row.original;
                const { firstName, lastName } = user || row.original;
                const fullName = firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}`.trim() : null;
                const initials = fullName
                    ? fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                    : (email?.slice(0, 2).toUpperCase() ?? '??');

                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                            <AvatarImage src={user?.profileImage?.url ?? undefined} />
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">{fullName ?? email}</span>
                            {fullName && <span className="text-muted-foreground text-xs">{email}</span>}
                        </div>
                    </div>
                );
            },
            meta: { className: 'min-w-[200px]' },
        },
        {
            accessorKey: 'role',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.role')} />,
            cell: ({ row }) => {
                const role = row.original.role;
                if (!role) return <span>-</span>;
                return (
                    <Badge variant={roleVariants[role] ?? 'secondary'} className="capitalize">
                        {role.toLowerCase()}
                    </Badge>
                );
            },
            filterFn: 'equals',
            enableSorting: true,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.status')} />,
            cell: ({ row }) => {
                const status = row.original.status;
                if (!status) return <span>-</span>;
                return (
                    <div className="bg-muted flex w-fit items-center gap-1.5 rounded-md px-2 py-0.5">
                        <div className={`size-2 rounded-full ${statusColors[status] ?? 'bg-gray-400'}`} />
                        <span className="text-xs font-medium">{statusLabels[status] ?? status.toLowerCase()}</span>
                    </div>
                );
            },
            filterFn: 'equals',
            enableSorting: true,
        },
        {
            accessorKey: 'createdAt',
            header: ({ column }) => <CollectionColumnHeader column={column} title={t('field.joined')} />,
            cell: ({ row }) => (
                <div className="text-sm">
                    {row.getValue('createdAt') ? format(row.getValue('createdAt'), 'dd/MM/yyyy') : '-'}
                </div>
            ),
            enableSorting: true,
        },
        {
            id: 'actions',
            header: () => <div className="text-right">{t('field.actions')}</div>,
            cell: ({ row }) => {
                const isSuspended = row.original.status === 'suspended';

                return (
                    <div className="flex items-center justify-end gap-1">
                        <CollectionRowActions
                            row={row}
                            actions={[
                                {
                                    label: t('organizations.changeRole'),
                                    icon: UserCog,
                                    onClick: (member: OrganizationMember) => {
                                        onChangeRole?.(member);
                                    },
                                },
                                isSuspended
                                    ? {
                                          label: t('organizations.restoreAccess'),
                                          icon: IconCircleCheck,
                                          onClick: (member: OrganizationMember) => {
                                              onUnsuspendMember?.(member);
                                          },
                                      }
                                    : {
                                          label: t('organizations.suspendAccess'),
                                          icon: IconBan,
                                          onClick: (member: OrganizationMember) => {
                                              onSuspendMember?.(member);
                                          },
                                      },
                                {
                                    label: t('organizations.removeFromWorkspace'),
                                    icon: Trash,
                                    group: 'danger',
                                    className: 'text-red-500!',
                                    onClick: (member: OrganizationMember) => {
                                        onRemoveMember?.(member);
                                    },
                                },
                            ]}
                        />
                    </div>
                );
            },
        },
    ];
}
