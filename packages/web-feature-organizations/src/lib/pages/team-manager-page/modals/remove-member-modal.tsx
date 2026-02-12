import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useRemoveOrganizationMember } from '@maas/core-api';
import { IconCircleCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';
import { useTranslation } from '@maas/core-translations';

type RemoveMemberModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationId: string;
    member: OrganizationMember;
};

export const RemoveMemberModal = ({ open, onOpenChange, organizationId, member }: RemoveMemberModalProps) => {
    const { t } = useTranslation();
    const isInvited = member.status === 'invited';

    const removeMember = useRemoveOrganizationMember({
        onSuccess: () => {
            toast.success(isInvited ? t('organizations.invitationCancelled') : t('organizations.memberRemoved'));
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message || t('organizations.failedToRemove'));
        },
    });

    const handleRemove = () => {
        if (!member.id) return;
        removeMember.mutate({
            organizationId,
            memberId: member.id,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isInvited ? t('organizations.cancelInvitation') : t('organizations.removeFromWorkspace')}
                    </DialogTitle>
                </DialogHeader>

                <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                    <div className="pt-0.5">
                        <IconCircleCheck className="text-destructive size-4" />
                    </div>
                    <div className="text-destructive flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium">{t('organizations.memberLabel', { email: member.email })}</p>
                        <p className="text-sm">
                            {isInvited ? t('organizations.invitationNoLongerValid') : t('organizations.removeWarning')}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {isInvited ? t('organizations.dontCancel') : t('common.cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleRemove}
                        isLoading={removeMember.isPending}
                    >
                        <Trash className="size-4" />
                        {isInvited ? t('organizations.cancelInvitationAction') : t('organizations.removeMember')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
