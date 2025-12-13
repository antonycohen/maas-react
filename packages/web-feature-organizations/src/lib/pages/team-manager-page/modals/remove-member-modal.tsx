import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useRemoveOrganizationMember } from '@maas/core-api';
import { IconCircleCheck } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Trash } from 'lucide-react';

type RemoveMemberModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  member: OrganizationMember;
};

export const RemoveMemberModal = ({
  open,
  onOpenChange,
  organizationId,
  member,
}: RemoveMemberModalProps) => {
  const isInvited = member.status === 'invited';

  const removeMember = useRemoveOrganizationMember({
    onSuccess: () => {
      toast.success(isInvited ? 'Invitation cancelled' : 'Member removed from workspace');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to remove member');
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
            {isInvited ? 'Cancel invitation?' : 'Remove from workspace'}
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 items-start rounded-lg border border-rose-200 bg-rose-50 px-4 py-3">
          <div className="pt-0.5">
            <IconCircleCheck className="size-4 text-destructive" />
          </div>
          <div className="flex flex-col gap-1 flex-1 text-destructive">
            <p className="text-sm font-medium">
              Member: {member.email}
            </p>
            <p className="text-sm">
              {isInvited
                ? 'The invitation email will no longer be valid.'
                : 'This action cannot be undone. They will lose all access immediately.'}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {isInvited ? "Don't cancel" : 'Cancel'}
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemove}
            isLoading={removeMember.isPending}
          >
            <Trash className="size-4" />
            {isInvited ? 'Cancel invitation' : 'Remove member'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
