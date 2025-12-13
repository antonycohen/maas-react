import {Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,} from '@maas/web-components';
import {OrganizationMember, UpdateOrganizationMemberRole} from '@maas/core-api-models';
import {useChangeMemberRoleForm} from '../hooks/use-change-member-role-form';
import {IconCircleCheck} from '@tabler/icons-react';
import {createConnectedInputHelpers} from "@maas/web-form";
import {FormProvider} from "react-hook-form";

type ChangeMemberRoleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationId: string;
  member: OrganizationMember;
};

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

export const ChangeMemberRoleModal = ({
  open,
  onOpenChange,
  organizationId,
  member,
}: ChangeMemberRoleModalProps) => {
  const { form, handleSubmit, isLoading, currentRole } = useChangeMemberRoleForm({
    organizationId,
    member,
    onSuccess: () => onOpenChange(false),
  });

  const { ControlledSelectInput } = createConnectedInputHelpers<UpdateOrganizationMemberRole>()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change member role</DialogTitle>
        </DialogHeader>

        <div className="flex gap-3 items-center rounded-lg border px-4 py-3">
          <div className="pt-0.5">
            <IconCircleCheck className="size-4" />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-sm font-medium">
              Member : <span className="font-medium">{member.email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Current role: {currentRole ? roleLabels[currentRole] : '-'}
            </p>
          </div>
        </div>

        <FormProvider {...form}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <ControlledSelectInput direction="vertical" name={"role"} label={"NewRole"} options={[
              { value: 'viewer', label: 'Viewer' },
              { value: 'editor', label: 'Editor' },
              { value: 'admin', label: 'Admin' },
            ]} />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                Change role
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
