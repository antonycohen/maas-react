import { useState } from 'react';
import { useOutletContext } from 'react-router';
import { EditUserOutletContext } from '../../types';
import { UpdateLocalizationPreferencesSection } from './components/update-localization-preferences-section';
import { UpdateNotificationsPreferencesSection } from './components/update-notifications-preferences-section';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, Button } from '@maas/web-components';
import { useDeleteUser } from '@maas/core-api';
import { toast } from 'sonner';
import { DeleteAccountConfirmationAlertDialog } from '../account-profile-tab/modals/delete-account-confirmation-alert-dialog';

export const AccountPreferencesTab = () => {
    const { user, isLoading } = useOutletContext<EditUserOutletContext>();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const deleteUser = useDeleteUser({
        onSuccess: () => {
            toast.success('Account deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete account');
        },
    });

    const handleDeleteAccount = () => {
        if (!user) return;
        deleteUser.mutate({ userId: user.id as string });
    };

    if (isLoading || !user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex flex-col gap-6">
            <UpdateLocalizationPreferencesSection user={user} />
            <UpdateNotificationsPreferencesSection user={user} />

            <div className="mt-8 flex flex-col gap-4">
                <h2 className="font-barlow-semi-condensed text-2xl font-semibold text-red-600">Danger Zone</h2>
                <Card className="rounded-lg border-red-200">
                    <CardHeader>
                        <CardTitle className="text-xl">Delete account</CardTitle>
                        <CardDescription>
                            This will permanently delete your Personal Account. Please note that this action is
                            irreversible, so proceed with caution.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="justify-between border-t bg-red-50/50 p-4">
                        <p className="text-destructive text-sm font-medium">This action cannot be undone!</p>
                        <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
                            Delete account
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <DeleteAccountConfirmationAlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={handleDeleteAccount}
                isLoading={deleteUser.isPending}
            />
        </div>
    );
};
