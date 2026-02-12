import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useUnsuspendOrganizationMember } from '@maas/core-api';
import { IconCircleCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { useTranslation } from '@maas/core-translations';

type UnsuspendMemberModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationId: string;
    member: OrganizationMember;
};

export const UnsuspendMemberModal = ({ open, onOpenChange, organizationId, member }: UnsuspendMemberModalProps) => {
    const { t } = useTranslation();

    const unsuspendMember = useUnsuspendOrganizationMember({
        onSuccess: () => {
            toast.success(t('organizations.memberRestored'));
            onOpenChange(false);
        },
        onError: (error) => {
            toast.error(error.message || t('organizations.failedToRestore'));
        },
    });

    const handleUnsuspend = () => {
        if (!member.id) return;
        unsuspendMember.mutate({
            organizationId,
            memberId: member.id,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('organizations.restoreAccess')}</DialogTitle>
                </DialogHeader>

                <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <div className="pt-0.5">
                        <IconCircleCheck className="size-4 text-emerald-600" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 text-emerald-700">
                        <p className="text-sm font-medium">{t('organizations.memberLabel', { email: member.email })}</p>
                        <p className="text-sm">{t('organizations.restoreDescription')}</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="button" onClick={handleUnsuspend} isLoading={unsuspendMember.isPending}>
                        {t('organizations.restoreAccess')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
