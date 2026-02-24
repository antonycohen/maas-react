import { CircleCheckIcon, CircleXIcon, InfoIcon, Loader2Icon, TriangleAlertIcon } from 'lucide-react';
import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4 text-emerald-500" />,
                info: <InfoIcon className="size-4 text-blue-500" />,
                warning: <TriangleAlertIcon className="size-4 text-amber-500" />,
                error: <CircleXIcon className="size-4 text-red-500" />,
                loading: <Loader2Icon className="text-muted-foreground size-4 animate-spin" />,
            }}
            toastOptions={{
                duration: 6000,
                classNames: {
                    toast: 'group-[.toaster]:border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg',
                    success:
                        'group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-900 group-[.toaster]:border-emerald-200 dark:group-[.toaster]:bg-emerald-950 dark:group-[.toaster]:text-emerald-100 dark:group-[.toaster]:border-emerald-800',
                    error: 'group-[.toaster]:bg-red-50 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200 dark:group-[.toaster]:bg-red-950 dark:group-[.toaster]:text-red-100 dark:group-[.toaster]:border-red-800',
                    warning:
                        'group-[.toaster]:bg-amber-50 group-[.toaster]:text-amber-900 group-[.toaster]:border-amber-200 dark:group-[.toaster]:bg-amber-950 dark:group-[.toaster]:text-amber-100 dark:group-[.toaster]:border-amber-800',
                    info: 'group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200 dark:group-[.toaster]:bg-blue-950 dark:group-[.toaster]:text-blue-100 dark:group-[.toaster]:border-blue-800',
                    description: 'group-[.toast]:text-current/70',
                    actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                    cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                },
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)',
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };
