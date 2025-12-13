import { useForm } from 'react-hook-form';
import { InviteOrganizationMember, inviteOrganizationMemberSchema } from '@maas/core-api-models';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInviteOrganizationMember } from '@maas/core-api';
import { handleApiError } from '@maas/web-form';
import { toast } from 'sonner';

export const useInviteOrganizationMemberForm = (organizationId: string) => {

  const form = useForm<InviteOrganizationMember>({
    resolver: zodResolver(inviteOrganizationMemberSchema),
    defaultValues: {
      email: '',
      role: 'editor',
    },
  });

  const inviteMember = useInviteOrganizationMember({
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      form.reset();
    },
    onError: (error) => handleApiError(error, form),
  });

  const handleSubmit = form.handleSubmit((data) => {
    inviteMember.mutate({
      organizationId,
      data,
    });
  });

  return { form, handleSubmit, isLoading: inviteMember.isPending };
};
