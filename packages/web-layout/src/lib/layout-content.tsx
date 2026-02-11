import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { cn } from '@maas/core-utils';

export function LayoutContent(props: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
    return (
        <div
            className={cn(
                'container mx-auto flex flex-col justify-start gap-8 self-stretch px-8 py-10',
                props.className
            )}
        >
            {props.children}
        </div>
    );
}
