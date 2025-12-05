import { ReactNode } from 'react';

type LayoutHeaderProps = {
  pageTitle: string;
  actions?: ReactNode;
};

export function LayoutHeader(props: LayoutHeaderProps) {
  const { pageTitle, actions } = props;

  return (
    <div className="border-border flex flex-col border-b px-4 py-4 md:py-6">
      {/* Main content */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {/* Actions */}
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
