import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Input,
} from '@maas/web-components';

type DeleteAccountConfirmationAlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

const CONFIRMATION_TEXT = 'DELETE';

export const DeleteAccountConfirmationAlertDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: DeleteAccountConfirmationAlertDialogProps) => {
  const [confirmationInput, setConfirmationInput] = useState('');

  const isConfirmationValid = confirmationInput === CONFIRMATION_TEXT;

  const handleConfirm = () => {
    if (isConfirmationValid) {
      onConfirm();
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setConfirmationInput('');
    }
    onOpenChange(newOpen);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <span className="text-destructive">Delete Account</span>
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>This action will:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Remove all your personal data</li>
                <li>Cannot be undone</li>
              </ul>
              <div className="pt-2">
                <p className="mb-2">
                  Type "<span className="font-semibold">{CONFIRMATION_TEXT}</span>" to confirm:
                </p>
                <Input
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder={CONFIRMATION_TEXT}
                  autoComplete="off"
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isLoading}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isLoading ? 'Deleting...' : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
