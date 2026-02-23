import * as React from 'react';
import { cn } from '@maas/core-utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
    return (
        <textarea
            data-slot="textarea"
            className={cn(
                'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-input-background flex field-sizing-content min-h-16 w-full rounded-md border px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                'read-only:bg-muted read-only:text-muted-foreground read-only:focus-visible:border-input read-only:cursor-default read-only:focus-visible:ring-0',
                className
            )}
            {...props}
        />
    );
}

export { Textarea };
