import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useSuspendOrganizationMember } from '@maas/core-api';
import { IconCircleCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

type SuspendMemberModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationId: string;
    member: OrganizationMember;
};

export const SuspendMemberModal = ({ open, onOpenChange, organizationId, member }: SuspendMemberModalProps) => {
    const { t } = useTranslation();

    const suspendMember = useSuspendOrganizationMember({
        onSuccess: () => {
            toast.success(t('organizations.memberSuspended'));
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message || t('organizations.failedToSuspend'));
        },
    });

    const handleSuspend = () => {
        if (!member.id) return;
        suspendMember.mutate({
            organizationId,
            memberId: member.id,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('organizations.suspendAccess')}</DialogTitle>
                </DialogHeader>

                <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
                    <div className="pt-0.5">
                        <IconCircleCheck className="text-destructive size-4" />
                    </div>
                    <div className="text-destructive flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium">{t('organizations.memberLabel', { email: member.email })}</p>
                        <p className="text-sm">{t('organizations.suspendDescription')}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleSuspend}
                        isLoading={suspendMember.isPending}
                    >
                        {t('organizations.suspend')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
