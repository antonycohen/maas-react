import { cn } from '@maas/core-utils';

export type TagStyle = 'Light' | 'Accent';

export interface TagProps {
  label: string;
  style?: TagStyle;
  className?: string;
}

export function Tag({ label, style = 'Accent', className }: TagProps) {
  return (
    <div
      className={cn(
        'flex h-6 items-center justify-center rounded px-2 py-0 text-[10px] font-semibold uppercase tracking-[0.33px]',
        style === 'Light' && 'bg-background border border-border text-foreground',
        style === 'Accent' && 'bg-brand-primary text-white',
        className
      )}
    >
      {label}
    </div>
  );
}
