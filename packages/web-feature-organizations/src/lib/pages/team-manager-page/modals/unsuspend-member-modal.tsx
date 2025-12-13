import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@maas/web-components';
import { OrganizationMember } from '@maas/core-api-models';
import { useUnsuspendOrganizationMember } from '@maas/core-api';
import { IconCircleCheck } from '@tabler/icons-react';
import { toast } from 'sonner';

type UnsuspendMemberModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  member: OrganizationMember;
};

export const UnsuspendMemberModal = ({
  open,
  onOpenChange,
  organizationId,
  member,
}: UnsuspendMemberModalProps) => {
  const unsuspendMember = useUnsuspendOrganizationMember({
    onSuccess: () => {
      toast.success('Member access restored');
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to restore member access');
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
          <DialogTitle>Restore access</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 items-start rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="pt-0.5">
            <IconCircleCheck className="size-4 text-emerald-600" />
          </div>
          <div className="flex flex-col gap-1 flex-1 text-emerald-700">
            <p className="text-sm font-medium">
              Member: {member.email}
            </p>
            <p className="text-sm">
              They will regain access to the workspace
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
            onClick={handleUnsuspend}
            isLoading={unsuspendMember.isPending}
          >
            Restore access
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
