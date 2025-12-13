import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Tooltip, TooltipContent, TooltipTrigger } from "@maas/web-components";
import { useInviteOrganizationMemberForm } from "../hooks/use-invite-organization-member-form";
import { Controller } from "react-hook-form";

export const InviteFormSection = ({ organizationId }: {
  organizationId: string;
}) => {
  const { form, isLoading, handleSubmit } = useInviteOrganizationMemberForm(organizationId);

  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm">
              Need help ?
            </Button>
          </TooltipTrigger>
          <TooltipContent className="text-left">
            <ul className="space-y-1">
              <li><strong>Admin</strong> - Full access except billing (PRO)</li>
              <li><strong>Editor</strong> - Create, modify and publish campaigns (default)</li>
              <li><strong>Viewer</strong> - View-only access (PRO)</li>
            </ul>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="bg-muted rounded-md px-6 py-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <span className="font-semibold text-base whitespace-nowrap">
            Invite new members
          </span>
          <div className="flex-1 flex items-center gap-2">
            <Input
              placeholder="Add emails"
              {...form.register('email')}
              className="flex-1"
            />
            <Controller
              control={form.control}
              name="role"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <Button
              type="submit"
              disabled={!form.formState.isValid}
              isLoading={isLoading}
            >
              Invite
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
