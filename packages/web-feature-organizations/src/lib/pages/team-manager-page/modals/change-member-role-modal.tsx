import { Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@maas/web-components';
import { OrganizationMember, UpdateOrganizationMemberRole } from '@maas/core-api-models';
import { useChangeMemberRoleForm } from '../hooks/use-change-member-role-form';
import { IconCircleCheck } from '@tabler/icons-react';
import { createConnectedInputHelpers } from '@maas/web-form';
import { FormProvider } from 'react-hook-form';
import { useTranslation } from '@maas/core-translations';

type ChangeMemberRoleModalProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    organizationId: string;
    member: OrganizationMember;
};

export const ChangeMemberRoleModal = ({ open, onOpenChange, organizationId, member }: ChangeMemberRoleModalProps) => {
    const { t } = useTranslation();

    const roleLabels: Record<string, string> = {
        admin: t('organizations.roleAdmin'),
        editor: t('organizations.roleEditor'),
        viewer: t('organizations.roleViewer'),
    };

    const { form, handleSubmit, isLoading, currentRole } = useChangeMemberRoleForm({
        organizationId,
        member,
        onSuccess: () => onOpenChange(false),
    });

    const { ControlledSelectInput } = createConnectedInputHelpers<UpdateOrganizationMemberRole>();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{t('organizations.changeMemberRole')}</DialogTitle>
                </DialogHeader>

                <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
                    <div className="pt-0.5">
                        <IconCircleCheck className="size-4" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium">{t('organizations.memberLabel', { email: member.email })}</p>
                        <p className="text-muted-foreground text-sm">
                            {t('organizations.currentRole', { role: currentRole ? roleLabels[currentRole] : '-' })}
                        </p>
                    </div>
                </div>

                <FormProvider {...form}>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <ControlledSelectInput
                            direction="vertical"
                            name={'role'}
                            label={t('organizations.newRole')}
                            options={[
                                { value: 'viewer', label: t('organizations.roleViewer') },
                                { value: 'editor', label: t('organizations.roleEditor') },
                                { value: 'admin', label: t('organizations.roleAdmin') },
                            ]}
                        />

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                {t('common.cancel')}
                            </Button>
                            <Button type="submit" isLoading={isLoading}>
                                {t('organizations.changeRole')}
                            </Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
};
