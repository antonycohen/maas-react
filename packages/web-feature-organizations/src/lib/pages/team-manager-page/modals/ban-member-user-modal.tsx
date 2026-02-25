import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useBanUser, useUnbanUser } from '@maas/core-api';
import { IconCircleCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

type BanMemberUserModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: OrganizationMember;
};

export const BanMemberUserModal = ({ open, onOpenChange, member }: BanMemberUserModalProps) => {
    const { t } = useTranslation();
    const isBanned = member.status === 'suspended';

    const banUser = useBanUser({
        onSuccess: () => {
            toast.success(t('users.banSuccess'));
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message || t('users.banError'));
        },
    });

    const unbanUser = useUnbanUser({
        onSuccess: () => {
            toast.success(t('users.unbanSuccess'));
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message || t('users.unbanError'));
        },
    });

    const handleAction = () => {
        if (!member.user?.id) return;
        if (isBanned) {
            unbanUser.mutate({ userId: member.user.id });
        } else {
            banUser.mutate({ userId: member.user.id });
        }
    };

    const isPending = banUser.isPending || unbanUser.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isBanned ? t('users.actions.unbanUser') : t('users.actions.banUser')}</DialogTitle>
                </DialogHeader>

                <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                    <div className="pt-0.5">
                        <IconCircleCheck className="text-destructive size-4" />
                    </div>
                    <div className="text-destructive flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium">{member.email}</p>
                        <p className="text-sm">{isBanned ? t('users.unbanWarning') : t('users.banWarning')}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleAction} isLoading={isPending}>
                        {isBanned ? t('users.actions.unbanUser') : t('users.actions.banUser')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
