import { useState } from 'react';
import { Collection } from '@maas/web-collection';
import { useTeamMembersColumns } from './hooks/use-team-members-columns';
import { useGetOrganizationById, useGetOrganizationMembers } from '@maas/core-api';
import { LayoutContent, LayoutHeader } from '@maas/web-layout';
import { useGetCurrentWorkspaceId } from '@maas/core-workspace';
import { OrganizationMember } from '@maas/core-api-models';
import { InviteFormSection } from './components/invite-form-section';
import { ChangeMemberRoleModal } from './modals/change-member-role-modal';
import { SuspendMemberModal } from './modals/suspend-member-modal';
import { UnsuspendMemberModal } from './modals/unsuspend-member-modal';
import { RemoveMemberModal } from './modals/remove-member-modal';
import { useTranslation } from '@maas/core-translations';

export function TeamManagerPage() {
    const { t } = useTranslation();
    const organizationId = useGetCurrentWorkspaceId();
    const [changeRoleMember, setChangeRoleMember] = useState<OrganizationMember | null>(null);
    const [suspendMember, setSuspendMember] = useState<OrganizationMember | null>(null);
    const [unsuspendMember, setUnsuspendMember] = useState<OrganizationMember | null>(null);
    const [removeMember, setRemoveMember] = useState<OrganizationMember | null>(null);
    const { data: organization } = useGetOrganizationById(
        {
            id: organizationId ?? '',
            fields: { id: null, name: null },
        },
        { enabled: !!organizationId }
    );

    const columns = useTeamMembersColumns({
        organizationId: organizationId ?? '',
        onChangeRole: (member) => setChangeRoleMember(member),
        onSuspendMember: (member) => setSuspendMember(member),
        onUnsuspendMember: (member) => setUnsuspendMember(member),
        onRemoveMember: (member) => setRemoveMember(member),
    });

    if (!organizationId) {
        return <div>{t('organizations.noOrgFound')}</div>;
    }

    return (
        <div>
            <LayoutContent>
                <LayoutHeader
                    pageTitle={t('organizations.team')}
                    pageDescription={t('organizations.invitingPeople', { name: organization?.name ?? 'workspace' })}
                />
                <div className="flex flex-col gap-8">
                    {/* Invite Section */}
                    <InviteFormSection organizationId={organizationId} />

                    {/* Members Table */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-xl font-semibold">{t('organizations.members')}</h2>
                        <Collection
                            useLocationAsState
                            columns={columns}
                            filtersConfiguration={{
                                textFilter: {
                                    placeholder: t('organizations.searchMembers'),
                                    queryParamName: 'term',
                                },
                                facetedFilters: [
                                    {
                                        columnId: 'role',
                                        title: t('field.role'),
                                        queryParamName: 'role',
                                        options: [
                                            { value: 'admin', label: t('organizations.roleAdmin') },
                                            { value: 'editor', label: t('organizations.roleEditor') },
                                            { value: 'viewer', label: t('organizations.roleViewer') },
                                        ],
                                    },
                                    {
                                        columnId: 'status',
                                        title: t('field.status'),
                                        queryParamName: 'status',
                                        options: [
                                            { value: 'INVITED', label: t('status.pending') },
                                            { value: 'ACCEPTED', label: t('status.accepted') },
                                        ],
                                    },
                                ],
                            }}
                            useQueryFn={useGetOrganizationMembers}
                            staticParams={{ filters: { organizationId } }}
                            queryFields={{
                                id: null,
                                firstName: null,
                                lastName: null,
                                email: null,
                                role: null,
                                status: null,
                                createdAt: null,
                                user: {
                                    fields: {
                                        id: null,
                                        profileImage: null,
                                        firstName: null,
                                        lastName: null,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </LayoutContent>

            {changeRoleMember && (
                <ChangeMemberRoleModal
                    open={!!changeRoleMember}
                    onOpenChange={(open) => !open && setChangeRoleMember(null)}
                    organizationId={organizationId}
                    member={changeRoleMember}
                />
            )}

            {suspendMember && (
                <SuspendMemberModal
                    open={!!suspendMember}
                    onOpenChange={(open) => !open && setSuspendMember(null)}
                    organizationId={organizationId}
                    member={suspendMember}
                />
            )}

            {unsuspendMember && (
                <UnsuspendMemberModal
                    open={!!unsuspendMember}
                    onOpenChange={(open) => !open && setUnsuspendMember(null)}
                    organizationId={organizationId}
                    member={unsuspendMember}
                />
            )}

            {removeMember && (
                <RemoveMemberModal
                    open={!!removeMember}
                    onOpenChange={(open) => !open && setRemoveMember(null)}
                    organizationId={organizationId}
                    member={removeMember}
                />
            )}
        </div>
    );
}
