import { useState } from 'react';
import { IconCheck, IconCopy } from '@tabler/icons-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';

type ReadonlyCopyFieldProps = {
    label: string;
    value: string;
    direction?: 'horizontal' | 'vertical';
    className?: string;
};

export function ReadonlyCopyField({ label, value, direction = 'vertical', className }: ReadonlyCopyFieldProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(value);
        setCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    const fieldContent = (
        <div className="bg-muted flex items-center gap-2 rounded-md border px-3 py-1.5">
            <span className="text-muted-foreground min-w-0 flex-1 truncate font-mono text-sm">{value}</span>
            <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={handleCopy}>
                {copied ? (
                    <IconCheck className="h-3.5 w-3.5 text-green-500" />
                ) : (
                    <IconCopy className="text-muted-foreground h-3.5 w-3.5" />
                )}
            </Button>
        </div>
    );

    if (direction === 'horizontal') {
        return (
            <div className={`flex items-center ${className ?? ''}`}>
                <span className="basis-1/2 text-sm font-semibold">{label}</span>
                <div className="basis-1/2">{fieldContent}</div>
            </div>
        );
    }

    return (
        <div className={className}>
            <span className="mb-1.5 block text-sm font-medium">{label}</span>
            {fieldContent}
        </div>
    );
}
