import { useState } from 'react';
import { Collection } from '@maas/web-collection';
import { useTeamMembersColumns } from './hooks/use-team-members-columns';
import {
  useGetOrganizationById,
  useGetOrganizationMembers,
} from '@maas/core-api';
import { LayoutContent, LayoutHeader } from '@maas/web-layout';
import { useGetCurrentWorkspaceId } from '@maas/core-workspace';
import { OrganizationMember } from '@maas/core-api-models';
import { InviteFormSection } from './components/invite-form-section';
import { ChangeMemberRoleModal } from './modals/change-member-role-modal';
import { SuspendMemberModal } from './modals/suspend-member-modal';
import { UnsuspendMemberModal } from './modals/unsuspend-member-modal';
import { RemoveMemberModal } from './modals/remove-member-modal';

export function TeamManagerPage() {
  const organizationId = useGetCurrentWorkspaceId();
  const [changeRoleMember, setChangeRoleMember] =
    useState<OrganizationMember | null>(null);
  const [suspendMember, setSuspendMember] = useState<OrganizationMember | null>(
    null,
  );
  const [unsuspendMember, setUnsuspendMember] =
    useState<OrganizationMember | null>(null);
  const [removeMember, setRemoveMember] = useState<OrganizationMember | null>(
    null,
  );

  const { data: organization } = useGetOrganizationById({
    id: organizationId ?? '',
    fields: { id: null, name: null },
  });

  const columns = useTeamMembersColumns({
    organizationId: organizationId ?? '',
    onChangeRole: (member) => setChangeRoleMember(member),
    onSuspendMember: (member) => setSuspendMember(member),
    onUnsuspendMember: (member) => setUnsuspendMember(member),
    onRemoveMember: (member) => setRemoveMember(member),
  });

  if (!organizationId) {
    return <div>No organization found.</div>;
  }

  return (
    <div>
      <LayoutContent>
        <LayoutHeader
          pageTitle="Team"
          pageDescription={`Inviting people to ${organization?.name ?? 'workspace'}.`}
        />
        <div className="flex flex-col gap-8">
          {/* Invite Section */}
          <InviteFormSection organizationId={organizationId} />

          {/* Members Table */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold">Members</h2>
            <Collection
              useLocationAsState
              columns={columns}
              filtersConfiguration={{
                textFilter: {
                  placeholder: 'Search members by name or email',
                  queryParamName: 'term',
                },
                facetedFilters: [
                  {
                    columnId: 'role',
                    title: 'Role',
                    queryParamName: 'role',
                    options: [
                      { value: 'admin', label: 'Admin' },
                      { value: 'editor', label: 'Editor' },
                      { value: 'viewer', label: 'Viewer' },
                    ],
                  },
                  {
                    columnId: 'status',
                    title: 'Status',
                    queryParamName: 'status',
                    options: [
                      { value: 'INVITED', label: 'Pending' },
                      { value: 'ACCEPTED', label: 'Active' },
                    ],
                  },
                ],
              }}
              useQueryFn={useGetOrganizationMembers}
              staticParams={{ organizationId }}
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
