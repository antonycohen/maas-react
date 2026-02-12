import {
    Button,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@maas/web-components';
import { useInviteOrganizationMemberForm } from '../hooks/use-invite-organization-member-form';
import { Controller } from 'react-hook-form';
import { useTranslation } from '@maas/core-translations';

export const InviteFormSection = ({ organizationId }: { organizationId: string }) => {
    const { form, isLoading, handleSubmit } = useInviteOrganizationMemberForm(organizationId);
    const { t } = useTranslation();

    return (
        <div className="flex flex-col gap-1">
            <div className="flex justify-end">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm">
                            {t('organizations.needHelp')}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-left">
                        <ul className="space-y-1">
                            <li>
                                <strong>{t('organizations.roleAdmin')}</strong> - {t('organizations.adminTooltip')}
                            </li>
                            <li>
                                <strong>{t('organizations.roleEditor')}</strong> - {t('organizations.editorTooltip')}
                            </li>
                            <li>
                                <strong>{t('organizations.roleViewer')}</strong> - {t('organizations.viewerTooltip')}
                            </li>
                        </ul>
                    </TooltipContent>
                </Tooltip>
            </div>
            <div className="bg-muted rounded-md px-6 py-3">
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <span className="text-base font-semibold whitespace-nowrap">
                        {t('organizations.inviteNewMembers')}
                    </span>
                    <div className="flex flex-1 items-center gap-2">
                        <Input
                            placeholder={t('organizations.addEmails')}
                            {...form.register('email')}
                            className="flex-1"
                        />
                        <Controller
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder={t('field.role')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="viewer">{t('organizations.roleViewer')}</SelectItem>
                                        <SelectItem value="editor">{t('organizations.roleEditor')}</SelectItem>
                                        <SelectItem value="admin">{t('organizations.roleAdmin')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <Button type="submit" disabled={!form.formState.isValid} isLoading={isLoading}>
                            {t('common.invite')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
