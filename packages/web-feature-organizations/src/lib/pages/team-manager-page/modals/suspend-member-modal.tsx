import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useSuspendOrganizationMember } from '@maas/core-api';
import { IconCircleCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

type SuspendMemberModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  member: OrganizationMember;
};

export const SuspendMemberModal = ({
  open,
  onOpenChange,
  organizationId,
  member,
}: SuspendMemberModalProps) => {
  const suspendMember = useSuspendOrganizationMember({
    onSuccess: () => {
      toast.success('Member access suspended');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to suspend member');
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
          <DialogTitle>Suspend access</DialogTitle>
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
              They won't be able to access the workspace but can be reactivated
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleSuspend}
            isLoading={suspendMember.isPending}
          >
            Suspend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
