import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useDeleteUser } from '@maas/core-api';
import { IconCircleCheck } from '@tabler/icons-react';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

type DeleteMemberUserModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    member: OrganizationMember;
};

export const DeleteMemberUserModal = ({ open, onOpenChange, member }: DeleteMemberUserModalProps) => {
    const { t } = useTranslation();

    const deleteUser = useDeleteUser({
        onSuccess: () => {
            toast.success(t('users.deleteSuccess'));
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message || t('users.deleteError'));
        },
    });

    const handleDelete = () => {
        if (!member.user?.id) return;
        deleteUser.mutate({ userId: member.user.id });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('users.actions.deleteUser')}</DialogTitle>
                </DialogHeader>

                <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                    <div className="pt-0.5">
                        <IconCircleCheck className="text-destructive size-4" />
                    </div>
                    <div className="text-destructive flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium">{member.email}</p>
                        <p className="text-sm">{t('users.deleteWarning')}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="button" variant="destructive" onClick={handleDelete} isLoading={deleteUser.isPending}>
                        <Trash className="size-4" />
                        {t('common.delete')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
