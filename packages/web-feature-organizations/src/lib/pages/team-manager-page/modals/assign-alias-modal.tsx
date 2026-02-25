import { useMemo, useState } from 'react';
import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Badge,
    AsyncCombobox,
    type AsyncComboboxOption,
} from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useGetPermissionAliases, useAssignAliasToUser } from '@maas/core-api';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

type AssignAliasModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: OrganizationMember;
};

export const AssignAliasModal = ({ open, onOpenChange, member }: AssignAliasModalProps) => {
    const { t } = useTranslation();
    const [selected, setSelected] = useState<AsyncComboboxOption | null>(null);
    const [search, setSearch] = useState('');

    const { data: aliases, isLoading } = useGetPermissionAliases({ enabled: open });

    const assignAlias = useAssignAliasToUser({
        onSuccess: () => {
            toast.success(t('permissions.assignAliasSuccess'));
            setSelected(null);
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message || t('permissions.assignAliasError'));
        },
    });

    const options = useMemo(() => {
        const all = (aliases ?? []).map((a) => ({ id: a.id, label: a.id }));
        if (!search) return all;
        const lower = search.toLowerCase();
        return all.filter((o) => o.label.toLowerCase().includes(lower));
    }, [aliases, search]);

    const handleAssign = () => {
        if (!member.user?.id || !selected) return;
        assignAlias.mutate({
            permissions_alias: { id: selected.id },
            user: { id: member.user.id },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('permissions.assignAlias')}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground text-sm">{t('permissions.userLabel')}</span>
                        <Badge variant="outline">{member.email}</Badge>
                    </div>

                    <AsyncCombobox
                        value={selected}
                        onChange={setSelected}
                        onSearchChange={setSearch}
                        options={options}
                        isLoading={isLoading}
                        placeholder={t('permissions.selectAlias')}
                        searchPlaceholder={t('common.search')}
                        emptyMessage={t('permissions.noAliases')}
                    />
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="button" onClick={handleAssign} disabled={!selected} isLoading={assignAlias.isPending}>
                        {t('permissions.assign')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
