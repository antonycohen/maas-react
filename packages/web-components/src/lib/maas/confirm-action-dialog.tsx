import { useState, useEffect, useCallback } from 'react';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

export type ConfirmActionDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'destructive' | 'default';
    isLoading?: boolean;
    countdown?: number;
};

export function ConfirmActionDialog({
    open,
    onOpenChange,
    onConfirm,
    title = 'Are you sure?',
    description = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    variant = 'destructive',
    isLoading = false,
    countdown = 5,
}: ConfirmActionDialogProps) {
    const [remaining, setRemaining] = useState(countdown);

    useEffect(() => {
        if (!open) {
            setRemaining(countdown);
            return;
        }

        if (countdown <= 0) return;

        setRemaining(countdown);
        const interval = setInterval(() => {
            setRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [open, countdown]);

    const handleConfirm = useCallback(() => {
        onConfirm();
    }, [onConfirm]);

    const isDisabled = remaining > 0 || isLoading;

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className={variant === 'destructive' ? 'text-destructive' : undefined}>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isLoading}>{cancelLabel}</AlertDialogCancel>
                    <Button variant={variant} onClick={handleConfirm} disabled={isDisabled} isLoading={isLoading}>
                        {remaining > 0 ? `${confirmLabel} (${remaining}s)` : confirmLabel}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
