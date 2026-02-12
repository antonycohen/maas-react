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
import { useTranslation } from '@maas/core-translations';

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
    const { t } = useTranslation();
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
                        <span className="text-destructive">{t('users.deleteAccount')}</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="space-y-4">
                            <p>{t('users.deleteAccountWarning')}</p>
                            <ul className="list-inside list-disc space-y-1 text-sm">
                                <li>{t('users.removePersonalData')}</li>
                                <li>{t('users.cannotBeUndone')}</li>
                            </ul>
                            <div className="pt-2">
                                <p className="mb-2">{t('users.typeDeleteToConfirm')}</p>
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
                    <AlertDialogCancel disabled={isLoading}>{t('common.cancel')}</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleConfirm}
                        disabled={!isConfirmationValid || isLoading}
                        className="bg-destructive hover:bg-destructive/90 text-white"
                    >
                        {isLoading ? t('users.deleting') : t('users.continue')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
