import { useForm } from 'react-hook-form';
import {
  MemberRole,
  OrganizationMember,
  UpdateOrganizationMemberRole,
  updateOrganizationMemberRoleSchema,
} from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateOrganizationMemberRole } from '@maas/core-api';
import { handleApiError } from '@maas/web-form';
import { toast } from 'sonner';

type UseChangeMemberRoleFormOptions = {
  organizationId: string;
  member: OrganizationMember;
  onSuccess?: () => void;
};

export const useChangeMemberRoleForm = ({
  organizationId,
  member,
  onSuccess,
}: UseChangeMemberRoleFormOptions) => {
  const form = useForm<UpdateOrganizationMemberRole>({
    resolver: zodResolver(updateOrganizationMemberRoleSchema),
    defaultValues: {
      role: member.role ?? 'viewer',
    },
  });

  const updateMember = useUpdateOrganizationMemberRole({
    onSuccess: () => {
      toast.success('Member role updated successfully');
      onSuccess?.();
    },
    onError: (error) => handleApiError(error, form),
  });

  const handleSubmit = form.handleSubmit((data) => {
    if (!member.id) return;
    updateMember.mutate({
      organizationId,
      memberId: member.id,
      data,
    });
  });

  const currentRole = member.role as MemberRole | null;

  return { form, handleSubmit, isLoading: updateMember.isPending, currentRole };
};
